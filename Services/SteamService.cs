using System.Text.RegularExpressions;
using GameTracker.Models;
using Microsoft.Win32;

namespace GameTracker.Services;

public class SteamService
{
    private readonly GameRepository _repository;
    private readonly ILogger<SteamService> _logger;
    private readonly List<FileSystemWatcher> _watchers = new();
    private DateTime _lastAutoScanTime = DateTime.MinValue;
    private readonly object _watcherLock = new();

    public SteamService(GameRepository repository, ILogger<SteamService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public string ResolveSteamPath(string? configuredPath = null)
    {
        if (!string.IsNullOrWhiteSpace(configuredPath) && Directory.Exists(configuredPath))
        {
            return configuredPath;
        }

        var settings = _repository.GetSettings();
        if (!string.IsNullOrWhiteSpace(settings.SteamPath) && Directory.Exists(settings.SteamPath))
        {
            return settings.SteamPath;
        }

        try
        {
            // 64-bit Windows registry
            using var key64 = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\WOW6432Node\Valve\Steam");
            var val64 = key64?.GetValue("InstallPath") as string;
            if (!string.IsNullOrEmpty(val64) && Directory.Exists(val64)) return val64;

            // 32-bit Windows registry
            using var key32 = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Valve\Steam");
            var val32 = key32?.GetValue("InstallPath") as string;
            if (!string.IsNullOrEmpty(val32) && Directory.Exists(val32)) return val32;

            // Current User registry
            using var keyCu = Registry.CurrentUser.OpenSubKey(@"Software\Valve\Steam");
            var valCu = keyCu?.GetValue("SteamPath") as string;
            if (!string.IsNullOrEmpty(valCu))
            {
                var norm = valCu.Replace('/', '\\');
                if (Directory.Exists(norm)) return norm;
            }
        }
        catch (Exception ex)
        {
            _logger.LogDebug(ex, "Registry query for Steam path threw an exception");
        }

        // Common default directories
        string[] candidates = {
            @"C:\Program Files (x86)\Steam",
            @"C:\Program Files\Steam",
            @"D:\Steam",
            @"D:\Games\Steam",
            @"E:\Steam",
            @"E:\Games\Steam"
        };

        foreach (var c in candidates)
        {
            if (Directory.Exists(c)) return c;
        }

        return @"C:\Program Files (x86)\Steam";
    }

    public (int importedCount, int updatedCount, List<string> newGameTitles) ScanAndImportGamesDetailed(bool forceSync = false)
    {
        var settings = _repository.GetSettings();
        var steamPath = ResolveSteamPath(settings.SteamPath);

        if (string.IsNullOrWhiteSpace(steamPath) || !Directory.Exists(steamPath))
        {
            _logger.LogWarning("Steam directory not found: {Path}", steamPath);
            return (0, 0, new List<string>());
        }

        // If forceSync is requested (e.g. user manually clicked "Sync Steam"), clear ignored list so newly installed/restored games are imported
        if (forceSync && settings.IgnoredSteamAppIds != null && settings.IgnoredSteamAppIds.Count > 0)
        {
            _logger.LogInformation("Force sync requested: clearing {Count} ignored Steam game IDs.", settings.IgnoredSteamAppIds.Count);
            settings.IgnoredSteamAppIds.Clear();
            _repository.SaveSettings(settings);
        }

        var libraryPaths = GetLibraryPaths(steamPath);
        int importedCount = 0;
        int updatedCount = 0;
        var newGameTitles = new List<string>();

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

                    // Skip ignored games ONLY if not forceSync
                    if (!forceSync && settings.IgnoredSteamAppIds != null && settings.IgnoredSteamAppIds.Contains(gameInfo.AppId, StringComparer.OrdinalIgnoreCase))
                    {
                        _logger.LogInformation("Skipping deleted/ignored Steam game: {Name} (AppId: {AppId})", gameInfo.Name, gameInfo.AppId);
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
                        newGameTitles.Add(newGame.Title);
                        _logger.LogInformation("Discovered and imported new Steam game: {Name} (AppId: {AppId})", newGame.Title, newGame.SteamAppId);
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
                            updatedCount++;
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to parse manifest {Path}", manifestPath);
                }
            }
        }

        _logger.LogInformation("Steam scan finished. Imported {ImportedCount} new, updated {UpdatedCount} games.", importedCount, updatedCount);
        return (importedCount, updatedCount, newGameTitles);
    }

    public int ScanAndImportGames(bool forceSync = false)
    {
        var (importedCount, _, _) = ScanAndImportGamesDetailed(forceSync);
        return importedCount;
    }

    public void StartWatchingLibraries()
    {
        StopWatchingLibraries();
        var steamPath = ResolveSteamPath();
        var libraryPaths = GetLibraryPaths(steamPath);

        foreach (var lib in libraryPaths)
        {
            var steamapps = Path.Combine(lib, "steamapps");
            if (!Directory.Exists(steamapps)) continue;

            try
            {
                var watcher = new FileSystemWatcher(steamapps, "appmanifest_*.acf")
                {
                    NotifyFilter = NotifyFilters.FileName | NotifyFilters.LastWrite | NotifyFilters.CreationTime,
                    EnableRaisingEvents = true
                };

                FileSystemEventHandler handler = (s, e) =>
                {
                    lock (_watcherLock)
                    {
                        if ((DateTime.UtcNow - _lastAutoScanTime).TotalSeconds < 2) return;
                        _lastAutoScanTime = DateTime.UtcNow;
                    }

                    _logger.LogInformation("Steam library change detected in {Path}: {ChangeType} {Name}. Auto-syncing...", steamapps, e.ChangeType, e.Name);
                    Task.Delay(1200).ContinueWith(_ =>
                    {
                        ScanAndImportGamesDetailed(forceSync: false);
                    });
                };

                watcher.Created += handler;
                watcher.Changed += handler;
                _watchers.Add(watcher);
                _logger.LogInformation("Started file watcher for Steam library: {Path}", steamapps);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to start FileSystemWatcher for {Path}", steamapps);
            }
        }
    }

    public void StopWatchingLibraries()
    {
        foreach (var w in _watchers)
        {
            try
            {
                w.EnableRaisingEvents = false;
                w.Dispose();
            }
            catch { }
        }
        _watchers.Clear();
    }

    private List<string> GetLibraryPaths(string steamPath)
    {
        var paths = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        if (!string.IsNullOrWhiteSpace(steamPath) && Directory.Exists(steamPath))
        {
            paths.Add(steamPath);
        }

        // Parse libraryfolders.vdf
        if (!string.IsNullOrWhiteSpace(steamPath))
        {
            var libraryVdf = Path.Combine(steamPath, "steamapps", "libraryfolders.vdf");
            if (File.Exists(libraryVdf))
            {
                try
                {
                    var content = File.ReadAllText(libraryVdf);
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
        }

        // Scan all drive roots for SteamLibrary folders
        try
        {
            foreach (var drive in DriveInfo.GetDrives().Where(d => d.IsReady))
            {
                var candidate1 = Path.Combine(drive.RootDirectory.FullName, "SteamLibrary");
                if (Directory.Exists(Path.Combine(candidate1, "steamapps")))
                {
                    paths.Add(candidate1);
                }
                var candidate2 = Path.Combine(drive.RootDirectory.FullName, "Games", "SteamLibrary");
                if (Directory.Exists(Path.Combine(candidate2, "steamapps")))
                {
                    paths.Add(candidate2);
                }
            }
        }
        catch { }

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
