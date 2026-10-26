using System.Text.Json.Serialization;

namespace GameTracker.Models;

public class GameItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string Title { get; set; } = string.Empty;
    public string Platform { get; set; } = "PC"; // PC, PlayStation, Switch, Xbox, Steam Deck
    public string Status { get; set; } = "playing"; // plan, playing, on_hold, dropped, completed
    public string? CoverUrl { get; set; }
    public string? ExecutablePath { get; set; }
    public double BaseHours { get; set; } = 0.0;
    public double TrackedSeconds { get; set; } = 0.0;
    
    [JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public double TotalHours => Math.Round(BaseHours + (TrackedSeconds / 3600.0), 1);

    public bool IsSteam { get; set; } = false;
    public string? SteamAppId { get; set; }
    public string Notes { get; set; } = string.Empty;
    public List<TodoItem> ToDos { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastPlayedAt { get; set; }

    [JsonIgnore]
    public bool IsRunning { get; set; } = false;
}
