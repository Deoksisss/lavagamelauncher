using GameTracker.Models;
using GameTracker.Services;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Register Core Services
builder.Services.AddSingleton<GameRepository>();
builder.Services.AddSingleton<ImageProcessingService>();
builder.Services.AddSingleton<GameSearchService>();
builder.Services.AddSingleton<SteamService>();
builder.Services.AddSingleton<StatisticsService>();
builder.Services.AddSingleton<GameLaunchService>();
builder.Services.AddSingleton<DialogService>();

// Background Process Tracker
builder.Services.AddSingleton<ProcessTrackerService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<ProcessTrackerService>());

// Configure Kestrel to listen on local loopback port
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5077);
});

var app = builder.Build();

// Host static files from wwwroot and data/covers with no-cache headers for instant updates
app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
        ctx.Context.Response.Headers["Pragma"] = "no-cache";
        ctx.Context.Response.Headers["Expires"] = "0";
    }
});

var coversPath = Path.Combine(app.Environment.ContentRootPath, "data", "covers");
Directory.CreateDirectory(coversPath);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(coversPath),
    RequestPath = "/covers"
});

// Startup tasks: scan Steam if configured
var repository = app.Services.GetRequiredService<GameRepository>();
var steamService = app.Services.GetRequiredService<SteamService>();
var trackerService = app.Services.GetRequiredService<ProcessTrackerService>();
var searchService = app.Services.GetRequiredService<GameSearchService>();
var imgService = app.Services.GetRequiredService<ImageProcessingService>();
var statsService = app.Services.GetRequiredService<StatisticsService>();
var launchService = app.Services.GetRequiredService<GameLaunchService>();
var dialogService = app.Services.GetRequiredService<DialogService>();

var initialSettings = repository.GetSettings();
if (initialSettings.ScanSteamOnStartup)
{
    try
    {
        steamService.ScanAndImportGames();
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "Initial Steam scan failed");
    }
}

// ======================== API Endpoints ========================

// 1. Get all games
app.MapGet("/api/games", () =>
{
    var games = repository.GetAllGames();
    var runningIds = trackerService.GetRunningGameIds().ToHashSet();
    foreach (var g in games)
    {
        g.IsRunning = runningIds.Contains(g.Id);
    }
    return Results.Ok(games);
});

// 2. Get single game
app.MapGet("/api/games/{id}", (string id) =>
{
    var game = repository.GetGame(id);
    if (game == null) return Results.NotFound();
    game.IsRunning = trackerService.IsGameRunning(id);
    return Results.Ok(game);
});

// 3. Create or update game
app.MapPost("/api/games", (GameItem game) =>
{
    if (string.IsNullOrWhiteSpace(game.Title))
    {
        return Results.BadRequest(new { error = "Название игры обязательно" });
    }

    var saved = repository.AddOrUpdateGame(game);
    saved.IsRunning = trackerService.IsGameRunning(saved.Id);
    return Results.Ok(saved);
});

// 4. Delete game
app.MapDelete("/api/games/{id}", (string id) =>
{
    if (string.IsNullOrWhiteSpace(id))
    {
        return Results.BadRequest(new { success = false, error = "Идентификатор игры обязателен" });
    }
    var success = repository.DeleteGame(id);
    return success 
        ? Results.Ok(new { success = true }) 
        : Results.NotFound(new { success = false, error = "Игра не найдена в библиотеке" });
});

// 5. Upload custom cover file
app.MapPost("/api/games/{id}/cover", async (string id, HttpRequest request) =>
{
    var game = repository.GetGame(id);
    if (game == null) return Results.NotFound();

    if (!request.HasFormContentType || request.Form.Files.Count == 0)
    {
        return Results.BadRequest(new { error = "Файл изображения не передан" });
    }

    var file = request.Form.Files[0];
    await using var stream = file.OpenReadStream();

    try
    {
        var coverUrl = imgService.ProcessAndSaveCover(stream, id);
        game.CoverUrl = coverUrl;
        repository.AddOrUpdateGame(game);
        return Results.Ok(new { coverUrl });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = $"Ошибка обработки изображения: {ex.Message}" });
    }
});

// 6. Launch game endpoint
app.MapPost("/api/gamelaunch/{id}", (string id) =>
{
    var (success, message) = launchService.LaunchGame(id);
    return Results.Ok(new { success, message, error = success ? null : message });
});

// 7. Native file dialog for selecting Game EXE
app.MapGet("/api/dialog/select-exe", () =>
{
    var path = dialogService.SelectExecutableFile();
    return Results.Ok(new { path });
});

// 8. Native dialog for selecting Steam Folder
app.MapGet("/api/dialog/select-steam-folder", () =>
{
    var path = dialogService.SelectFolder("Выберите корневую папку Steam (например C:\\Program Files (x86)\\Steam)");
    return Results.Ok(new { path });
});

// 9. Autocomplete search games
app.MapGet("/api/search", async (string? q) =>
{
    if (string.IsNullOrWhiteSpace(q))
    {
        return Results.Ok(Array.Empty<GameSearchResult>());
    }
    var results = await searchService.SearchGamesAsync(q);
    return Results.Ok(results);
});

// 10. Statistics
app.MapGet("/api/statistics", (string? period, string? interval, string? gameId) =>
{
    var stats = statsService.GetPeriodStatistics(period ?? "week", interval ?? "standard", gameId);
    return Results.Ok(stats);
});

// 11. Settings
app.MapGet("/api/settings", () => Results.Ok(repository.GetSettings()));

app.MapPost("/api/settings", (AppSettings settings) =>
{
    repository.SaveSettings(settings);
    return Results.Ok(settings);
});

// 12. Manual Steam scan
app.MapPost("/api/steam/scan", () =>
{
    var count = steamService.ScanAndImportGames();
    return Results.Ok(new { importedCount = count });
});

// 13. Create Desktop Shortcut
app.MapPost("/api/shortcut/create", () =>
{
    try
    {
        var desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
        var projectDir = app.Environment.ContentRootPath;
        var launcherBat = Path.Combine(projectDir, "Launch.bat");

        var vbsScript = $@"
Set oWS = WScript.CreateObject(""WScript.Shell"")
sLinkFile = ""{Path.Combine(desktopPath, "GameTracker.lnk").Replace(@"\", @"\\")}""
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = ""{launcherBat.Replace(@"\", @"\\")}""
oLink.WorkingDirectory = ""{projectDir.Replace(@"\", @"\\")}""
oLink.Description = ""GameTracker - Game Activity Tracker""
oLink.Save
";
        var tempVbs = Path.Combine(Path.GetTempPath(), "create_shortcut.vbs");
        File.WriteAllText(tempVbs, vbsScript);

        var p = System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
        {
            FileName = "cscript.exe",
            Arguments = $"//Nologo \"{tempVbs}\"",
            CreateNoWindow = true,
            UseShellExecute = false
        });
        p?.WaitForExit();
        try { File.Delete(tempVbs); } catch { }

        return Results.Ok(new { success = true, path = Path.Combine(desktopPath, "GameTracker.lnk") });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.Run();
