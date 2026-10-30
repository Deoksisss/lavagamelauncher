using System.Diagnostics;
using GameTracker.Models;

namespace GameTracker.Services;

public class GameLaunchService
{
    private readonly GameRepository _repository;
    private readonly ILogger<GameLaunchService> _logger;

    public GameLaunchService(GameRepository repository, ILogger<GameLaunchService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public (bool Success, string Message) LaunchGame(string gameId)
    {
        var game = _repository.GetGame(gameId);
        if (game == null)
        {
            return (false, "Игра не найдена в библиотеке.");
        }

        var settings = _repository.GetSettings();

        // 1. Steam Games
        if (game.IsSteam || !string.IsNullOrWhiteSpace(game.SteamAppId))
        {
            var appId = game.SteamAppId;
            if (string.IsNullOrWhiteSpace(appId))
            {
                return (false, $"У игры «{game.Title}» не указан Steam App ID.");
            }

            // Strategy A: URL protocol steam://rungameid/{appId}
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = $"steam://rungameid/{appId}",
                    UseShellExecute = true
                };
                Process.Start(psi);
                _logger.LogInformation("Launched Steam game via protocol: {Title} (AppId: {AppId})", game.Title, appId);
                return (true, $"Запуск «{game.Title}» через Steam...");
            }
            catch (Exception exProto)
            {
                _logger.LogWarning(exProto, "Failed to launch Steam game via protocol, trying steam.exe CLI");
            }

            // Strategy B: steam.exe -applaunch {appId}
            var steamPath = settings.SteamPath ?? @"C:\Program Files (x86)\Steam";
            var steamExe = Path.Combine(steamPath, "steam.exe");
            if (File.Exists(steamExe))
            {
                try
                {
                    var psi = new ProcessStartInfo
                    {
                        FileName = steamExe,
                        Arguments = $"-applaunch {appId}",
                        UseShellExecute = true
                    };
                    Process.Start(psi);
                    _logger.LogInformation("Launched Steam game via steam.exe: {Title} (AppId: {AppId})", game.Title, appId);
                    return (true, $"Запуск «{game.Title}» через клиент Steam...");
                }
                catch (Exception exCli)
                {
                    _logger.LogWarning(exCli, "Failed to launch Steam game via steam.exe CLI");
                }
            }

            // Strategy C: Direct Executable fallback if known
            if (!string.IsNullOrWhiteSpace(game.ExecutablePath) && File.Exists(game.ExecutablePath))
            {
                try
                {
                    var psi = new ProcessStartInfo
                    {
                        FileName = game.ExecutablePath,
                        WorkingDirectory = Path.GetDirectoryName(game.ExecutablePath) ?? "",
                        UseShellExecute = true
                    };
                    Process.Start(psi);
                    _logger.LogInformation("Launched Steam game directly via executable: {Title}", game.Title);
                    return (true, $"Запуск «{game.Title}» напрямую из папки...");
                }
                catch (Exception exDir)
                {
                    _logger.LogError(exDir, "Failed to launch Steam game directly via executable");
                }
            }

            return (false, $"Не удалось запустить игру «{game.Title}». Убедитесь, что Steam установлен и запущен.");
        }

        // 2. Non-Steam games with ExecutablePath
        if (!string.IsNullOrWhiteSpace(game.ExecutablePath))
        {
            if (!File.Exists(game.ExecutablePath))
            {
                return (false, $"Файл игры не найден по указанному пути:\n{game.ExecutablePath}");
            }

            try
            {
                var workDir = Path.GetDirectoryName(game.ExecutablePath) ?? "";
                var psi = new ProcessStartInfo
                {
                    FileName = game.ExecutablePath,
                    WorkingDirectory = workDir,
                    UseShellExecute = true
                };
                Process.Start(psi);
                _logger.LogInformation("Launched non-Steam game: {Title} ({Path})", game.Title, game.ExecutablePath);
                return (true, $"Игра «{game.Title}» запущена.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to start process: {Path}", game.ExecutablePath);
                return (false, $"Ошибка запуска: {ex.Message}");
            }
        }

        // 3. Platform has no executable
        return (false, $"Для игры «{game.Title}» не указан исполняемый файл (.exe). Откройте свойства игры и укажите путь.");
    }
}
