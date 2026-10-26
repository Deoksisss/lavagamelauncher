using System.Collections.Concurrent;
using System.Diagnostics;
using GameTracker.Models;

namespace GameTracker.Services;

public class ProcessTrackerService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ProcessTrackerService> _logger;
    private readonly ConcurrentDictionary<string, DateTime> _runningGames = new();

    public ProcessTrackerService(IServiceProvider serviceProvider, ILogger<ProcessTrackerService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public bool IsGameRunning(string gameId) => _runningGames.ContainsKey(gameId);

    public IReadOnlyCollection<string> GetRunningGameIds() => _runningGames.Keys.ToList();

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("ProcessTrackerService started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var repository = scope.ServiceProvider.GetRequiredService<GameRepository>();
                var settings = repository.GetSettings();

                if (settings.AutoTrackRunningGames)
                {
                    CheckRunningProcesses(repository);
                }

                await Task.Delay(settings.TrackerIntervalMs > 500 ? settings.TrackerIntervalMs : 3000, stoppingToken);
            }
            catch (TaskCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in ProcessTrackerService cycle");
                await Task.Delay(5000, stoppingToken);
            }
        }

        _logger.LogInformation("ProcessTrackerService stopped.");
    }

    private void CheckRunningProcesses(GameRepository repository)
    {
        var gamesWithExe = repository.GetAllGames()
            .Where(g => !string.IsNullOrWhiteSpace(g.ExecutablePath))
            .ToList();

        if (gamesWithExe.Count == 0)
        {
            _runningGames.Clear();
            return;
        }

        // Get snapshot of running Windows processes
        Process[] processes;
        try
        {
            processes = Process.GetProcesses();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to get running processes list");
            return;
        }

        var processNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var processPaths = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var p in processes)
        {
            try
            {
                processNames.Add(p.ProcessName);
                // Attempt to get main module path (may throw access denied for elevated processes)
                try
                {
                    var fullPath = p.MainModule?.FileName;
                    if (!string.IsNullOrEmpty(fullPath))
                    {
                        processPaths.Add(fullPath);
                    }
                }
                catch
                {
                    // Ignore access denied on specific system processes
                }
            }
            catch
            {
                // Process may have exited between listing and inspection
            }
            finally
            {
                p.Dispose();
            }
        }

        var now = DateTime.UtcNow;
        var currentlyRunningIds = new HashSet<string>();

        foreach (var game in gamesWithExe)
        {
            var exe = game.ExecutablePath!.Trim();
            var exeNameWithoutExt = Path.GetFileNameWithoutExtension(exe);

            bool isRunning = processPaths.Contains(exe) || 
                             (!string.IsNullOrEmpty(exeNameWithoutExt) && processNames.Contains(exeNameWithoutExt));

            if (isRunning)
            {
                currentlyRunningIds.Add(game.Id);

                if (_runningGames.TryGetValue(game.Id, out var lastCheckTime))
                {
                    var elapsed = (now - lastCheckTime).TotalSeconds;
                    // Cap elapsed time to avoid runaway if system was sleeping
                    if (elapsed > 0 && elapsed <= 30)
                    {
                        repository.AddPlaytime(game.Id, elapsed);
                    }
                }
                _runningGames[game.Id] = now;
            }
        }

        // Clean up games that stopped running
        var stopped = _runningGames.Keys.Where(id => !currentlyRunningIds.Contains(id)).ToList();
        foreach (var id in stopped)
        {
            _runningGames.TryRemove(id, out _);
        }
    }
}
