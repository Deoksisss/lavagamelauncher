using System.Globalization;
using GameTracker.Models;

namespace GameTracker.Services;

public class TopGameStat
{
    public string GameId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? CoverUrl { get; set; }
    public string Platform { get; set; } = "PC";
    public string Status { get; set; } = "playing";
    public double Seconds { get; set; }
    public double Hours => Math.Round(Seconds / 3600.0, 1);
    public double Percentage { get; set; }
}

public class ChartDataDto
{
    public List<string> Labels { get; set; } = new();
    public List<double> Values { get; set; } = new();
    public string Unit { get; set; } = "часов";
}

public class PieChartDto
{
    public List<string> Labels { get; set; } = new();
    public List<double> Values { get; set; } = new();
    public List<string> Colors { get; set; } = new();
}

public class PeriodStatisticsDto
{
    public string Period { get; set; } = "week"; // day, week, month, year
    public string Interval { get; set; } = "standard";
    public double TotalSeconds { get; set; }
    public double TotalHours => Math.Round(TotalSeconds / 3600.0, 1);
    public int ActiveGamesCount { get; set; }
    public List<TopGameStat> TopGames { get; set; } = new();
    public PieChartDto PieChart { get; set; } = new();
    public ChartDataDto HorizontalChart { get; set; } = new();
}

public class StatisticsService
{
    private readonly GameRepository _repository;

    private static readonly string[] Palette = new[]
    {
        "#6366f1", "#38bdf8", "#ec4899", "#10b981", "#f59e0b",
        "#8b5cf6", "#14b8a6", "#f43f5e", "#84cc16", "#eab308"
    };

    public StatisticsService(GameRepository repository)
    {
        _repository = repository;
    }

    public PeriodStatisticsDto GetPeriodStatistics(string period, string? interval = null, string? singleGameId = null)
    {
        period = (period ?? "week").ToLowerInvariant();
        interval = (interval ?? "standard").ToLowerInvariant();

        var now = DateTime.UtcNow;
        DateTime fromUtc;
        DateTime toUtc = now;

        switch (period)
        {
            case "day":
                fromUtc = now.Date;
                toUtc = fromUtc.AddDays(1);
                break;
            case "month":
                fromUtc = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
                toUtc = fromUtc.AddMonths(1);
                break;
            case "year":
                fromUtc = new DateTime(now.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                toUtc = fromUtc.AddYears(1);
                break;
            case "week":
            default:
                period = "week";
                int diff = (7 + (int)now.DayOfWeek - (int)DayOfWeek.Monday) % 7;
                fromUtc = now.Date.AddDays(-diff);
                toUtc = fromUtc.AddDays(7);
                break;
        }

        var logs = _repository.GetActivityLogs(fromUtc, toUtc, singleGameId);
        var gamesMap = _repository.GetAllGames().ToDictionary(g => g.Id);

        var totalSec = logs.Sum(l => l.Seconds);
        var gameGrouped = logs.GroupBy(l => l.GameId)
            .Select(g => new
            {
                GameId = g.Key,
                Seconds = g.Sum(x => x.Seconds)
            })
            .OrderByDescending(x => x.Seconds)
            .ToList();

        var topGames = new List<TopGameStat>();
        foreach (var gg in gameGrouped)
        {
            if (gamesMap.TryGetValue(gg.GameId, out var game))
            {
                topGames.Add(new TopGameStat
                {
                    GameId = game.Id,
                    Title = game.Title,
                    CoverUrl = game.CoverUrl,
                    Platform = game.Platform,
                    Status = game.Status,
                    Seconds = gg.Seconds,
                    Percentage = totalSec > 0 ? Math.Round((gg.Seconds / totalSec) * 100.0, 1) : 0
                });
            }
        }

        // Pie chart data
        var pie = new PieChartDto();
        int colorIdx = 0;
        double otherSec = 0;

        for (int i = 0; i < topGames.Count; i++)
        {
            if (i < 6)
            {
                pie.Labels.Add(topGames[i].Title);
                pie.Values.Add(topGames[i].Hours);
                pie.Colors.Add(Palette[colorIdx % Palette.Length]);
                colorIdx++;
            }
            else
            {
                otherSec += topGames[i].Seconds;
            }
        }
        if (otherSec > 0)
        {
            pie.Labels.Add("Остальные");
            pie.Values.Add(Math.Round(otherSec / 3600.0, 1));
            pie.Colors.Add("#64748b");
        }

        // Horizontal chart data
        var horizontal = BuildHorizontalChart(period, interval, fromUtc, toUtc, logs);

        return new PeriodStatisticsDto
        {
            Period = period,
            Interval = interval,
            TotalSeconds = totalSec,
            ActiveGamesCount = gameGrouped.Count,
            TopGames = topGames,
            PieChart = pie,
            HorizontalChart = horizontal
        };
    }

    private ChartDataDto BuildHorizontalChart(string period, string interval, DateTime fromUtc, DateTime toUtc, List<ActivityLog> logs)
    {
        var chart = new ChartDataDto();

        if (period == "day")
        {
            // By hour (0 to 23)
            chart.Unit = "минут";
            for (int h = 0; h < 24; h++)
            {
                chart.Labels.Add($"{h:D2}:00");
                var secInHour = logs
                    .Where(l => l.Timestamp.ToLocalTime().Hour == h)
                    .Sum(l => l.Seconds);
                chart.Values.Add(Math.Round(secInHour / 60.0, 1)); // in minutes for day
            }
        }
        else if (period == "week")
        {
            // By days of week Mon - Sun
            chart.Unit = "часов";
            string[] dayNames = { "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс" };
            for (int i = 0; i < 7; i++)
            {
                var curDay = fromUtc.AddDays(i);
                chart.Labels.Add($"{dayNames[i]} ({curDay.Day})");
                var secInDay = logs
                    .Where(l => l.Timestamp.Date == curDay.Date)
                    .Sum(l => l.Seconds);
                chart.Values.Add(Math.Round(secInDay / 3600.0, 1));
            }
        }
        else if (period == "month")
        {
            // By days of month 1 to N
            chart.Unit = "часов";
            var daysInMonth = DateTime.DaysInMonth(fromUtc.Year, fromUtc.Month);
            for (int d = 1; d <= daysInMonth; d++)
            {
                chart.Labels.Add($"{d}");
                var curDate = new DateTime(fromUtc.Year, fromUtc.Month, d, 0, 0, 0, DateTimeKind.Utc);
                var secInDay = logs
                    .Where(l => l.Timestamp.Date == curDate.Date)
                    .Sum(l => l.Seconds);
                chart.Values.Add(Math.Round(secInDay / 3600.0, 1));
            }
        }
        else // year
        {
            if (interval == "months")
            {
                chart.Unit = "часов";
                string[] monthNames = { "Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек" };
                for (int m = 1; m <= 12; m++)
                {
                    chart.Labels.Add(monthNames[m - 1]);
                    var secInMonth = logs
                        .Where(l => l.Timestamp.Year == fromUtc.Year && l.Timestamp.Month == m)
                        .Sum(l => l.Seconds);
                    chart.Values.Add(Math.Round(secInMonth / 3600.0, 1));
                }
            }
            else // weeks (standard)
            {
                chart.Unit = "часов";
                var cal = CultureInfo.CurrentCulture.Calendar;
                for (int w = 1; w <= 52; w++)
                {
                    chart.Labels.Add($"Н{w}");
                    var secInWeek = logs
                        .Where(l => l.Timestamp.Year == fromUtc.Year && cal.GetWeekOfYear(l.Timestamp, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday) == w)
                        .Sum(l => l.Seconds);
                    chart.Values.Add(Math.Round(secInWeek / 3600.0, 1));
                }
            }
        }

        return chart;
    }
}
