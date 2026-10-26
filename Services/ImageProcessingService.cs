using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

namespace GameTracker.Services;

public class ImageProcessingService
{
    private readonly string _coversDir;
    private const int TargetWidth = 600;
    private const int TargetHeight = 900;
    private const double TargetRatio = (double)TargetWidth / TargetHeight; // 0.6667 (2:3)

    public ImageProcessingService(IWebHostEnvironment env)
    {
        _coversDir = Path.Combine(env.ContentRootPath, "data", "covers");
        Directory.CreateDirectory(_coversDir);
    }

    public string ProcessAndSaveCover(Stream inputStream, string gameId)
    {
        using var original = Image.FromStream(inputStream);
        var srcW = original.Width;
        var srcH = original.Height;
        var srcRatio = (double)srcW / srcH;

        Rectangle cropRect;

        // If aspect ratio matches 2:3 within 2% margin, use full image (scale only)
        if (Math.Abs(srcRatio - TargetRatio) <= 0.02)
        {
            cropRect = new Rectangle(0, 0, srcW, srcH);
        }
        else if (srcRatio > TargetRatio)
        {
            // Wider than 2:3 - crop width from center
            int cropW = (int)Math.Round(srcH * TargetRatio);
            int cropX = (srcW - cropW) / 2;
            cropRect = new Rectangle(cropX, 0, cropW, srcH);
        }
        else
        {
            // Taller than 2:3 - crop height from center
            int cropH = (int)Math.Round(srcW / TargetRatio);
            int cropY = (srcH - cropH) / 2;
            cropRect = new Rectangle(0, cropY, srcW, cropH);
        }

        using var targetBmp = new Bitmap(TargetWidth, TargetHeight, PixelFormat.Format24bppRgb);
        using (var g = Graphics.FromImage(targetBmp))
        {
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.CompositingQuality = CompositingQuality.HighQuality;

            g.DrawImage(original, new Rectangle(0, 0, TargetWidth, TargetHeight), cropRect, GraphicsUnit.Pixel);
        }

        var fileName = $"{gameId}.jpg";
        var outPath = Path.Combine(_coversDir, fileName);

        var encoder = ImageCodecInfo.GetImageEncoders().FirstOrDefault(c => c.FormatID == ImageFormat.Jpeg.Guid);
        if (encoder != null)
        {
            using var encoderParams = new EncoderParameters(1);
            encoderParams.Param[0] = new EncoderParameter(Encoder.Quality, 90L);
            targetBmp.Save(outPath, encoder, encoderParams);
        }
        else
        {
            targetBmp.Save(outPath, ImageFormat.Jpeg);
        }

        return $"/covers/{fileName}?v={DateTime.UtcNow.Ticks}";
    }

    public async Task<string?> DownloadAndSaveCoverAsync(string imageUrl, string gameId, HttpClient httpClient)
    {
        try
        {
            var response = await httpClient.GetAsync(imageUrl);
            if (!response.IsSuccessStatusCode) return null;

            await using var stream = await response.Content.ReadAsStreamAsync();
            return ProcessAndSaveCover(stream, gameId);
        }
        catch
        {
            return null;
        }
    }
}
