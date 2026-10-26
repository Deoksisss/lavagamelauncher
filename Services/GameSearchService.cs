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

    // Curated catalog of iconic console, non-steam, and cross-platform games with verified vertical covers
    private static readonly List<GameSearchResult> CuratedGames = new()
    {
        new GameSearchResult
        {
            Title = "Starcraft",
            CoverUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/co1x76.jpg",
            SuggestedPlatform = "PC",
            Source = "Battle.net"
        },
        new GameSearchResult
        {
            Title = "Starcraft: Remastered",
            CoverUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/co2044.jpg",
            SuggestedPlatform = "PC",
            Source = "Battle.net"
        },
        new GameSearchResult
        {
            Title = "Starcraft II",
            CoverUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/co1x78.jpg",
            SuggestedPlatform = "PC",
            Source = "Battle.net"
        },
        new GameSearchResult
        {
            Title = "Starfield",
            CoverUrl = "https://steamcdn-a.akamaihd.net/steam/apps/1716740/library_600x900_2x.jpg",
            SuggestedPlatform = "PC",
            SteamAppId = "1716740",
            Source = "Steam"
        },
        new GameSearchResult
        {
            Title = "Star Wars Jedi: Survivor",
            CoverUrl = "https://steamcdn-a.akamaihd.net/steam/apps/1774580/library_600x900_2x.jpg",
            SuggestedPlatform = "PC",
            SteamAppId = "1774580",
            Source = "Steam"
        },
        new GameSearchResult
        {
            Title = "Star Wars Jedi: Fallen Order",
            CoverUrl = "https://steamcdn-a.akamaihd.net/steam/apps/1172380/library_600x900_2x.jpg",
            SuggestedPlatform = "PC",
            SteamAppId = "1172380",
            Source = "Steam"
        },
        new GameSearchResult
        {
            Title = "Star Wars: Knights of the Old Republic",
            CoverUrl = "https://steamcdn-a.akamaihd.net/steam/apps/32370/library_600x900_2x.jpg",
            SuggestedPlatform = "PC",
            SteamAppId = "32370",
            Source = "Steam"
        },
        new GameSearchResult
        {
            Title = "Star Citizen",
            CoverUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/co203z.jpg",
            SuggestedPlatform = "PC",
            Source = "RSI"
        },
        new GameSearchResult
        {
            Title = "The Legend of Zelda: Tears of the Kingdom",
            CoverUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.jpg",
            SuggestedPlatform = "Switch",
            Source = "Nintendo"
        },
        new GameSearchResult
        {
            Title = "The Legend of Zelda: Breath of the Wild",
            CoverUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/co1m1f.jpg",
            SuggestedPlatform = "Switch",
            Source = "Nintendo"
        },
        new GameSearchResult
        {
            Title = "Super Mario Odyssey",
            CoverUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/co1m1e.jpg",
            SuggestedPlatform = "Switch",
            Source = "Nintendo"
        },
        new GameSearchResult
        {
            Title = "Bloodborne",
            CoverUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.jpg",
            SuggestedPlatform = "PlayStation",
            Source = "PlayStation"
        },
        new GameSearchResult
        {
            Title = "Demon's Souls",
            CoverUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/co2b3m.jpg",
            SuggestedPlatform = "PlayStation",
            Source = "PlayStation"
        },
        new GameSearchResult
        {
            Title = "God of War Ragnarök",
            CoverUrl = "https://steamcdn-a.akamaihd.net/steam/apps/2322010/library_600x900_2x.jpg",
            SuggestedPlatform = "PlayStation",
            SteamAppId = "2322010",
            Source = "PlayStation / Steam"
        },
        new GameSearchResult
        {
            Title = "Halo Infinite",
            CoverUrl = "https://steamcdn-a.akamaihd.net/steam/apps/1240440/library_600x900_2x.jpg",
            SuggestedPlatform = "Xbox",
            SteamAppId = "1240440",
            Source = "Xbox"
        },
        new GameSearchResult
        {
            Title = "Forza Horizon 5",
            CoverUrl = "https://steamcdn-a.akamaihd.net/steam/apps/1551360/library_600x900_2x.jpg",
            SuggestedPlatform = "PC",
            SteamAppId = "1551360",
            Source = "Steam / Xbox"
        },
        new GameSearchResult
        {
            Title = "Cyberpunk 2077",
            CoverUrl = "https://steamcdn-a.akamaihd.net/steam/apps/1091500/library_600x900_2x.jpg",
            SuggestedPlatform = "PC",
            SteamAppId = "1091500",
            Source = "Steam"
        },
        new GameSearchResult
        {
            Title = "The Witcher 3: Wild Hunt",
            CoverUrl = "https://steamcdn-a.akamaihd.net/steam/apps/292030/library_600x900_2x.jpg",
            SuggestedPlatform = "PC",
            SteamAppId = "292030",
            Source = "Steam"
        },
        new GameSearchResult
        {
            Title = "Elden Ring",
            CoverUrl = "https://steamcdn-a.akamaihd.net/steam/apps/1245620/library_600x900_2x.jpg",
            SuggestedPlatform = "PC",
            SteamAppId = "1245620",
            Source = "Steam"
        },
        new GameSearchResult
        {
            Title = "Baldur's Gate 3",
            CoverUrl = "https://steamcdn-a.akamaihd.net/steam/apps/1086940/library_600x900_2x.jpg",
            SuggestedPlatform = "PC",
            SteamAppId = "1086940",
            Source = "Steam"
        },
        new GameSearchResult
        {
            Title = "Grand Theft Auto V",
            CoverUrl = "https://steamcdn-a.akamaihd.net/steam/apps/271590/library_600x900_2x.jpg",
            SuggestedPlatform = "PC",
            SteamAppId = "271590",
            Source = "Steam"
        },
        new GameSearchResult
        {
            Title = "Red Dead Redemption 2",
            CoverUrl = "https://steamcdn-a.akamaihd.net/steam/apps/1174180/library_600x900_2x.jpg",
            SuggestedPlatform = "PC",
            SteamAppId = "1174180",
            Source = "Steam"
        },
        new GameSearchResult
        {
            Title = "Minecraft",
            CoverUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/co811o.jpg",
            SuggestedPlatform = "PC",
            Source = "Mojang"
        },
        new GameSearchResult
        {
            Title = "World of Warcraft",
            CoverUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/co215y.jpg",
            SuggestedPlatform = "PC",
            Source = "Battle.net"
        },
        new GameSearchResult
        {
            Title = "Diablo IV",
            CoverUrl = "https://steamcdn-a.akamaihd.net/steam/apps/2344520/library_600x900_2x.jpg",
            SuggestedPlatform = "PC",
            SteamAppId = "2344520",
            Source = "Steam / Battle.net"
        }
    };

    public GameSearchService()
    {
        _httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(5)
        };
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 GameTracker/1.0");
    }

    public async Task<List<GameSearchResult>> SearchGamesAsync(string query)
    {
        var results = new List<GameSearchResult>();
        if (string.IsNullOrWhiteSpace(query)) return results;

        var q = query.Trim();

        // 1. Check curated multiplatform games first (instant matches)
        var curatedMatches = CuratedGames
            .Where(g => g.Title.Contains(q, StringComparison.OrdinalIgnoreCase))
            .OrderBy(g => g.Title.StartsWith(q, StringComparison.OrdinalIgnoreCase) ? 0 : 1)
            .Take(8)
            .ToList();

        results.AddRange(curatedMatches);

        // 2. Query Steam Store Search API
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

                        // Avoid exact duplicates
                        if (!results.Any(r => r.Title.Equals(name, StringComparison.OrdinalIgnoreCase)))
                        {
                            results.Add(new GameSearchResult
                            {
                                Title = name,
                                CoverUrl = $"https://steamcdn-a.akamaihd.net/steam/apps/{id}/library_600x900_2x.jpg",
                                SuggestedPlatform = "PC",
                                SteamAppId = id,
                                Source = "Steam Store"
                            });
                        }
                    }
                }
            }
        }
        catch
        {
            // Steam API timeout or offline - curated fallback handles basic search
        }

        // Limit results to top 15
        return results.Take(15).ToList();
    }
}
