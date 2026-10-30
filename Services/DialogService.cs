namespace GameTracker.Services;

public class DialogService
{
    private readonly ILogger<DialogService> _logger;

    public DialogService(ILogger<DialogService> logger)
    {
        _logger = logger;
    }

    public string? SelectExecutableFile()
    {
        string? selectedPath = null;
        var thread = new Thread(() =>
        {
            try
            {
                using var dummy = new Form
                {
                    TopMost = true,
                    StartPosition = FormStartPosition.CenterScreen,
                    Size = new Size(0, 0),
                    FormBorderStyle = FormBorderStyle.None,
                    Opacity = 0,
                    ShowInTaskbar = false
                };
                dummy.Show();
                dummy.BringToFront();
                dummy.Activate();

                using var dlg = new OpenFileDialog
                {
                    Filter = "Исполняемые файлы (*.exe)|*.exe|Все файлы (*.*)|*.*",
                    Title = "Выберите исполняемый файл игры (.exe)",
                    CheckFileExists = true,
                    AutoUpgradeEnabled = true
                };

                if (dlg.ShowDialog(dummy) == DialogResult.OK)
                {
                    selectedPath = dlg.FileName;
                }
                dummy.Close();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "OpenFileDialog with topmost parent failed, attempting standard dialog fallback");
                try
                {
                    using var dlg = new OpenFileDialog
                    {
                        Filter = "Исполняемые файлы (*.exe)|*.exe|Все файлы (*.*)|*.*",
                        Title = "Выберите исполняемый файл игры (.exe)",
                        CheckFileExists = true
                    };
                    if (dlg.ShowDialog() == DialogResult.OK)
                    {
                        selectedPath = dlg.FileName;
                    }
                }
                catch (Exception exStandard)
                {
                    _logger.LogError(exStandard, "OpenFileDialog failed completely");
                }
            }
        });

        thread.SetApartmentState(ApartmentState.STA);
        thread.Start();
        thread.Join(TimeSpan.FromMinutes(2));

        return selectedPath;
    }

    public string? SelectFolder(string description)
    {
        string? selectedPath = null;
        var thread = new Thread(() =>
        {
            try
            {
                using var dummy = new Form
                {
                    TopMost = true,
                    StartPosition = FormStartPosition.CenterScreen,
                    Size = new Size(0, 0),
                    FormBorderStyle = FormBorderStyle.None,
                    Opacity = 0,
                    ShowInTaskbar = false
                };
                dummy.Show();
                dummy.BringToFront();
                dummy.Activate();

                using var dlg = new FolderBrowserDialog
                {
                    Description = description,
                    UseDescriptionForTitle = true,
                    ShowNewFolderButton = false,
                    AutoUpgradeEnabled = true
                };

                if (dlg.ShowDialog(dummy) == DialogResult.OK)
                {
                    selectedPath = dlg.SelectedPath;
                }
                dummy.Close();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "FolderBrowserDialog with topmost parent failed, attempting standard fallback");
                try
                {
                    using var dlg = new FolderBrowserDialog
                    {
                        Description = description,
                        UseDescriptionForTitle = true
                    };
                    if (dlg.ShowDialog() == DialogResult.OK)
                    {
                        selectedPath = dlg.SelectedPath;
                    }
                }
                catch (Exception exStandard)
                {
                    _logger.LogError(exStandard, "FolderBrowserDialog failed completely");
                }
            }
        });

        thread.SetApartmentState(ApartmentState.STA);
        thread.Start();
        thread.Join(TimeSpan.FromMinutes(2));

        return selectedPath;
    }
}
