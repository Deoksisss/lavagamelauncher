namespace GameTracker.Models;

public class TodoItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string Text { get; set; } = string.Empty;
    public bool Done { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
