namespace GameTracker.Models;

public class AppSettings
{
    public string SteamPath { get; set; } = @"C:\Program Files (x86)\Steam";
    public bool AutoTrackRunningGames { get; set; } = true;
    public bool ScanSteamOnStartup { get; set; } = true;
    public int TrackerIntervalMs { get; set; } = 3000;
}
