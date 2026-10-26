namespace GameTracker.Models;

public class ActivityLog
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string GameId { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public double Seconds { get; set; }
}
