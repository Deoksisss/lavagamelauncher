using System.Text.Json;
using GameTracker.Models;

namespace GameTracker.Services;

public class GameRepository
{
    private readonly string _dataDir;
    private readonly string _gamesFile;
    private readonly string _activityFile;
    private readonly string _settingsFile;

    private readonly object _lock = new();
    private List<GameItem> _games = new();
    private List<ActivityLog> _activityLogs = new();
    private AppSettings _settings = new();

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        PropertyNameCaseInsensitive = true
    };

    public GameRepository(IWebHostEnvironment env)
    {
        _dataDir = Path.Combine(env.ContentRootPath, "data");
        Directory.CreateDirectory(_dataDir);
        Directory.CreateDirectory(Path.Combine(_dataDir, "covers"));

        _gamesFile = Path.Combine(_dataDir, "games.json");
        _activityFile = Path.Combine(_dataDir, "activity.json");
        _settingsFile = Path.Combine(_dataDir, "settings.json");

        LoadData();
    }

    private void LoadData()
    {
        lock (_lock)
        {
            if (File.Exists(_settingsFile))
            {
                try
                {
                    var text = File.ReadAllText(_settingsFile);
                    _settings = JsonSerializer.Deserialize<AppSettings>(text, JsonOptions) ?? new AppSettings();
                }
                catch { _settings = new AppSettings(); }
            }
            else
            {
                SaveSettingsInternal();
            }

            if (File.Exists(_gamesFile))
            {
                try
                {
                    var text = File.ReadAllText(_gamesFile);
                    _games = JsonSerializer.Deserialize<List<GameItem>>(text, JsonOptions) ?? new List<GameItem>();
                }
                catch { _games = new List<GameItem>(); }
            }

            if (File.Exists(_activityFile))
            {
                try
                {
                    var text = File.ReadAllText(_activityFile);
                    _activityLogs = JsonSerializer.Deserialize<List<ActivityLog>>(text, JsonOptions) ?? new List<ActivityLog>();
                }
                catch { _activityLogs = new List<ActivityLog>(); }
            }
        }
    }

    public List<GameItem> GetAllGames()
    {
        lock (_lock)
        {
            return _games.Select(g => Clone(g)).ToList();
        }
    }

    public GameItem? GetGame(string id)
    {
        lock (_lock)
        {
            var g = _games.FirstOrDefault(x => x.Id == id);
            return g != null ? Clone(g) : null;
        }
    }

    public GameItem AddOrUpdateGame(GameItem game)
    {
        lock (_lock)
        {
            var existing = _games.FirstOrDefault(x => x.Id == game.Id);
            if (existing != null)
            {
                existing.Title = game.Title;
                existing.Platform = game.Platform;
                existing.Status = game.Status;
                existing.CoverUrl = game.CoverUrl;
                existing.ExecutablePath = game.ExecutablePath;
                existing.BaseHours = game.BaseHours;
                existing.Notes = game.Notes;
                existing.ToDos = game.ToDos;
                existing.IsSteam = game.IsSteam;
                existing.SteamAppId = game.SteamAppId;
                if (game.LastPlayedAt.HasValue) existing.LastPlayedAt = game.LastPlayedAt;
            }
            else
            {
                if (string.IsNullOrWhiteSpace(game.Id))
                {
                    game.Id = Guid.NewGuid().ToString("N");
                }
                _games.Add(game);
            }
            SaveGamesInternal();
            return Clone(_games.First(x => x.Id == game.Id));
        }
    }

    public bool DeleteGame(string id)
    {
        lock (_lock)
        {
            var g = _games.FirstOrDefault(x => x.Id == id);
            if (g != null)
            {
                _games.Remove(g);
                // Also clean activity logs for this game
                _activityLogs.RemoveAll(a => a.GameId == id);
                SaveGamesInternal();
                SaveActivityInternal();
                return true;
            }
            return false;
        }
    }

    public void AddPlaytime(string gameId, double seconds)
    {
        if (seconds <= 0) return;

        lock (_lock)
        {
            var game = _games.FirstOrDefault(g => g.Id == gameId);
            if (game != null)
            {
                game.TrackedSeconds += seconds;
                game.LastPlayedAt = DateTime.UtcNow;

                _activityLogs.Add(new ActivityLog
                {
                    GameId = gameId,
                    Timestamp = DateTime.UtcNow,
                    Seconds = seconds
                });

                SaveGamesInternal();
                SaveActivityInternal();
            }
        }
    }

    public List<ActivityLog> GetActivityLogs(DateTime fromUtc, DateTime toUtc, string? gameId = null)
    {
        lock (_lock)
        {
            var query = _activityLogs.Where(a => a.Timestamp >= fromUtc && a.Timestamp <= toUtc);
            if (!string.IsNullOrEmpty(gameId))
            {
                query = query.Where(a => a.GameId == gameId);
            }
            return query.ToList();
        }
    }

    public AppSettings GetSettings()
    {
        lock (_lock)
        {
            return new AppSettings
            {
                SteamPath = _settings.SteamPath,
                AutoTrackRunningGames = _settings.AutoTrackRunningGames,
                ScanSteamOnStartup = _settings.ScanSteamOnStartup,
                TrackerIntervalMs = _settings.TrackerIntervalMs
            };
        }
    }

    public void SaveSettings(AppSettings settings)
    {
        lock (_lock)
        {
            _settings = settings;
            SaveSettingsInternal();
        }
    }

    private void SaveGamesInternal()
    {
        var temp = _gamesFile + ".tmp";
        File.WriteAllText(temp, JsonSerializer.Serialize(_games, JsonOptions));
        File.Move(temp, _gamesFile, true);
    }

    private void SaveActivityInternal()
    {
        var temp = _activityFile + ".tmp";
        File.WriteAllText(temp, JsonSerializer.Serialize(_activityLogs, JsonOptions));
        File.Move(temp, _activityFile, true);
    }

    private void SaveSettingsInternal()
    {
        var temp = _settingsFile + ".tmp";
        File.WriteAllText(temp, JsonSerializer.Serialize(_settings, JsonOptions));
        File.Move(temp, _settingsFile, true);
    }

    private static GameItem Clone(GameItem g)
    {
        var json = JsonSerializer.Serialize(g, JsonOptions);
        return JsonSerializer.Deserialize<GameItem>(json, JsonOptions)!;
    }
}
