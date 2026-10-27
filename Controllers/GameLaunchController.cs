using System.Diagnostics;
using GameTracker.Services;
using Microsoft.AspNetCore.Mvc;

namespace GameTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameLaunchController : ControllerBase
{
    private readonly GameRepository _repo;

    public GameLaunchController(GameRepository repo)
    {
        _repo = repo;
    }

    [HttpPost("{id}")]
    public IActionResult LaunchGame(string id)
    {
        var game = _repo.GetGame(id);
        if (game == null) return NotFound();

        try
        {
            if (!string.IsNullOrEmpty(game.SteamAppId))
            {
                // Launch via Steam
                Process.Start(new ProcessStartInfo
                {
                    FileName = $"steam://rungameid/{game.SteamAppId}",
                    UseShellExecute = true
                });
            }
            else if (!string.IsNullOrEmpty(game.ExecutablePath) && System.IO.File.Exists(game.ExecutablePath))
            {
                // Launch local exe
                Process.Start(new ProcessStartInfo
                {
                    FileName = game.ExecutablePath,
                    WorkingDirectory = Path.GetDirectoryName(game.ExecutablePath),
                    UseShellExecute = true
                });
            }
            else
            {
                return BadRequest("No valid launch method found (no SteamAppId or valid path)");
            }

            return Ok(new { message = "Launching game..." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}
