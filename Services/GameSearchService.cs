using System.Text.Json;

namespace GameTracker.Services;

public class GameSearchResult
{
    public string Title { get; set; } = string.Empty;
    public string? CoverUrl { get; set; }
    public string SuggestedPlatform { get; set; } = "PC";
    public string? SteamAppId { get; set; }
    public string Source { get; set; } = "Store";
}

public class GameSearchService
{
    private readonly HttpClient _httpClient;
    private const string RawgApiKey = "c542e67aec3a4340908f9de9e86038af";

    public GameSearchService()
    {
        _httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(6)
        };
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 GameTracker/1.0");
    }

    public async Task<List<GameSearchResult>> SearchGamesAsync(string query)
    {
        var results = new List<GameSearchResult>();
        if (string.IsNullOrWhiteSpace(query)) return results;

        var q = query.Trim();

        // Run Steam Store search and RAWG search in parallel
        var steamTask = SearchSteamStoreAsync(q);
        var rawgTask = SearchRawgAsync(q);

        await Task.WhenAll(steamTask, rawgTask);

        var steamResults = steamTask.Result;
        var rawgResults = rawgTask.Result;

        var seenTitles = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        // Prioritize exact or prefix matches
        // If a game is found on Steam, its library_600x900_2x.jpg vertical cover is ideal
        foreach (var s in steamResults)
        {
            if (seenTitles.Add(s.Title))
            {
                results.Add(s);
            }
        }

        // Add RAWG results (covers all platforms: PlayStation, Switch, Xbox, PC, etc.)
        foreach (var r in rawgResults)
        {
            // Check if title already added from Steam
            var existing = results.FirstOrDefault(x => x.Title.Equals(r.Title, StringComparison.OrdinalIgnoreCase));
            if (existing == null)
            {
                if (seenTitles.Add(r.Title))
                {
                    results.Add(r);
                }
            }
            else
            {
                // If existing has no cover or was missing platform info, enrich it
                if (string.IsNullOrEmpty(existing.CoverUrl) && !string.IsNullOrEmpty(r.CoverUrl))
                {
                    existing.CoverUrl = r.CoverUrl;
                }
                if (r.SuggestedPlatform != "PC" && existing.SuggestedPlatform == "PC" && existing.SteamAppId == null)
                {
                    existing.SuggestedPlatform = r.SuggestedPlatform;
                }
            }
        }

        // Sort: exact matches first, then starts-with, then others
        return results
            .OrderBy(r => r.Title.Equals(q, StringComparison.OrdinalIgnoreCase) ? 0 :
                          r.Title.StartsWith(q, StringComparison.OrdinalIgnoreCase) ? 1 : 2)
            .Take(15)
            .ToList();
    }

    private async Task<List<GameSearchResult>> SearchSteamStoreAsync(string q)
    {
        var list = new List<GameSearchResult>();
        try
        {
            var url = $"https://store.steampowered.com/api/storesearch/?term={Uri.EscapeDataString(q)}&l=russian&cc=US";
            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                if (doc.RootElement.TryGetProperty("items", out var items) && items.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in items.EnumerateArray())
                    {
                        var name = item.GetProperty("name").GetString() ?? "";
                        var id = item.GetProperty("id").GetInt64().ToString();

                        list.Add(new GameSearchResult
                        {
                            Title = name,
                            CoverUrl = $"https://steamcdn-a.akamaihd.net/steam/apps/{id}/library_600x900_2x.jpg",
                            SuggestedPlatform = "PC",
                            SteamAppId = id,
                            Source = "Steam"
                        });
                    }
                }
            }
        }
        catch
        {
            // Fallback gracefully
        }
        return list;
    }

    private async Task<List<GameSearchResult>> SearchRawgAsync(string q)
    {
        var list = new List<GameSearchResult>();
        try
        {
            var url = $"https://api.rawg.io/api/games?search={Uri.EscapeDataString(q)}&page_size=10&key={RawgApiKey}";
            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                if (doc.RootElement.TryGetProperty("results", out var results) && results.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in results.EnumerateArray())
                    {
                        var name = item.GetProperty("name").GetString() ?? "";
                        string? coverUrl = null;
                        if (item.TryGetProperty("background_image", out var bg) && bg.ValueKind == JsonValueKind.String)
                        {
                            coverUrl = bg.GetString();
                        }

                        // Determine platform from parent_platforms
                        string platform = "PC";
                        var platforms = new List<string>();
                        if (item.TryGetProperty("parent_platforms", out var pps) && pps.ValueKind == JsonValueKind.Array)
                        {
                            foreach (var p in pps.EnumerateArray())
                            {
                                if (p.TryGetProperty("platform", out var pObj) && pObj.TryGetProperty("name", out var pName))
                                {
                                    var str = pName.GetString() ?? "";
                                    platforms.Add(str);
                                }
                            }
                        }

                        if (platforms.Contains("PlayStation", StringComparer.OrdinalIgnoreCase) && !platforms.Contains("PC", StringComparer.OrdinalIgnoreCase))
                        {
                            platform = "PlayStation";
                        }
                        else if (platforms.Contains("Nintendo", StringComparer.OrdinalIgnoreCase))
                        {
                            platform = "Switch";
                        }
                        else if (platforms.Contains("Xbox", StringComparer.OrdinalIgnoreCase) && !platforms.Contains("PC", StringComparer.OrdinalIgnoreCase))
                        {
                            platform = "Xbox";
                        }
                        else if (platforms.Contains("PC", StringComparer.OrdinalIgnoreCase))
                        {
                            platform = "PC";
                        }
                        else if (platforms.Count > 0)
                        {
                            platform = platforms[0];
                        }

                        list.Add(new GameSearchResult
                        {
                            Title = name,
                            CoverUrl = coverUrl,
                            SuggestedPlatform = platform,
                            SteamAppId = null,
                            Source = "RAWG"
                        });
                    }
                }
            }
        }
        catch
        {
            // Fallback gracefully
        }
        return list;
    }
}
