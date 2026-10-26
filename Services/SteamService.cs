using System.Text.RegularExpressions;
using GameTracker.Models;

namespace GameTracker.Services;

public class SteamService
{
    private readonly GameRepository _repository;
    private readonly ILogger<SteamService> _logger;

    public SteamService(GameRepository repository, ILogger<SteamService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public int ScanAndImportGames()
    {
        var settings = _repository.GetSettings();
        var steamPath = settings.SteamPath;

        if (string.IsNullOrWhiteSpace(steamPath) || !Directory.Exists(steamPath))
        {
            _logger.LogWarning("Steam directory not found: {Path}", steamPath);
            return 0;
        }

        var libraryPaths = GetLibraryPaths(steamPath);
        int importedCount = 0;

        foreach (var libPath in libraryPaths)
        {
            var steamappsDir = Path.Combine(libPath, "steamapps");
            if (!Directory.Exists(steamappsDir)) continue;

            var manifests = Directory.GetFiles(steamappsDir, "appmanifest_*.acf");
            foreach (var manifestPath in manifests)
            {
                try
                {
                    var gameInfo = ParseManifest(manifestPath, libPath);
                    if (gameInfo == null) continue;

                    // Filter out common Steam redistributables
                    if (IsExcludedSteamApp(gameInfo.AppId, gameInfo.Name, gameInfo.InstallDir))
                    {
                        continue;
                    }

                    var allGames = _repository.GetAllGames();
                    var existing = allGames.FirstOrDefault(g => g.SteamAppId == gameInfo.AppId || 
                        (!string.IsNullOrEmpty(gameInfo.Name) && g.Title.Equals(gameInfo.Name, StringComparison.OrdinalIgnoreCase)));

                    if (existing == null)
                    {
                        var newGame = new GameItem
                        {
                            Id = Guid.NewGuid().ToString("N"),
                            Title = gameInfo.Name,
                            Platform = "PC",
                            Status = "playing",
                            IsSteam = true,
                            SteamAppId = gameInfo.AppId,
                            CoverUrl = $"https://steamcdn-a.akamaihd.net/steam/apps/{gameInfo.AppId}/library_600x900_2x.jpg",
                            ExecutablePath = gameInfo.ExecutablePath,
                            CreatedAt = DateTime.UtcNow
                        };
                        _repository.AddOrUpdateGame(newGame);
                        importedCount++;
                    }
                    else
                    {
                        bool updated = false;
                        if (!existing.IsSteam)
                        {
                            existing.IsSteam = true;
                            updated = true;
                        }
                        if (string.IsNullOrEmpty(existing.SteamAppId))
                        {
                            existing.SteamAppId = gameInfo.AppId;
                            updated = true;
                        }
                        if (string.IsNullOrEmpty(existing.ExecutablePath) && !string.IsNullOrEmpty(gameInfo.ExecutablePath))
                        {
                            existing.ExecutablePath = gameInfo.ExecutablePath;
                            updated = true;
                        }
                        if (string.IsNullOrEmpty(existing.CoverUrl))
                        {
                            existing.CoverUrl = $"https://steamcdn-a.akamaihd.net/steam/apps/{gameInfo.AppId}/library_600x900_2x.jpg";
                            updated = true;
                        }
                        if (updated)
                        {
                            _repository.AddOrUpdateGame(existing);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to parse manifest {Path}", manifestPath);
                }
            }
        }

        _logger.LogInformation("Steam scan finished. Imported/updated {Count} games.", importedCount);
        return importedCount;
    }

    private List<string> GetLibraryPaths(string steamPath)
    {
        var paths = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { steamPath };
        var libraryVdf = Path.Combine(steamPath, "steamapps", "libraryfolders.vdf");

        if (File.Exists(libraryVdf))
        {
            try
            {
                var content = File.ReadAllText(libraryVdf);
                // Match "path" "..."
                var matches = Regex.Matches(content, @"""path""\s+""([^""]+)""");
                foreach (Match m in matches)
                {
                    if (m.Groups.Count > 1)
                    {
                        var p = m.Groups[1].Value.Replace(@"\\", @"\");
                        if (Directory.Exists(p))
                        {
                            paths.Add(p);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed reading libraryfolders.vdf");
            }
        }

        return paths.ToList();
    }

    private SteamManifestInfo? ParseManifest(string manifestFile, string libraryPath)
    {
        var content = File.ReadAllText(manifestFile);
        var appIdMatch = Regex.Match(content, @"""appid""\s+""([^""]+)""");
        var nameMatch = Regex.Match(content, @"""name""\s+""([^""]+)""");
        var installDirMatch = Regex.Match(content, @"""installdir""\s+""([^""]+)""");

        if (!appIdMatch.Success || !nameMatch.Success) return null;

        var appId = appIdMatch.Groups[1].Value;
        var name = nameMatch.Groups[1].Value;
        var installDir = installDirMatch.Success ? installDirMatch.Groups[1].Value : "";

        string? exePath = null;
        if (!string.IsNullOrEmpty(installDir))
        {
            var gameDir = Path.Combine(libraryPath, "steamapps", "common", installDir);
            if (Directory.Exists(gameDir))
            {
                exePath = FindPrimaryExecutable(gameDir, name, installDir);
            }
        }

        return new SteamManifestInfo
        {
            AppId = appId,
            Name = name,
            InstallDir = installDir,
            ExecutablePath = exePath
        };
    }

    private string? FindPrimaryExecutable(string gameDir, string gameName, string installDir)
    {
        try
        {
            var exeFiles = Directory.GetFiles(gameDir, "*.exe", SearchOption.AllDirectories)
                .Where(f => !f.Contains("crash_reporter", StringComparison.OrdinalIgnoreCase)
                         && !f.Contains("unins", StringComparison.OrdinalIgnoreCase)
                         && !f.Contains("setup", StringComparison.OrdinalIgnoreCase)
                         && !f.Contains("redist", StringComparison.OrdinalIgnoreCase)
                         && !f.Contains("installer", StringComparison.OrdinalIgnoreCase)
                         && !f.Contains("UnityCrashHandler", StringComparison.OrdinalIgnoreCase))
                .ToList();

            if (exeFiles.Count == 0) return null;

            // Prioritize exe named closely to installDir or gameName
            var cleanName = Regex.Replace(gameName, @"[^a-zA-Z0-9]", "");
            var cleanInstall = Regex.Replace(installDir, @"[^a-zA-Z0-9]", "");

            var best = exeFiles.FirstOrDefault(f =>
                Path.GetFileNameWithoutExtension(f).Equals(cleanInstall, StringComparison.OrdinalIgnoreCase) ||
                Path.GetFileNameWithoutExtension(f).Equals(cleanName, StringComparison.OrdinalIgnoreCase));

            return best ?? exeFiles.FirstOrDefault();
        }
        catch
        {
            return null;
        }
    }

    private static bool IsExcludedSteamApp(string appId, string name, string installDir)
    {
        // 228980 = Steamworks Common Redistributables
        // 250820 = SteamVR
        // 1391110 = Steam Linux Runtime
        var excludedIds = new HashSet<string> { "228980", "250820", "1391110", "1070560" };
        if (excludedIds.Contains(appId)) return true;

        if (name.Contains("Steamworks Common Redistributables", StringComparison.OrdinalIgnoreCase)
            || name.Contains("Steam Linux Runtime", StringComparison.OrdinalIgnoreCase)
            || name.Contains("Proton", StringComparison.OrdinalIgnoreCase)
            || installDir.Equals("Steamworks Shared", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        return false;
    }

    private class SteamManifestInfo
    {
        public string AppId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string InstallDir { get; set; } = string.Empty;
        public string? ExecutablePath { get; set; }
    }
}
