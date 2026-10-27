// GameTracker Frontend Application Logic with Full i18n & Theme Support

(function() {
  'use strict';

  // ======================== I18N TRANSLATIONS ========================
  const I18N = {
    en: {
      app_subtitle: "Game Activity Tracker",
      now_playing: "Now playing",
      nav_library: "Library",
      nav_stats: "Statistics",
      nav_settings: "Settings",
      btn_sync_steam: "Sync Steam",
      btn_add_game: "Add Game",
      search_placeholder: "Search game by title...",
      sort_time_desc: "Playtime (highest)",
      sort_time_asc: "Playtime (lowest)",
      sort_alpha_asc: "Alphabetical (A — Z)",
      sort_alpha_desc: "Alphabetical (Z — A)",
      sort_recent: "Recently played",
      filter_status: "Status:",
      filter_platform: "Platform:",
      filter_steam: "Steam:",
      filter_all: "All",
      filter_steam_only: "Steam Only",
      filter_non_steam: "Non-Steam",
      status_playing: "Playing",
      status_plan: "Plan to play",
      status_completed: "Completed",
      status_on_hold: "On hold",
      status_dropped: "Dropped",
      played: "Played",
      hours_abbr: "h",
      stats_title: "Activity Statistics",
      stats_subtitle: "Playtime analysis and trends",
      period_day: "Day",
      period_week: "Week",
      period_month: "Month",
      period_year: "Year",
      interval_weeks: "By weeks",
      interval_months: "By months",
      metric_period_time: "Time in period",
      metric_active_games: "Active games",
      metric_top_game: "Top game",
      pie_chart_title: "Playtime Distribution (Pie Chart)",
      hchart_day: "Playtime by hour (minutes)",
      hchart_week: "Playtime by day of week (hours)",
      hchart_month: "Playtime by day of month (hours)",
      hchart_year_weeks: "Playtime by week of year (hours)",
      hchart_year_months: "Playtime by month (hours)",
      leaderboard_title: "Top games for selected period",
      th_rank: "#",
      th_game: "Game",
      th_platform: "Platform",
      th_time: "Time",
      th_share: "Share",
      settings_title: "Application Settings",
      settings_subtitle: "Appearance, language, Steam integration, and process tracking",
      settings_interface_title: "Appearance & Language",
      settings_language: "Interface Language:",
      settings_theme: "Theme Mode:",
      theme_dark: "Dark (default)",
      theme_light: "Light",
      settings_steam_title: "Steam Integration",
      settings_steam_path: "Steam root folder:",
      settings_steam_desc: "The app automatically discovers all Steam library folders (across all drives) via libraryfolders.vdf.",
      settings_sync_now: "Sync Steam games now",
      settings_tracking_title: "Process Tracking",
      settings_auto_track: "Automatically track playtime when .exe is running",
      settings_scan_startup: "Scan for new Steam games on application launch",
      btn_save_settings: "Save settings",
      settings_shortcut_title: "Desktop Shortcut",
      settings_shortcut_desc: "Creates a GameTracker desktop shortcut. The app launches in an isolated window without browser address bar or tabs.",
      btn_create_shortcut: "Create Desktop Shortcut",
      add_modal_title: "Add New Game",
      add_title_label: "Game title (with live suggestions):",
      add_title_placeholder: "Start typing, e.g. star, cyberpunk, zelda...",
      add_cover_label: "Cover:",
      no_cover: "No cover",
      platform_label: "Platform:",
      status_label: "Status:",
      base_hours_label: "Starting playtime (hours):",
      base_hours_hint: "All new hours will be added to this starting value.",
      exe_path_label: "Path to game executable (.exe) — optional:",
      btn_browse: "Browse...",
      notes_label: "First impressions / notes:",
      notes_placeholder: "Write your thoughts about the game...",
      btn_cancel: "Cancel",
      btn_add_to_library: "Add to Library",
      detail_heading: "Game Details",
      exe_unspecified: "Not specified (not tracking in background)",
      btn_edit_game: "Edit Game",
      btn_play: "Play",
      btn_delete: "Delete",
      notes_todo_title: "Notes & Tasks (ToDo)",
      notes_hint: "Lines starting with [] or [ ] automatically become ToDo tasks. Completed tasks are marked with [x].",
      btn_insert_todo: "+ [] Task",
      btn_save: "Save",
      saved_status: "● Saved",
      saving_status: "● Saving...",
      checklist_title: "Interactive checklist:",
      no_tasks_hint: "No tasks yet. Start a line with [] or click + [] Task above.",
      game_chart_title: "Game activity chart",
      edit_modal_title: "Edit Game",
      btn_save_changes: "Save Changes",
      upload_cover_title: "Upload cover image from computer:",
      upload_cover_desc: "Image will be automatically cropped and scaled to Steam standard vertical ratio (2:3 / 600x900).",
      btn_upload: "Upload Cover",
      empty_games_title: "No games found",
      empty_games_desc: "Try changing your search parameters or add a new game.",
      toast_saved: "Settings saved",
      toast_shortcut_created: "Shortcut created on desktop",
      toast_steam_sync: "Steam sync finished: {count} games imported/updated",
      toast_game_added: "Game \"{title}\" added!",
      toast_game_updated: "Changes saved",
      toast_game_deleted: "Game \"{title}\" deleted",
      delete_confirm: "Are you sure you want to delete \"{title}\" and all its playtime history?",
      no_activity: "No activity recorded for this period.",
      other_games: "Others",
      unit_minutes: "minutes",
      unit_hours: "hours",
      days_short: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      months_short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },

    ru: {
      app_subtitle: "Активность в играх",
      now_playing: "Сейчас запущена",
      nav_library: "Библиотека",
      nav_stats: "Статистика",
      nav_settings: "Настройки",
      btn_sync_steam: "Обновить Steam",
      btn_add_game: "Добавить игру",
      search_placeholder: "Поиск игры по названию...",
      sort_time_desc: "По времени (больше)",
      sort_time_asc: "По времени (меньше)",
      sort_alpha_asc: "По алфавиту (А — Я)",
      sort_alpha_desc: "По алфавиту (Я — А)",
      sort_recent: "Недавно играли",
      filter_status: "Статус:",
      filter_platform: "Платформа:",
      filter_steam: "Steam:",
      filter_all: "Все",
      filter_steam_only: "Только Steam",
      filter_non_steam: "Без Steam",
      status_playing: "Играю",
      status_plan: "Планирую играть",
      status_completed: "Прошел",
      status_on_hold: "Отложил",
      status_dropped: "Забросил",
      played: "Сыграно",
      hours_abbr: "ч",
      stats_title: "Статистика активности",
      stats_subtitle: "Анализ игрового времени и тенденций",
      period_day: "День",
      period_week: "Неделя",
      period_month: "Месяц",
      period_year: "Год",
      interval_weeks: "По неделям",
      interval_months: "По месяцам",
      metric_period_time: "Время за период",
      metric_active_games: "Активных игр",
      metric_top_game: "Топ игра периода",
      pie_chart_title: "Распределение времени (Круговая диаграмма)",
      hchart_day: "Время игры по часам (минут)",
      hchart_week: "Время игры по дням недели (часов)",
      hchart_month: "Время игры по дням месяца (часов)",
      hchart_year_weeks: "Время игры по неделям года (часов)",
      hchart_year_months: "Время игры по месяцам (часов)",
      leaderboard_title: "Топ игр за выбранный период",
      th_rank: "#",
      th_game: "Игра",
      th_platform: "Платформа",
      th_time: "Время",
      th_share: "Доля",
      settings_title: "Настройки приложения",
      settings_subtitle: "Внешний вид, язык, интеграция со Steam и трекинг процессов",
      settings_interface_title: "Внешний вид и язык",
      settings_language: "Язык интерфейса:",
      settings_theme: "Тема оформления:",
      theme_dark: "Тёмная (по умолчанию)",
      theme_light: "Светлая",
      settings_steam_title: "Интеграция со Steam",
      settings_steam_path: "Корневая папка Steam:",
      settings_steam_desc: "Приложение автоматически находит все библиотеки Steam (включая диски D:, E: и т.д.) через libraryfolders.vdf.",
      settings_sync_now: "Обновить список игр из Steam сейчас",
      settings_tracking_title: "Отслеживание процессов",
      settings_auto_track: "Автоматически отслеживать время при запущенном .exe файле",
      settings_scan_startup: "Проверять новые игры Steam при запуске приложения",
      btn_save_settings: "Сохранить настройки",
      settings_shortcut_title: "Ярлык на рабочем столе",
      settings_shortcut_desc: "Создает ярлык GameTracker на рабочем столе Windows. Приложение запускается в изолированном окне без адресной строки и рамок браузера.",
      btn_create_shortcut: "Создать ярлык на рабочем столе",
      add_modal_title: "Добавить новую игру",
      add_title_label: "Название игры (с живыми подсказками):",
      add_title_placeholder: "Начните вводить, например: star, cyberpunk, zelda...",
      add_cover_label: "Обложка:",
      no_cover: "Нет обложки",
      platform_label: "Платформа:",
      status_label: "Статус:",
      base_hours_label: "Начальное время игры (часов):",
      base_hours_hint: "Все новые часы будут суммироваться с этим значением.",
      exe_path_label: "Путь к файлу игры (.exe) — необязательно:",
      btn_browse: "Обзор...",
      notes_label: "Первые впечатления / заметки:",
      notes_placeholder: "Запишите мысли об игре...",
      btn_cancel: "Отмена",
      btn_add_to_library: "Добавить в библиотеку",
      detail_heading: "Об игре",
      exe_unspecified: "Не указан (время не трекается в фоне)",
      btn_edit_game: "Редактировать игру",
      btn_delete: "Удалить",
      notes_todo_title: "Заметки и задачи (ToDo)",
      notes_hint: "Строки, начинающиеся с [] или [ ], автоматически становятся задачами ToDo. Выполненные задачи помечаются как [x].",
      btn_insert_todo: "+ [] Задача",
      btn_save: "Сохранить",
      saved_status: "● Сохранено",
      saving_status: "● Сохранение...",
      checklist_title: "Интерактивный список задач:",
      no_tasks_hint: "Задач пока нет. Начните строку с [] или нажмите + [] Задача выше.",
      game_chart_title: "График активности в игре",
      edit_modal_title: "Редактирование игры",
      btn_save_changes: "Сохранить изменения",
      upload_cover_title: "Загрузить файл обложки с компьютера:",
      upload_cover_desc: "При несоответствии пропорций картинка будет автоматически обрезана и смасштабирована до эталонного вертикального размера Steam (2:3 / 600x900).",
      btn_upload: "Загрузить обложку",
      empty_games_title: "Игры не найдены",
      empty_games_desc: "Попробуйте изменить параметры поиска или добавьте новую игру",
      toast_saved: "Настройки сохранены",
      toast_shortcut_created: "Ярлык создан на рабочем столе",
      toast_steam_sync: "Синхронизация завершена: добавлено/обновлено {count} игр",
      toast_game_added: "Игра «{title}» добавлена!",
      toast_game_updated: "Изменения сохранены",
      toast_game_deleted: "Игра «{title}» удалена",
      delete_confirm: "Вы действительно хотите удалить игру «{title}» и всю историю времени?",
      no_activity: "Активности за выбранный период не зафиксировано.",
      other_games: "Остальные",
      unit_minutes: "минут",
      unit_hours: "часов",
      days_short: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      months_short: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
    },

    pt: {
      app_subtitle: "Rastreador de Atividade em Jogos",
      now_playing: "Jogando agora",
      nav_library: "Biblioteca",
      nav_stats: "Estatísticas",
      nav_settings: "Configurações",
      btn_sync_steam: "Sincronizar Steam",
      btn_add_game: "Adicionar Jogo",
      search_placeholder: "Buscar jogo por título...",
      sort_time_desc: "Tempo de jogo (maior)",
      sort_time_asc: "Tempo de jogo (menor)",
      sort_alpha_asc: "Alfabético (A — Z)",
      sort_alpha_desc: "Alfabético (Z — A)",
      sort_recent: "Jogado recentemente",
      filter_status: "Status:",
      filter_platform: "Plataforma:",
      filter_steam: "Steam:",
      filter_all: "Todos",
      filter_steam_only: "Apenas Steam",
      filter_non_steam: "Sem Steam",
      status_playing: "Jogando",
      status_plan: "Pretendo jogar",
      status_completed: "Concluído",
      status_on_hold: "Em espera",
      status_dropped: "Abandonado",
      played: "Jogado",
      hours_abbr: "h",
      stats_title: "Estatísticas de Atividade",
      stats_subtitle: "Análise de tempo de jogo e tendências",
      period_day: "Dia",
      period_week: "Semana",
      period_month: "Mês",
      period_year: "Ano",
      interval_weeks: "Por semanas",
      interval_months: "Por meses",
      metric_period_time: "Tempo no período",
      metric_active_games: "Jogos ativos",
      metric_top_game: "Principal jogo",
      pie_chart_title: "Distribuição de Tempo (Gráfico de Pizza)",
      hchart_day: "Tempo por hora (minutos)",
      hchart_week: "Tempo por dia da semana (horas)",
      hchart_month: "Tempo por dia do mês (horas)",
      hchart_year_weeks: "Tempo por semana do ano (horas)",
      hchart_year_months: "Tempo por mês (horas)",
      leaderboard_title: "Principais jogos no período",
      th_rank: "#",
      th_game: "Jogo",
      th_platform: "Plataforma",
      th_time: "Tempo",
      th_share: "Parcela",
      settings_title: "Configurações do Aplicativo",
      settings_subtitle: "Aparência, idioma, integração com a Steam e rastreamento de processos",
      settings_interface_title: "Aparência e Idioma",
      settings_language: "Idioma da Interface:",
      settings_theme: "Tema:",
      theme_dark: "Escuro (padrão)",
      theme_light: "Claro",
      settings_steam_title: "Integração Steam",
      settings_steam_path: "Pasta raiz da Steam:",
      settings_steam_desc: "O app localiza automaticamente todas as bibliotecas da Steam via libraryfolders.vdf.",
      settings_sync_now: "Sincronizar jogos da Steam agora",
      settings_tracking_title: "Rastreamento de Processos",
      settings_auto_track: "Rastrear tempo automaticamente quando o .exe estiver ativo",
      settings_scan_startup: "Buscar novos jogos da Steam ao iniciar o aplicativo",
      btn_save_settings: "Salvar configurações",
      settings_shortcut_title: "Atalho na Área de Trabalho",
      settings_shortcut_desc: "Cria um atalho na área de trabalho. O app abre em janela dedicada sem barras de navegador.",
      btn_create_shortcut: "Criar Atalho",
      add_modal_title: "Adicionar Novo Jogo",
      add_title_label: "Título do jogo (com sugestões ao vivo):",
      add_title_placeholder: "Comece a digitar, ex: star, cyberpunk, zelda...",
      add_cover_label: "Capa:",
      no_cover: "Sem capa",
      platform_label: "Plataforma:",
      status_label: "Status:",
      base_hours_label: "Tempo inicial (horas):",
      base_hours_hint: "Todas as novas horas serão somadas a este valor inicial.",
      exe_path_label: "Caminho do executável (.exe) — opcional:",
      btn_browse: "Procurar...",
      notes_label: "Primeiras impressões / notas:",
      notes_placeholder: "Escreva seus pensamentos sobre o jogo...",
      btn_cancel: "Cancelar",
      btn_add_to_library: "Adicionar à Biblioteca",
      detail_heading: "Detalhes do Jogo",
      exe_unspecified: "Não especificado (sem rastreamento em segundo plano)",
      btn_edit_game: "Editar Jogo",
      btn_delete: "Excluir",
      notes_todo_title: "Notas e Tarefas (ToDo)",
      notes_hint: "Linhas iniciadas com [] ou [ ] viram tarefas interativas. Tarefas concluídas usam [x].",
      btn_insert_todo: "+ [] Tarefa",
      btn_save: "Salvar",
      saved_status: "● Salvo",
      saving_status: "● Salvando...",
      checklist_title: "Lista de tarefas interativa:",
      no_tasks_hint: "Nenhuma tarefa ainda. Inicie uma linha com [] ou clique em + [] Tarefa acima.",
      game_chart_title: "Gráfico de atividade do jogo",
      edit_modal_title: "Editar Jogo",
      btn_save_changes: "Salvar Alterações",
      upload_cover_title: "Carregar capa do computador:",
      upload_cover_desc: "A imagem será cortada e dimensionada para a proporção padrão Steam (2:3 / 600x900).",
      btn_upload: "Carregar Capa",
      empty_games_title: "Nenhum jogo encontrado",
      empty_games_desc: "Tente alterar os filtros ou adicione um novo jogo.",
      toast_saved: "Configurações salvas",
      toast_shortcut_created: "Atalho criado na área de trabalho",
      toast_steam_sync: "Sincronização Steam concluída: {count} jogos atualizados",
      toast_game_added: "Jogo \"{title}\" adicionado!",
      toast_game_updated: "Alterações salvas",
      toast_game_deleted: "Jogo \"{title}\" excluído",
      delete_confirm: "Tem certeza de que deseja excluir \"{title}\" e todo o histórico?",
      no_activity: "Nenhuma atividade registrada no período.",
      other_games: "Outros",
      unit_minutes: "minutos",
      unit_hours: "horas",
      days_short: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
      months_short: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    },

    es: {
      app_subtitle: "Rastreador de Actividad de Juegos",
      now_playing: "Jugando ahora",
      nav_library: "Biblioteca",
      nav_stats: "Estadísticas",
      nav_settings: "Ajustes",
      btn_sync_steam: "Sincronizar Steam",
      btn_add_game: "Añadir Juego",
      search_placeholder: "Buscar juego por título...",
      sort_time_desc: "Tiempo jugado (mayor)",
      sort_time_asc: "Tiempo jugado (menor)",
      sort_alpha_asc: "Alfabético (A — Z)",
      sort_alpha_desc: "Alfabético (Z — A)",
      sort_recent: "Jugado recientemente",
      filter_status: "Estado:",
      filter_platform: "Plataforma:",
      filter_steam: "Steam:",
      filter_all: "Todos",
      filter_steam_only: "Solo Steam",
      filter_non_steam: "Sin Steam",
      status_playing: "Jugando",
      status_plan: "Planeo jugar",
      status_completed: "Completado",
      status_on_hold: "En pausa",
      status_dropped: "Abandonado",
      played: "Jugado",
      hours_abbr: "h",
      stats_title: "Estadísticas de Actividad",
      stats_subtitle: "Análisis de tiempo de juego y tendencias",
      period_day: "Día",
      period_week: "Semana",
      period_month: "Mes",
      period_year: "Año",
      interval_weeks: "Por semanas",
      interval_months: "Por meses",
      metric_period_time: "Tiempo en el período",
      metric_active_games: "Juegos activos",
      metric_top_game: "Juego principal",
      pie_chart_title: "Distribución del Tiempo (Gráfico Circular)",
      hchart_day: "Tiempo por hora (minutos)",
      hchart_week: "Tiempo por día de la semana (horas)",
      hchart_month: "Tiempo por día del mes (horas)",
      hchart_year_weeks: "Tiempo por semana del año (horas)",
      hchart_year_months: "Tiempo por mes (horas)",
      leaderboard_title: "Mejores juegos del período",
      th_rank: "#",
      th_game: "Juego",
      th_platform: "Plataforma",
      th_time: "Tiempo",
      th_share: "Porcentaje",
      settings_title: "Ajustes de la Aplicación",
      settings_subtitle: "Apariencia, idioma, integración con Steam y seguimiento de procesos",
      settings_interface_title: "Apariencia e Idioma",
      settings_language: "Idioma de la interfaz:",
      settings_theme: "Tema visual:",
      theme_dark: "Oscuro (por defecto)",
      theme_light: "Claro",
      settings_steam_title: "Integración con Steam",
      settings_steam_path: "Carpeta raíz de Steam:",
      settings_steam_desc: "La app encuentra automáticamente todas las bibliotecas de Steam a través de libraryfolders.vdf.",
      settings_sync_now: "Sincronizar juegos de Steam ahora",
      settings_tracking_title: "Seguimiento de Procesos",
      settings_auto_track: "Registrar tiempo automáticamente cuando el .exe esté en ejecución",
      settings_scan_startup: "Buscar nuevos juegos de Steam al iniciar la aplicación",
      btn_save_settings: "Guardar ajustes",
      settings_shortcut_title: "Acceso Directo en el Escritorio",
      settings_shortcut_desc: "Crea un acceso directo en el escritorio. La aplicación se inicia en ventana dedicada.",
      btn_create_shortcut: "Crear Acceso Directo",
      add_modal_title: "Añadir Nuevo Juego",
      add_title_label: "Título del juego (con sugerencias):",
      add_title_placeholder: "Escribe para buscar, ej: star, cyberpunk, zelda...",
      add_cover_label: "Portada:",
      no_cover: "Sin portada",
      platform_label: "Plataforma:",
      status_label: "Estado:",
      base_hours_label: "Horas iniciales jugadas:",
      base_hours_hint: "Las nuevas horas se sumarán a este valor.",
      exe_path_label: "Ruta del ejecutable (.exe) — opcional:",
      btn_browse: "Examinar...",
      notes_label: "Primeras impresiones / notas:",
      notes_placeholder: "Escribe tus impresiones del juego...",
      btn_cancel: "Cancelar",
      btn_add_to_library: "Añadir a la Biblioteca",
      detail_heading: "Detalles del Juego",
      exe_unspecified: "No especificado (sin seguimiento en segundo plano)",
      btn_edit_game: "Editar Juego",
      btn_delete: "Eliminar",
      notes_todo_title: "Notas y Tareas (ToDo)",
      notes_hint: "Las líneas que comienzan con [] o [ ] se convierten en tareas ToDo. Las completadas usan [x].",
      btn_insert_todo: "+ [] Tarea",
      btn_save: "Guardar",
      saved_status: "● Guardado",
      saving_status: "● Guardando...",
      checklist_title: "Lista interactiva de tareas:",
      no_tasks_hint: "No hay tareas. Inicia una línea con [] o pulsa + [] Tarea arriba.",
      game_chart_title: "Gráfico de actividad del juego",
      edit_modal_title: "Editar Juego",
      btn_save_changes: "Guardar Cambios",
      upload_cover_title: "Cargar portada desde el ordenador:",
      upload_cover_desc: "La imagen se recortará y escalará automáticamente a la relación estándar de Steam (2:3 / 600x900).",
      btn_upload: "Cargar Portada",
      empty_games_title: "No se encontraron juegos",
      empty_games_desc: "Prueba a cambiar los filtros o añade un nuevo juego.",
      toast_saved: "Ajustes guardados",
      toast_shortcut_created: "Acceso directo creado en el escritorio",
      toast_steam_sync: "Sincronización con Steam completa: {count} juegos actualizados",
      toast_game_added: "¡Juego \"{title}\" añadido!",
      toast_game_updated: "Cambios guardados",
      toast_game_deleted: "Juego \"{title}\" eliminado",
      delete_confirm: "¿Estás seguro de que quieres eliminar \"{title}\" y todo su historial?",
      no_activity: "No hay actividad registrada en este período.",
      other_games: "Otros",
      unit_minutes: "minutos",
      unit_hours: "horas",
      days_short: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      months_short: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    },

    de: {
      app_subtitle: "Gaming-Aktivitäts-Tracker",
      now_playing: "Wird gerade gespielt",
      nav_library: "Bibliothek",
      nav_stats: "Statistiken",
      nav_settings: "Einstellungen",
      btn_sync_steam: "Steam synchronisieren",
      btn_add_game: "Spiel hinzufügen",
      search_placeholder: "Spiel nach Titel suchen...",
      sort_time_desc: "Spielzeit (höchste zuerst)",
      sort_time_asc: "Spielzeit (niedrigste zuerst)",
      sort_alpha_asc: "Alphabetisch (A — Z)",
      sort_alpha_desc: "Alphabetisch (Z — A)",
      sort_recent: "Kürzlich gespielt",
      filter_status: "Status:",
      filter_platform: "Plattform:",
      filter_steam: "Steam:",
      filter_all: "Alle",
      filter_steam_only: "Nur Steam",
      filter_non_steam: "Ohne Steam",
      status_playing: "Spiele ich",
      status_plan: "Geplant",
      status_completed: "Durchgespielt",
      status_on_hold: "Pausiert",
      status_dropped: "Abgebrochen",
      played: "Gespielt",
      hours_abbr: "Std.",
      stats_title: "Aktivitätsstatistiken",
      stats_subtitle: "Spielzeitanalyse und Trends",
      period_day: "Tag",
      period_week: "Woche",
      period_month: "Monat",
      period_year: "Jahr",
      interval_weeks: "Nach Wochen",
      interval_months: "Nach Monaten",
      metric_period_time: "Zeit im Zeitraum",
      metric_active_games: "Aktive Spiele",
      metric_top_game: "Top-Spiel",
      pie_chart_title: "Zeitverteilung (Kreisdiagramm)",
      hchart_day: "Spielzeit nach Stunden (Minuten)",
      hchart_week: "Spielzeit nach Wochentagen (Stunden)",
      hchart_month: "Spielzeit nach Monatstagen (Stunden)",
      hchart_year_weeks: "Spielzeit nach Kalenderwochen (Stunden)",
      hchart_year_months: "Spielzeit nach Monaten (Stunden)",
      leaderboard_title: "Top-Spiele im ausgewählten Zeitraum",
      th_rank: "#",
      th_game: "Spiel",
      th_platform: "Plattform",
      th_time: "Zeit",
      th_share: "Anteil",
      settings_title: "Anwendungseinstellungen",
      settings_subtitle: "Design, Sprache, Steam-Integration und Prozessüberwachung",
      settings_interface_title: "Erscheinungsbild & Sprache",
      settings_language: "Sprache der Benutzeroberfläche:",
      settings_theme: "Farbdesign:",
      theme_dark: "Dunkel (Standard)",
      theme_light: "Hell",
      settings_steam_title: "Steam-Integration",
      settings_steam_path: "Steam-Hauptverzeichnis:",
      settings_steam_desc: "Die App erkennt automatisch alle Steam-Bibliotheken über libraryfolders.vdf.",
      settings_sync_now: "Steam-Spiele jetzt synchronisieren",
      settings_tracking_title: "Prozessüberwachung",
      settings_auto_track: "Spielzeit automatisch erfassen, wenn die .exe läuft",
      settings_scan_startup: "Beim Start nach neuen Steam-Spielen suchen",
      btn_save_settings: "Einstellungen speichern",
      settings_shortcut_title: "Desktop-Verknüpfung",
      settings_shortcut_desc: "Erstellt eine Desktop-Verknüpfung. Startet in eigenem Fenster ohne Browserleiste.",
      btn_create_shortcut: "Desktop-Verknüpfung erstellen",
      add_modal_title: "Neues Spiel hinzufügen",
      add_title_label: "Spieletitel (mit Live-Vorschlägen):",
      add_title_placeholder: "Tippen zum Suchen, z. B. star, cyberpunk, zelda...",
      add_cover_label: "Cover:",
      no_cover: "Kein Cover",
      platform_label: "Plattform:",
      status_label: "Status:",
      base_hours_label: "Bisherige Spielzeit (Stunden):",
      base_hours_hint: "Neue Spielzeit wird zu diesem Anfangswert addiert.",
      exe_path_label: "Pfad zur Spieledatei (.exe) — optional:",
      btn_browse: "Durchsuchen...",
      notes_label: "Erste Eindrücke / Notizen:",
      notes_placeholder: "Gedanken und Notizen zum Spiel verfassen...",
      btn_cancel: "Abbrechen",
      btn_add_to_library: "Zur Bibliothek hinzufügen",
      detail_heading: "Spieldetails",
      exe_unspecified: "Nicht angegeben (keine Hintergrundüberwachung)",
      btn_edit_game: "Spiel bearbeiten",
      btn_delete: "Löschen",
      notes_todo_title: "Notizen & Aufgaben (ToDo)",
      notes_hint: "Zeilen, die mit [] oder [ ] beginnen, werden zu ToDo-Aufgaben. Erledigte Aufgaben nutzen [x].",
      btn_insert_todo: "+ [] Aufgabe",
      btn_save: "Speichern",
      saved_status: "● Gespeichert",
      saving_status: "● Wird gespeichert...",
      checklist_title: "Interaktive Aufgabenliste:",
      no_tasks_hint: "Noch keine Aufgaben. Beginnen Sie eine Zeile mit [] oder klicken Sie oben auf + [] Aufgabe.",
      game_chart_title: "Aktivitätsdiagramm des Spiels",
      edit_modal_title: "Spiel bearbeiten",
      btn_save_changes: "Änderungen speichern",
      upload_cover_title: "Cover-Bild vom PC hochladen:",
      upload_cover_desc: "Das Bild wird automatisch auf das Steam-Standardseitenverhältnis (2:3 / 600x900) zugeschnitten.",
      btn_upload: "Cover hochladen",
      empty_games_title: "Keine Spiele gefunden",
      empty_games_desc: "Passen Sie die Filter an oder fügen Sie ein neues Spiel hinzu.",
      toast_saved: "Einstellungen gespeichert",
      toast_shortcut_created: "Desktop-Verknüpfung erstellt",
      toast_steam_sync: "Steam-Synchronisierung abgeschlossen: {count} Spiele aktualisiert",
      toast_game_added: "Spiel \"{title}\" hinzugefügt!",
      toast_game_updated: "Änderungen gespeichert",
      toast_game_deleted: "Spiel \"{title}\" gelöscht",
      delete_confirm: "Möchten Sie \"{title}\" und den gesamten Spielzeitverlauf wirklich löschen?",
      no_activity: "Keine Aktivität im gewählten Zeitraum aufgezeichnet.",
      other_games: "Andere",
      unit_minutes: "Minuten",
      unit_hours: "Stunden",
      days_short: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
      months_short: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
    },

    fr: {
      app_subtitle: "Suivi de l'Activité de Jeu",
      now_playing: "En cours de jeu",
      nav_library: "Bibliothèque",
      nav_stats: "Statistiques",
      nav_settings: "Paramètres",
      btn_sync_steam: "Synchroniser Steam",
      btn_add_game: "Ajouter un Jeu",
      search_placeholder: "Rechercher un jeu par titre...",
      sort_time_desc: "Temps de jeu (décroissant)",
      sort_time_asc: "Temps de jeu (croissant)",
      sort_alpha_asc: "Alphabétique (A — Z)",
      sort_alpha_desc: "Alphabétique (Z — A)",
      sort_recent: "Joué récemment",
      filter_status: "Statut :",
      filter_platform: "Plateforme :",
      filter_steam: "Steam :",
      filter_all: "Tous",
      filter_steam_only: "Steam uniquement",
      filter_non_steam: "Hors Steam",
      status_playing: "En cours",
      status_plan: "Prévu",
      status_completed: "Terminé",
      status_on_hold: "En pause",
      status_dropped: "Abandonné",
      played: "Joué",
      hours_abbr: "h",
      stats_title: "Statistiques d'Activité",
      stats_subtitle: "Analyse du temps de jeu et tendances",
      period_day: "Jour",
      period_week: "Semaine",
      period_month: "Mois",
      period_year: "Année",
      interval_weeks: "Par semaines",
      interval_months: "Par mois",
      metric_period_time: "Temps sur la période",
      metric_active_games: "Jeux actifs",
      metric_top_game: "Jeu le plus joué",
      pie_chart_title: "Répartition du temps (Diagramme circulaire)",
      hchart_day: "Temps par heure (minutes)",
      hchart_week: "Temps par jour de la semaine (heures)",
      hchart_month: "Temps par jour du mois (heures)",
      hchart_year_weeks: "Temps par semaine de l'année (heures)",
      hchart_year_months: "Temps par mois (heures)",
      leaderboard_title: "Meilleurs jeux sur la période sélectionnée",
      th_rank: "#",
      th_game: "Jeu",
      th_platform: "Plateforme",
      th_time: "Temps",
      th_share: "Part",
      settings_title: "Paramètres de l'Application",
      settings_subtitle: "Apparence, langue, intégration Steam et suivi des processus",
      settings_interface_title: "Apparence et Langue",
      settings_language: "Langue de l'interface :",
      settings_theme: "Thème visuel :",
      theme_dark: "Sombre (par défaut)",
      theme_light: "Clair",
      settings_steam_title: "Intégration Steam",
      settings_steam_path: "Dossier racine Steam :",
      settings_steam_desc: "L'application détecte automatiquement tous les dossiers de bibliothèques Steam via libraryfolders.vdf.",
      settings_sync_now: "Synchroniser les jeux Steam maintenant",
      settings_tracking_title: "Suivi des Processus",
      settings_auto_track: "Suivre automatiquement le temps quand le fichier .exe est ouvert",
      settings_scan_startup: "Vérifier les nouveaux jeux Steam au lancement de l'application",
      btn_save_settings: "Enregistrer les paramètres",
      settings_shortcut_title: "Raccourci sur le Bureau",
      settings_shortcut_desc: "Crée un raccourci bureau. L'application s'ouvre dans une fenêtre isolée sans barre de navigation.",
      btn_create_shortcut: "Créer le Raccourci",
      add_modal_title: "Ajouter un Nouveau Jeu",
      add_title_label: "Titre du jeu (avec suggestions en direct) :",
      add_title_placeholder: "Commencez à taper, ex : star, cyberpunk, zelda...",
      add_cover_label: "Jaquette :",
      no_cover: "Pas de jaquette",
      platform_label: "Plateforme :",
      status_label: "Statut :",
      base_hours_label: "Temps initial (heures) :",
      base_hours_hint: "Toutes les nouvelles heures s'ajouteront à cette valeur.",
      exe_path_label: "Chemin du fichier exécutable (.exe) — facultatif :",
      btn_browse: "Parcourir...",
      notes_label: "Premières impressions / notes :",
      notes_placeholder: "Écrivez vos pensées sur le jeu...",
      btn_cancel: "Annuler",
      btn_add_to_library: "Ajouter à la Bibliothèque",
      detail_heading: "Détails du Jeu",
      exe_unspecified: "Non spécifié (pas de suivi en arrière-plan)",
      btn_edit_game: "Modifier le Jeu",
      btn_delete: "Supprimer",
      notes_todo_title: "Notes et Tâches (ToDo)",
      notes_hint: "Les lignes commençant par [] ou [ ] deviennent des tâches ToDo. Celles cochées utilisent [x].",
      btn_insert_todo: "+ [] Tâche",
      btn_save: "Enregistrer",
      saved_status: "● Enregistré",
      saving_status: "● Enregistrement...",
      checklist_title: "Liste de tâches interactive :",
      no_tasks_hint: "Aucune tâche pour le moment. Débutez une ligne par [] ou cliquez sur + [] Tâche ci-dessus.",
      game_chart_title: "Graphique d'activité du jeu",
      edit_modal_title: "Modifier le Jeu",
      btn_save_changes: "Enregistrer les Modifications",
      upload_cover_title: "Importer une jaquette depuis l'ordinateur :",
      upload_cover_desc: "L'image sera automatiquement recadrée et redimensionnée au format vertical standard de Steam (2:3 / 600x900).",
      btn_upload: "Téléverser la Jaquette",
      empty_games_title: "Aucun jeu trouvé",
      empty_games_desc: "Modifiez vos filtres ou ajoutez un nouveau jeu.",
      toast_saved: "Paramètres enregistrés",
      toast_shortcut_created: "Raccourci créé sur le bureau",
      toast_steam_sync: "Synchronisation Steam terminée : {count} jeux importés/mis à jour",
      toast_game_added: "Jeu \"{title}\" ajouté !",
      toast_game_updated: "Modifications enregistrées",
      toast_game_deleted: "Jeu \"{title}\" supprimé",
      delete_confirm: "Voulez-vous vraiment supprimer \"{title}\" et tout son historique ?",
      no_activity: "Aucune activité enregistrée sur cette période.",
      other_games: "Autres",
      unit_minutes: "minutes",
      unit_hours: "heures",
      days_short: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      months_short: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
    },

    zh: {
      app_subtitle: "游戏活动追踪器",
      now_playing: "正在游戏中",
      nav_library: "游戏库",
      nav_stats: "数据统计",
      nav_settings: "系统设置",
      btn_sync_steam: "同步 Steam",
      btn_add_game: "添加游戏",
      search_placeholder: "输入游戏名称搜索...",
      sort_time_desc: "游戏时长 (从高到低)",
      sort_time_asc: "游戏时长 (从低到高)",
      sort_alpha_asc: "首字母 (A — Z)",
      sort_alpha_desc: "首字母 (Z — A)",
      sort_recent: "最近游玩",
      filter_status: "状态:",
      filter_platform: "平台:",
      filter_steam: "Steam:",
      filter_all: "全部",
      filter_steam_only: "仅限 Steam",
      filter_non_steam: "非 Steam 游戏",
      status_playing: "正在游玩",
      status_plan: "计划游玩",
      status_completed: "已通关",
      status_on_hold: "暂时搁置",
      status_dropped: "已放弃",
      played: "已游玩",
      hours_abbr: "小时",
      stats_title: "活动统计",
      stats_subtitle: "游玩时长深度分析与趋势",
      period_day: "今日",
      period_week: "本周",
      period_month: "本月",
      period_year: "本年",
      interval_weeks: "按周统计",
      interval_months: "按月统计",
      metric_period_time: "该周期总时长",
      metric_active_games: "活跃游戏数",
      metric_top_game: "游玩最多",
      pie_chart_title: "时长占比 (饼图)",
      hchart_day: "每小时游玩时长 (分钟)",
      hchart_week: "按星期分布 (小时)",
      hchart_month: "按天分布 (小时)",
      hchart_year_weeks: "按周分布 (小时)",
      hchart_year_months: "按月分布 (小时)",
      leaderboard_title: "选定周期内的热门游戏",
      th_rank: "#",
      th_game: "游戏名称",
      th_platform: "平台",
      th_time: "时长",
      th_share: "占比",
      settings_title: "应用程序设置",
      settings_subtitle: "外观主题、语言、Steam 集成与进程追踪设置",
      settings_interface_title: "界面与外观",
      settings_language: "界面语言:",
      settings_theme: "界面主题:",
      theme_dark: "暗色模式 (默认)",
      theme_light: "亮色模式",
      settings_steam_title: "Steam 集成",
      settings_steam_path: "Steam 根目录:",
      settings_steam_desc: "程序会通过 libraryfolders.vdf 自动查找所有驱动器上的 Steam 库文件夹。",
      settings_sync_now: "立即同步 Steam 游戏",
      settings_tracking_title: "进程追踪",
      settings_auto_track: "游戏 .exe 进程运行时自动追踪时长",
      settings_scan_startup: "启动程序时自动扫描 Steam 新游戏",
      btn_save_settings: "保存设置",
      settings_shortcut_title: "桌面快捷方式",
      settings_shortcut_desc: "在 Windows 桌面上创建独立窗口快捷方式，无浏览器边框和地址栏。",
      btn_create_shortcut: "创建桌面快捷方式",
      add_modal_title: "添加新游戏",
      add_title_label: "游戏名称 (支持实时自动提示):",
      add_title_placeholder: "输入名称，如 star, cyberpunk, zelda...",
      add_cover_label: "封面图:",
      no_cover: "暂无封面",
      platform_label: "游戏平台:",
      status_label: "通关状态:",
      base_hours_label: "初始时长 (小时):",
      base_hours_hint: "所有新的后台追踪时长将在此基准上累加。",
      exe_path_label: "可执行文件路径 (.exe) — 可选:",
      btn_browse: "浏览...",
      notes_label: "初步印象 / 随笔笔记:",
      notes_placeholder: "记录关于这款游戏的情节、音乐和心得...",
      btn_cancel: "取消",
      btn_add_to_library: "添加到游戏库",
      detail_heading: "游戏详情",
      exe_unspecified: "未指定路径 (后台不自动追踪)",
      btn_edit_game: "编辑游戏",
      btn_delete: "删除游戏",
      notes_todo_title: "游戏笔记与待办任务 (ToDo)",
      notes_hint: "以 [] 或 [ ] 开头的行会自动成为待办任务项。已完成任务标记为 [x]。",
      btn_insert_todo: "+ [] 任务项",
      btn_save: "保存",
      saved_status: "● 已保存",
      saving_status: "● 保存中...",
      checklist_title: "交互式待办清单:",
      no_tasks_hint: "暂无待办任务。在文本中使用 [] 开头或点击上方 + [] 任务项。",
      game_chart_title: "游戏活动图表",
      edit_modal_title: "编辑游戏信息",
      btn_save_changes: "保存更改",
      upload_cover_title: "从电脑上传封面图片:",
      upload_cover_desc: "如比例不符，图片将自动居中裁剪并调整为 Steam 标准垂直比例 (2:3 / 600x900)。",
      btn_upload: "上传封面",
      empty_games_title: "未找到游戏",
      empty_games_desc: "尝试调整筛选条件或添加新游戏。",
      toast_saved: "设置已保存",
      toast_shortcut_created: "快捷方式已创建至桌面",
      toast_steam_sync: "Steam 同步完成：更新/添加了 {count} 款游戏",
      toast_game_added: "游戏《{title}》已添加！",
      toast_game_updated: "修改已保存",
      toast_game_deleted: "游戏《{title}》已删除",
      delete_confirm: "确定要彻底删除游戏《{title}》及所有游玩历史吗？",
      no_activity: "该周期内暂无游玩记录。",
      other_games: "其他游戏",
      unit_minutes: "分钟",
      unit_hours: "小时",
      days_short: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      months_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
    },

    ja: {
      app_subtitle: "ゲーム活動トラッカー",
      now_playing: "プレイ中",
      nav_library: "ライブラリ",
      nav_stats: "統計",
      nav_settings: "設定",
      btn_sync_steam: "Steam 同期",
      btn_add_game: "ゲームを追加",
      search_placeholder: "タイトルで検索...",
      sort_time_desc: "プレイ時間 (長い順)",
      sort_time_asc: "プレイ時間 (短い順)",
      sort_alpha_asc: "名前順 (A — Z)",
      sort_alpha_desc: "名前順 (Z — A)",
      sort_recent: "最近プレイした順",
      filter_status: "状態:",
      filter_platform: "プラットフォーム:",
      filter_steam: "Steam:",
      filter_all: "すべて",
      filter_steam_only: "Steam のみ",
      filter_non_steam: "Steam 以外",
      status_playing: "プレイ中",
      status_plan: "プレイ予定",
      status_completed: "クリア済み",
      status_on_hold: "中断中",
      status_dropped: "中断・断念",
      played: "プレイ時間",
      hours_abbr: "時間",
      stats_title: "アクティビティ統計",
      stats_subtitle: "プレイ時間分析と傾向",
      period_day: "日",
      period_week: "週",
      period_month: "月",
      period_year: "年",
      interval_weeks: "週ごと",
      interval_months: "月ごと",
      metric_period_time: "期間内のプレイ時間",
      metric_active_games: "プレイしたゲーム数",
      metric_top_game: "最多プレイ",
      pie_chart_title: "プレイ時間の内訳 (円グラフ)",
      hchart_day: "時間別プレイ時間 (分)",
      hchart_week: "曜日別プレイ時間 (時間)",
      hchart_month: "日別プレイ時間 (時間)",
      hchart_year_weeks: "週別プレイ時間 (時間)",
      hchart_year_months: "月別プレイ時間 (時間)",
      leaderboard_title: "期間内のトップゲーム",
      th_rank: "#",
      th_game: "ゲーム名",
      th_platform: "ハード",
      th_time: "時間",
      th_share: "割合",
      settings_title: "アプリ設定",
      settings_subtitle: "外観テーマ、言語、Steam 連携、プロセストラッキング",
      settings_interface_title: "外観と言語",
      settings_language: "表示言語:",
      settings_theme: "テーマ:",
      theme_dark: "ダーク (デフォルト)",
      theme_light: "ライト",
      settings_steam_title: "Steam 連携",
      settings_steam_path: "Steam インストールフォルダ:",
      settings_steam_desc: "libraryfolders.vdf を介してすべてのドライブ上のライブラリを自動検出します。",
      settings_sync_now: "Steam ゲームを今すぐ同期",
      settings_tracking_title: "プロセストラッキング",
      settings_auto_track: "ゲームの .exe 起動時に自動でプレイ時間を計測",
      settings_scan_startup: "アプリ起動時に Steam の新規ゲームを確認",
      btn_save_settings: "設定を保存",
      settings_shortcut_title: "デスクトップショートカット",
      settings_shortcut_desc: "デスクトップにショートカットを作成します。アドレスバーのない専用ウィンドウで起動します。",
      btn_create_shortcut: "ショートカットを作成",
      add_modal_title: "新しいゲームを追加",
      add_title_label: "ゲームタイトル (サジェスト付き):",
      add_title_placeholder: "入力して検索 (例: star, cyberpunk, zelda...)",
      add_cover_label: "カバー画像:",
      no_cover: "カバーなし",
      platform_label: "プラットフォーム:",
      status_label: "プレイ状況:",
      base_hours_label: "初期プレイ時間 (時間):",
      base_hours_hint: "今後のトラッキング時間は、この初期値に加算されます。",
      exe_path_label: "実行ファイルのパス (.exe) — 任意:",
      btn_browse: "参照...",
      notes_label: "感想 / メモ:",
      notes_placeholder: "ゲームの感想やタスクを記録...",
      btn_cancel: "キャンセル",
      btn_add_to_library: "ライブラリに追加",
      detail_heading: "ゲーム詳細",
      exe_unspecified: "未指定 (バックグラウンド計測なし)",
      btn_edit_game: "ゲームを編集",
      btn_delete: "削除",
      notes_todo_title: "メモ & ToDo タスク",
      notes_hint: "[] または [ ] で始まる行は自動的に ToDo チェックリストになります。完了は [x] と表記。",
      btn_insert_todo: "+ [] タスク",
      btn_save: "保存",
      saved_status: "● 保存済み",
      saving_status: "● 保存中...",
      checklist_title: "インタラクティブ・チェックリスト:",
      no_tasks_hint: "タスクはまだありません。[] で行を始めるか、上の + [] タスク をクリックしてください。",
      game_chart_title: "アクティビティチャート",
      edit_modal_title: "ゲーム情報の編集",
      btn_save_changes: "変更を保存",
      upload_cover_title: "PC からカバー画像をアップロード:",
      upload_cover_desc: "画像は Steam 標準の縦長比率 (2:3 / 600x900) に自動トリミング・リサイズされます。",
      btn_upload: "カバーを適用",
      empty_games_title: "ゲームが見つかりません",
      empty_games_desc: "検索条件を変更するか、新しくゲームを追加してください。",
      toast_saved: "設定が保存されました",
      toast_shortcut_created: "デスクトップにショートカットを作成しました",
      toast_steam_sync: "Steam 同期完了: {count} 本のゲームを反映しました",
      toast_game_added: "「{title}」を追加しました！",
      toast_game_updated: "変更を保存しました",
      toast_game_deleted: "「{title}」を削除しました",
      delete_confirm: "「{title}」とすべてのプレイ記録を削除してもよろしいですか？",
      no_activity: "この期間のプレイ記録はありません。",
      other_games: "その他",
      unit_minutes: "分",
      unit_hours: "時間",
      days_short: ["月", "火", "水", "木", "金", "土", "日"],
      months_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
    },

    ko: {
      app_subtitle: "게임 활동 트래커",
      now_playing: "현재 실행 중",
      nav_library: "라이브러리",
      nav_stats: "통계",
      nav_settings: "설정",
      btn_sync_steam: "Steam 동기화",
      btn_add_game: "게임 추가",
      search_placeholder: "게임 제목으로 검색...",
      sort_time_desc: "플레이 시간 (많은 순)",
      sort_time_asc: "플레이 시간 (적은 순)",
      sort_alpha_asc: "가나다순 (A — Z)",
      sort_alpha_desc: "가나다 역순 (Z — A)",
      sort_recent: "최근 플레이 순",
      filter_status: "상태:",
      filter_platform: "플랫폼:",
      filter_steam: "Steam:",
      filter_all: "전체",
      filter_steam_only: "Steam 전용",
      filter_non_steam: "비 Steam",
      status_playing: "플레이 중",
      status_plan: "플레이 예정",
      status_completed: "완료됨",
      status_on_hold: "보류 중",
      status_dropped: "중단됨",
      played: "플레이",
      hours_abbr: "시간",
      stats_title: "활동 통계",
      stats_subtitle: "플레이 시간 분석 및 트렌드",
      period_day: "일",
      period_week: "주",
      period_month: "월",
      period_year: "년",
      interval_weeks: "주별",
      interval_months: "월별",
      metric_period_time: "기간 내 플레이 시간",
      metric_active_games: "플레이한 게임 수",
      metric_top_game: "최다 플레이 게임",
      pie_chart_title: "시간 분포 (원형 차트)",
      hchart_day: "시간별 플레이 시간 (분)",
      hchart_week: "요일별 플레이 시간 (시간)",
      hchart_month: "일별 플레이 시간 (시간)",
      hchart_year_weeks: "주차별 플레이 시간 (시간)",
      hchart_year_months: "월별 플레이 시간 (시간)",
      leaderboard_title: "선택 기간 상위 게임",
      th_rank: "#",
      th_game: "게임",
      th_platform: "플랫폼",
      th_time: "시간",
      th_share: "비율",
      settings_title: "애플리케이션 설정",
      settings_subtitle: "화면 테마, 언어, Steam 연동 및 프로세스 추적",
      settings_interface_title: "화면 및 언어",
      settings_language: "인터페이스 언어:",
      settings_theme: "테마 모드:",
      theme_dark: "다크 모드 (기본)",
      theme_light: "라이트 모드",
      settings_steam_title: "Steam 연동",
      settings_steam_path: "Steam 루트 폴더:",
      settings_steam_desc: "libraryfolders.vdf를 통해 모든 드라이브의 Steam 라이브러리 폴더를 자동으로 검색합니다.",
      settings_sync_now: "지금 Steam 게임 동기화",
      settings_tracking_title: "프로세스 추적",
      settings_auto_track: "게임 .exe 실행 시 자동으로 플레이 시간 측정",
      settings_scan_startup: "앱 실행 시 새로운 Steam 게임 확인",
      btn_save_settings: "설정 저장",
      settings_shortcut_title: "바탕화면 바로가기",
      settings_shortcut_desc: "Windows 바탕화면에 바로가기를 생성합니다. 주소창 없는 독립 창 모드로 실행됩니다.",
      btn_create_shortcut: "바로가기 만들기",
      add_modal_title: "새 게임 추가",
      add_title_label: "게임 제목 (실시간 추천 검색):",
      add_title_placeholder: "검색할 게임 입력 (예: star, cyberpunk, zelda...)",
      add_cover_label: "커버 이미지:",
      no_cover: "커버 없음",
      platform_label: "플랫폼:",
      status_label: "상태:",
      base_hours_label: "기존 플레이 시간 (시간):",
      base_hours_hint: "이후 추적되는 모든 시간은 이 기본값에 누적됩니다.",
      exe_path_label: "게임 실행 파일 경로 (.exe) — 선택사항:",
      btn_browse: "찾아보기...",
      notes_label: "첫인상 / 메모:",
      notes_placeholder: "게임에 대한 생각과 메모를 적어보세요...",
      btn_cancel: "취소",
      btn_add_to_library: "라이브러리에 추가",
      detail_heading: "게임 상세 정보",
      exe_unspecified: "지정되지 않음 (백그라운드 측정 안 함)",
      btn_edit_game: "게임 편집",
      btn_delete: "삭제",
      notes_todo_title: "메모 및 할 일 (ToDo)",
      notes_hint: "[] 또는 [ ]로 시작하는 줄은 자동으로 ToDo 항목이 됩니다. 완료된 항목은 [x]로 표시됩니다.",
      btn_insert_todo: "+ [] 할 일",
      btn_save: "저장",
      saved_status: "● 저장됨",
      saving_status: "● 저장 중...",
      checklist_title: "인터랙티브 체크리스트:",
      no_tasks_hint: "아직 할 일이 없습니다. []로 줄을 시작하거나 위의 + [] 할 일 버튼을 누르세요.",
      game_chart_title: "게임 활동 차트",
      edit_modal_title: "게임 편집",
      btn_save_changes: "변경 사항 저장",
      upload_cover_title: "PC에서 커버 이미지 업로드:",
      upload_cover_desc: "비율이 맞지 않는 이미지는 Steam 표준 세로 비율(2:3 / 600x900)로 자동 자르기 및 조정됩니다.",
      btn_upload: "커버 업로드",
      empty_games_title: "게임을 찾을 수 없습니다",
      empty_games_desc: "검색 조건을 변경하거나 새 게임을 추가해보세요.",
      toast_saved: "설정이 저장되었습니다",
      toast_shortcut_created: "바탕화면에 바로가기가 생성되었습니다",
      toast_steam_sync: "Steam 동기화 완료: {count}개 게임 반영됨",
      toast_game_added: "\"{title}\" 게임이 추가되었습니다!",
      toast_game_updated: "변경 사항이 저장되었습니다",
      toast_game_deleted: "\"{title}\" 게임이 삭제되었습니다",
      delete_confirm: "\"{title}\" 게임과 모든 활동 기록을 정말 삭제하시겠습니까?",
      no_activity: "선택한 기간 동안 기록된 활동이 없습니다.",
      other_games: "기타",
      unit_minutes: "분",
      unit_hours: "시간",
      days_short: ["월", "화", "수", "목", "금", "토", "일"],
      months_short: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
    }
  };

  // State
  let allGames = [];
  let currentGame = null;
  let currentTab = 'library';
  let activeStatsPeriod = 'week';
  let activeStatsInterval = 'standard';
  let activeGameChartPeriod = 'week';

  // Settings state (Default: Language = en, Theme = dark)
  let currentLang = 'en';
  let currentTheme = 'dark';

  // Filters & Sorting state
  const filters = {
    search: '',
    status: 'all',
    platform: 'all',
    steam: 'all',
    sort: 'playtime_desc'
  };

  // Add Game temporary cover state
  let addModalSelectedCover = null;
  let addModalSelectedSteamId = null;

  // Chart instances
  let statsPieChart = null;
  let statsHorizontalChart = null;
  let gameHorizontalChart = null;

  // Polling timer
  let livePollingTimer = null;
  let notesAutoSaveTimer = null;

  // Status mapping
  const StatusLabels = {
    playing: 'Playing',
    plan: 'Plan to play',
    completed: 'Completed',
    on_hold: 'On hold',
    dropped: 'Dropped'
  };

  // Translation helper
  function t(key, vars = {}) {
    const dict = I18N[currentLang] || I18N.en;
    let str = dict[key] !== undefined ? dict[key] : (I18N.en[key] !== undefined ? I18N.en[key] : key);
    if (typeof str === 'string') {
      Object.keys(vars).forEach(k => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
      });
    }
    return str;
  }

  // ======================== APPLICATION INIT ========================
  document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupFiltersAndSearch();
    setupModals();
    setupAddGameAutocomplete();
    setupGameDetails();
    setupSettings();
    setupStatsControls();

    // Initial data load
    loadSettings().then(() => {
      loadGames();
    });

    // Start background live polling for running game status
    startLivePolling();
  });

  // ======================== THEME & LANGUAGE APPLY ========================
  function applyTheme(theme) {
    currentTheme = (theme === 'light') ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeSelect = document.getElementById('setting-theme');
    if (themeSelect) themeSelect.value = currentTheme;

    // Refresh charts if open
    if (statsHorizontalChart) {
      loadStatistics();
    }
    if (gameHorizontalChart && currentGame) {
      loadGameChart(currentGame.id, activeGameChartPeriod);
    }
  }

  function applyLanguage(lang) {
    currentLang = I18N[lang] ? lang : 'en';
    const langSelect = document.getElementById('setting-language');
    if (langSelect) langSelect.value = currentLang;

    // Update text content with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = t(key);
      if (text && typeof text === 'string') {
        el.textContent = text;
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const text = t(key);
      if (text && typeof text === 'string') {
        el.placeholder = text;
      }
    });

    // Update titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const text = t(key);
      if (text && typeof text === 'string') {
        el.title = text;
      }
    });

    // Update status labels
    StatusLabels.playing = t('status_playing');
    StatusLabels.plan = t('status_plan');
    StatusLabels.completed = t('status_completed');
    StatusLabels.on_hold = t('status_on_hold');
    StatusLabels.dropped = t('status_dropped');

    // Re-render UI elements
    renderGamesGrid();
    updateHeaderRunningStatus();

    if (currentGame) {
      renderGameDetails(currentGame);
    }
    if (currentTab === 'statistics') {
      loadStatistics();
    }
  }

  // ======================== NAVIGATION ========================
  function setupNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const tabName = tab.dataset.tab;
        currentTab = tabName;

        document.querySelectorAll('.tab-view').forEach(v => v.style.display = 'none');
        const activeView = document.getElementById(`${tabName}-view`);
        if (activeView) activeView.style.display = 'block';

        if (tabName === 'statistics') {
          loadStatistics();
        } else if (tabName === 'settings') {
          loadSettings();
        }
      });
    });
  }

  // ======================== TOAST NOTIFICATION ========================
  function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const msgEl = document.getElementById('toast-message');
    msgEl.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3500);
  }

  // ======================== LOAD GAMES ========================
  async function loadGames() {
    try {
      const res = await fetch('/api/games');
      if (!res.ok) throw new Error('Failed to load games');
      allGames = await res.json();
      renderGamesGrid();
      updateHeaderRunningStatus();

      // If details modal is open for a game, update only live counters (DO NOT wipe active notes editing)
      if (currentGame) {
        const updated = allGames.find(g => g.id === currentGame.id);
        if (updated) {
          currentGame.totalHours = updated.totalHours;
          currentGame.trackedSeconds = updated.trackedSeconds;
          currentGame.isRunning = updated.isRunning;
          currentGame.lastPlayedAt = updated.lastPlayedAt;
          updateDetailLiveCounters(currentGame);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Live polling every 3 seconds for active processes & playtime accumulation
  function startLivePolling() {
    livePollingTimer = setInterval(async () => {
      try {
        const res = await fetch('/api/games');
        if (res.ok) {
          allGames = await res.json();
          updateHeaderRunningStatus();
          // Update visible cards running badges
          updateGridRunningStates();

          if (currentGame) {
            const updated = allGames.find(g => g.id === currentGame.id);
            if (updated) {
              currentGame.totalHours = updated.totalHours;
              currentGame.trackedSeconds = updated.trackedSeconds;
              currentGame.isRunning = updated.isRunning;
              currentGame.lastPlayedAt = updated.lastPlayedAt;
              updateDetailLiveCounters(currentGame);
            }
          }
        }
      } catch (e) {
        // Silent poll error
      }
    }, 3000);
  }

  function updateHeaderRunningStatus() {
    const runningGame = allGames.find(g => g.isRunning);
    const pill = document.getElementById('header-running-pill');
    const textEl = document.getElementById('header-running-text');

    if (runningGame) {
      pill.style.display = 'inline-flex';
      textEl.textContent = `${t('now_playing')}: ${runningGame.title} (${formatHours(runningGame.totalHours)} ${t('hours_abbr')})`;
    } else {
      pill.style.display = 'none';
    }
  }

  function updateGridRunningStates() {
    allGames.forEach(game => {
      const card = document.querySelector(`.game-card[data-id="${game.id}"]`);
      if (card) {
        let liveOverlay = card.querySelector('.live-playing-overlay');
        if (game.isRunning && !liveOverlay) {
          const wrapper = card.querySelector('.game-cover-wrapper');
          liveOverlay = document.createElement('div');
          liveOverlay.className = 'live-playing-overlay';
          liveOverlay.innerHTML = `<div class="pulse-dot"></div> ${t('now_playing')}`;
          wrapper.appendChild(liveOverlay);
        } else if (!game.isRunning && liveOverlay) {
          liveOverlay.remove();
        }

        const hoursEl = card.querySelector('.hours-tag');
        if (hoursEl) hoursEl.textContent = `${formatHours(game.totalHours)} ${t('hours_abbr')}`;
      }
    });
  }

  // ======================== FILTERS & SEARCH ========================
  function setupFiltersAndSearch() {
    const searchInput = document.getElementById('library-search-input');
    const sortSelect = document.getElementById('library-sort-select');

    searchInput.addEventListener('input', (e) => {
      filters.search = e.target.value.trim().toLowerCase();
      renderGamesGrid();
    });

    sortSelect.addEventListener('change', (e) => {
      filters.sort = e.target.value;
      renderGamesGrid();
    });

    function setupPillGroup(groupId, filterKey) {
      const container = document.getElementById(groupId);
      if (!container) return;
      const pills = container.querySelectorAll('.pill');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          filters[filterKey] = pill.dataset.filter;
          renderGamesGrid();
        });
      });
    }

    setupPillGroup('filter-status-group', 'status');
    setupPillGroup('filter-platform-group', 'platform');
    setupPillGroup('filter-steam-group', 'steam');
  }

  function renderGamesGrid() {
    const grid = document.getElementById('games-grid');
    grid.innerHTML = '';

    // Apply filters
    let list = allGames.filter(game => {
      // Search
      if (filters.search && !game.title.toLowerCase().includes(filters.search)) {
        return false;
      }
      // Status
      if (filters.status !== 'all' && game.status !== filters.status) {
        return false;
      }
      // Platform
      if (filters.platform !== 'all' && game.platform !== filters.platform) {
        return false;
      }
      // Steam
      if (filters.steam === 'steam_only' && !game.isSteam) {
        return false;
      }
      if (filters.steam === 'non_steam' && game.isSteam) {
        return false;
      }
      return true;
    });

    // Apply sorting
    list.sort((a, b) => {
      if (filters.sort === 'playtime_desc') return b.totalHours - a.totalHours;
      if (filters.sort === 'playtime_asc') return a.totalHours - b.totalHours;
      if (filters.sort === 'alpha_asc') return a.title.localeCompare(b.title);
      if (filters.sort === 'alpha_desc') return b.title.localeCompare(a.title);
      if (filters.sort === 'recent') {
        const da = a.lastPlayedAt ? new Date(a.lastPlayedAt).getTime() : 0;
        const db = b.lastPlayedAt ? new Date(b.lastPlayedAt).getTime() : 0;
        return db - da;
      }
      return 0;
    });

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="6"></rect><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line></svg>
          <div style="font-size: 17px; font-weight: 600; color: var(--text-primary);">${t('empty_games_title')}</div>
          <div style="font-size: 13px;">${t('empty_games_desc')}</div>
          <button class="btn btn-primary btn-sm" onclick="document.getElementById('btn-open-add-modal').click()">+ ${t('btn_add_game')}</button>
        </div>
      `;
      return;
    }

    list.forEach(game => {
      const card = createGameCard(game);
      grid.appendChild(card);
    });
  }

  function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.id = game.id;

    let coverHtml;
    if (game.coverUrl) {
      coverHtml = `<img class="game-cover-img" src="${escapeHtml(game.coverUrl)}" alt="${escapeHtml(game.title)}" onerror="this.parentElement.innerHTML='<div class=\\'game-cover-placeholder\\'><span>🎮</span><span style=\\'font-size:11px;\\'>${escapeHtml(game.title)}</span></div>'">`;
    } else {
      coverHtml = `
        <div class="game-cover-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="12" rx="6"></rect><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line></svg>
          <span style="font-size: 12px; font-weight: 600;">${escapeHtml(game.title)}</span>
        </div>
      `;
    }

    const statusClass = `status-${game.status}`;
    const statusText = StatusLabels[game.status] || game.status;

    card.innerHTML = `
      <div class="game-cover-wrapper">
        <div class="card-badge-top-left">
          <span class="status-badge ${statusClass}">${statusText}</span>
          ${game.isSteam ? '<span class="steam-badge">Steam</span>' : ''}
        </div>
        <div class="card-badge-top-right">
          <span class="platform-badge">${escapeHtml(game.platform)}</span>
        </div>
        ${game.isRunning ? `<div class="live-playing-overlay"><div class="pulse-dot"></div> ${t('now_playing')}</div>` : ''}
        ${coverHtml}
      </div>
      <div class="game-card-body">
        <div class="game-title" title="${escapeHtml(game.title)}">${escapeHtml(game.title)}</div>
        <div class="game-card-footer">
          <span>${t('played')}</span>
          <span class="hours-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${formatHours(game.totalHours)} ${t('hours_abbr')}
          </span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openGameDetails(game.id);
    });

    return card;
  }

  // ======================== ADD GAME & AUTOCOMPLETE ========================
  function setupAddGameAutocomplete() {
    const input = document.getElementById('add-game-title');
    const dropdown = document.getElementById('add-autocomplete-dropdown');
    let debounceTimer = null;

    input.addEventListener('input', () => {
      const q = input.value.trim();
      clearTimeout(debounceTimer);

      if (q.length < 2) {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        return;
      }

      debounceTimer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
          if (!res.ok) return;
          const suggestions = await res.json();
          renderSuggestions(q, suggestions);
        } catch (err) {
          console.error(err);
        }
      }, 250);
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    function renderSuggestions(query, list) {
      dropdown.innerHTML = '';

      list.forEach(item => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';

        const thumbUrl = item.coverUrl || '';
        div.innerHTML = `
          <img class="suggestion-thumb" src="${escapeHtml(thumbUrl)}" onerror="this.style.opacity='0.2'">
          <div class="suggestion-info">
            <div class="suggestion-title">${escapeHtml(item.title)}</div>
            <div class="suggestion-meta">${escapeHtml(item.suggestedPlatform)} • ${escapeHtml(item.source)}</div>
          </div>
        `;

        div.addEventListener('click', () => {
          input.value = item.title;
          document.getElementById('add-game-platform').value = item.suggestedPlatform || 'PC';
          addModalSelectedCover = item.coverUrl;
          addModalSelectedSteamId = item.steamAppId || null;
          updateAddCoverPreview(item.coverUrl);
          dropdown.classList.remove('active');
        });

        dropdown.appendChild(div);
      });

      const customItem = document.createElement('div');
      customItem.className = 'custom-game-btn-item';
      customItem.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <span>+ "${escapeHtml(query)}" (${t('no_cover')})</span>
      `;
      customItem.addEventListener('click', () => {
        input.value = query;
        addModalSelectedCover = null;
        addModalSelectedSteamId = null;
        updateAddCoverPreview(null);
        dropdown.classList.remove('active');
      });
      dropdown.appendChild(customItem);

      dropdown.classList.add('active');
    }

    function updateAddCoverPreview(url) {
      const box = document.getElementById('add-cover-preview-box');
      if (url) {
        box.innerHTML = `<img src="${escapeHtml(url)}" style="width:100%; height:100%; object-fit:cover; border-radius: var(--radius-md);">`;
      } else {
        box.innerHTML = `
          <div class="game-cover-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="6"></rect></svg>
            <span style="font-size: 11px;">${t('no_cover')}</span>
          </div>
        `;
      }
    }

    document.getElementById('btn-save-new-game').addEventListener('click', async () => {
      const title = input.value.trim();
      if (!title) {
        alert(t('add_title_label'));
        return;
      }

      const platform = document.getElementById('add-game-platform').value;
      const status = document.getElementById('add-game-status').value;
      const baseHours = parseFloat(document.getElementById('add-game-base-hours').value) || 0;
      const exePath = document.getElementById('add-game-exe').value.trim();
      const notes = document.getElementById('add-game-notes').value.trim();

      const newGame = {
        title: title,
        platform: platform,
        status: status,
        baseHours: baseHours,
        executablePath: exePath || null,
        coverUrl: addModalSelectedCover,
        steamAppId: addModalSelectedSteamId,
        isSteam: !!addModalSelectedSteamId,
        notes: notes,
        toDos: []
      };

      try {
        const res = await fetch('/api/games', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newGame)
        });
        if (res.ok) {
          closeAllModals();
          showToast(t('toast_game_added', { title: title }));
          await loadGames();
        } else {
          const err = await res.json();
          alert(err.error || 'Error saving game');
        }
      } catch (err) {
        console.error(err);
      }
    });

    document.getElementById('btn-browse-add-exe').addEventListener('click', async () => {
      try {
        const res = await fetch('/api/dialog/select-exe');
        const data = await res.json();
        if (data.path) {
          document.getElementById('add-game-exe').value = data.path;
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  // ======================== GAME DETAILS MODAL & NOTES ========================
  function setupGameDetails() {
    const textarea = document.getElementById('detail-notes-textarea');
    const saveBtn = document.getElementById('btn-save-notes');
    const insertTodoBtn = document.getElementById('btn-insert-todo');
    const statusEl = document.getElementById('notes-save-status');

    // Live auto-save on typing (debounced) & refresh interactive checklist
    if (textarea) {
      textarea.addEventListener('input', () => {
        if (statusEl) {
          statusEl.textContent = t('saving_status');
          statusEl.style.color = 'var(--accent-amber)';
        }
        renderInteractiveChecklistFromNotes(textarea.value);

        clearTimeout(notesAutoSaveTimer);
        notesAutoSaveTimer = setTimeout(async () => {
          if (!currentGame) return;
          currentGame.notes = textarea.value;
          syncTodosFromNotes(currentGame);
          await saveCurrentGame();
          if (statusEl) {
            statusEl.textContent = t('saved_status');
            statusEl.style.color = 'var(--accent-emerald)';
          }
        }, 700);
      });

      // Smart Enter key continuation for [] tasks
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const selStart = textarea.selectionStart;
          const textBefore = textarea.value.substring(0, selStart);
          const textAfter = textarea.value.substring(selStart);
          const lastLineBreak = textBefore.lastIndexOf('\n');
          const currentLine = textBefore.substring(lastLineBreak + 1);

          const match = currentLine.match(/^(\s*)(\[[ xX]?\]\s*)/);
          if (match) {
            e.preventDefault();
            const indent = match[1];
            const taskContent = currentLine.substring(match[0].length).trim();

            if (!taskContent) {
              const lineStart = lastLineBreak + 1;
              textarea.value = textBefore.substring(0, lineStart) + textAfter;
              textarea.selectionStart = textarea.selectionEnd = lineStart;
            } else {
              const insertion = '\n' + indent + '[] ';
              textarea.value = textBefore + insertion + textAfter;
              textarea.selectionStart = textarea.selectionEnd = selStart + insertion.length;
            }
            textarea.dispatchEvent(new Event('input'));
          }
        }
      });
    }

    // Insert "+ [] Task" button
    if (insertTodoBtn && textarea) {
      insertTodoBtn.addEventListener('click', () => {
        const val = textarea.value;
        const needsNewline = val.length > 0 && !val.endsWith('\n');
        const toInsert = (needsNewline ? '\n' : '') + '[] ';
        textarea.value = val + toInsert;
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
        textarea.dispatchEvent(new Event('input'));
      });
    }

    // Manual Save Notes Button
    if (saveBtn && textarea) {
      saveBtn.addEventListener('click', async () => {
        if (!currentGame) return;
        clearTimeout(notesAutoSaveTimer);
        currentGame.notes = textarea.value;
        syncTodosFromNotes(currentGame);
        await saveCurrentGame();
        if (statusEl) {
          statusEl.textContent = t('saved_status');
          statusEl.style.color = 'var(--accent-emerald)';
        }
        showToast(t('toast_game_updated'));
      });
    }

    // Delete Game Button
    // Play Game
    document.getElementById('btn-play-game').addEventListener('click', async () => {
      if (!currentGame) return;
      try {
        const res = await fetch(`/api/gamelaunch/${currentGame.id}`, { method: 'POST' });
        if (res.ok) {
          showToast(t('now_playing') + '...');
        } else {
          const err = await res.text();
          alert(err);
        }
      } catch (err) {
        console.error(err);
      }
    });

    document.getElementById('btn-delete-game').addEventListener('click', async () => {
      if (!currentGame) return;
      if (!confirm(t('delete_confirm', { title: currentGame.title }))) {
        return;
      }

      try {
        const res = await fetch(`/api/games/${currentGame.id}`, { method: 'DELETE' });
        if (res.ok) {
          closeAllModals();
          showToast(t('toast_game_deleted', { title: currentGame.title }));
          currentGame = null;
          await loadGames();
        }
      } catch (err) {
        console.error(err);
      }
    });

    // Open Edit Modal Button
    document.getElementById('btn-open-edit-game').addEventListener('click', () => {
      if (!currentGame) return;
      openEditModal(currentGame);
    });

    // Game Specific Chart period buttons
    const periodButtons = document.querySelectorAll('#game-chart-period-group .pill');
    periodButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        periodButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeGameChartPeriod = btn.dataset.period;
        if (currentGame) {
          loadGameChart(currentGame.id, activeGameChartPeriod);
        }
      });
    });
  }

  function openGameDetails(gameId) {
    const game = allGames.find(g => g.id === gameId);
    if (!game) return;
    currentGame = game;
    renderGameDetails(currentGame);
    loadGameChart(currentGame.id, activeGameChartPeriod);

    document.getElementById('game-detail-modal').classList.add('active');
  }

  function renderGameDetails(game) {
    document.getElementById('detail-modal-heading').textContent = game.title;
    document.getElementById('detail-title-text').textContent = game.title;

    const coverImg = document.getElementById('detail-cover-img');
    if (game.coverUrl) {
      coverImg.src = game.coverUrl;
      coverImg.style.display = 'block';
    } else {
      coverImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="255" viewBox="0 0 170 255"><rect width="170" height="255" fill="%231a202c"/><text x="50%" y="50%" fill="%2364748b" text-anchor="middle" font-family="sans-serif" font-size="16">' + t('no_cover') + '</text></svg>';
    }

    const statusBadge = document.getElementById('detail-status-badge');
    statusBadge.className = `status-badge status-${game.status}`;
    statusBadge.textContent = StatusLabels[game.status] || game.status;

    document.getElementById('detail-platform-badge').textContent = game.platform;

    const steamBadge = document.getElementById('detail-steam-badge');
    steamBadge.style.display = game.isSteam ? 'inline-flex' : 'none';

    updateDetailLiveCounters(game);

    const exeSpan = document.getElementById('detail-exe-path');
    exeSpan.textContent = game.executablePath || t('exe_unspecified');

    const textarea = document.getElementById('detail-notes-textarea');
    if (textarea) {
      textarea.value = game.notes || '';
    }

    const statusEl = document.getElementById('notes-save-status');
    if (statusEl) {
      statusEl.textContent = t('saved_status');
      statusEl.style.color = 'var(--text-muted)';
    }

    renderInteractiveChecklistFromNotes(game.notes || '');
  }

  function updateDetailLiveCounters(game) {
    const totalEl = document.getElementById('detail-total-hours');
    if (totalEl) totalEl.textContent = `${formatHours(game.totalHours)} ${t('hours_abbr')}`;

    const breakdownEl = document.getElementById('detail-hours-breakdown');
    if (breakdownEl) {
      const trackedMins = Math.round((game.trackedSeconds || 0) / 60);
      const trackedHours = (trackedMins / 60).toFixed(1);
      breakdownEl.textContent = `Base: ${game.baseHours} ${t('hours_abbr')} | Tracked: ${trackedHours} ${t('hours_abbr')} (${trackedMins} ${t('unit_minutes')})`;
    }

    const runningBadge = document.getElementById('detail-running-badge');
    if (runningBadge) runningBadge.style.display = game.isRunning ? 'inline-flex' : 'none';
  }

  function renderInteractiveChecklistFromNotes(notesText) {
    const container = document.getElementById('notes-interactive-checklist');
    const counterEl = document.getElementById('notes-todo-counter');
    if (!container) return;
    container.innerHTML = '';

    const lines = (notesText || '').split('\n');
    const taskLines = [];

    lines.forEach((line, lineIndex) => {
      const match = line.match(/^(\s*)\[([ xX]?)\]\s*(.*)$/);
      if (match) {
        taskLines.push({
          lineIndex: lineIndex,
          indent: match[1],
          done: match[2].toLowerCase() === 'x',
          text: match[3] || 'Task'
        });
      }
    });

    if (counterEl) {
      const doneCount = taskLines.filter(t => t.done).length;
      counterEl.textContent = `${doneCount} / ${taskLines.length}`;
    }

    if (taskLines.length === 0) {
      container.innerHTML = `<div style="font-size: 12px; color: var(--text-muted); padding: 4px 0;">${t('no_tasks_hint')}</div>`;
      return;
    }

    taskLines.forEach(task => {
      const item = document.createElement('div');
      item.className = `todo-item ${task.done ? 'done' : ''}`;

      item.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${task.done ? 'checked' : ''}>
        <span class="todo-text">${escapeHtml(task.text)}</span>
      `;

      const checkbox = item.querySelector('.todo-checkbox');
      checkbox.addEventListener('change', () => {
        const textarea = document.getElementById('detail-notes-textarea');
        if (!textarea) return;
        const currentLines = textarea.value.split('\n');
        if (task.lineIndex < currentLines.length) {
          const targetLine = currentLines[task.lineIndex];
          const m = targetLine.match(/^(\s*)\[([ xX]?)\]\s*(.*)$/);
          if (m) {
            const newPrefix = checkbox.checked ? '[x] ' : '[] ';
            currentLines[task.lineIndex] = m[1] + newPrefix + m[3];
            textarea.value = currentLines.join('\n');
            textarea.dispatchEvent(new Event('input'));
          }
        }
      });

      container.appendChild(item);
    });
  }

  function syncTodosFromNotes(game) {
    const lines = (game.notes || '').split('\n');
    game.toDos = [];
    lines.forEach(line => {
      const m = line.match(/^\s*\[([ xX]?)\]\s*(.*)$/);
      if (m && m[2].trim()) {
        game.toDos.push({
          id: Math.random().toString(36).substring(2, 10),
          text: m[2].trim(),
          done: m[1].toLowerCase() === 'x',
          createdAt: new Date().toISOString()
        });
      }
    });
  }

  async function saveCurrentGame() {
    if (!currentGame) return;
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentGame)
      });
      if (res.ok) {
        const saved = await res.json();
        const idx = allGames.findIndex(g => g.id === saved.id);
        if (idx !== -1) allGames[idx] = saved;
        currentGame = saved;
        renderGamesGrid();
      }
    } catch (e) {
      console.error(e);
    }
  }

  // ======================== EDIT GAME MODAL ========================
  function openEditModal(game) {
    document.getElementById('edit-game-id').value = game.id;
    document.getElementById('edit-game-title').value = game.title;
    document.getElementById('edit-game-platform').value = game.platform;
    document.getElementById('edit-game-status').value = game.status;
    document.getElementById('edit-game-base-hours').value = game.baseHours;
    
    const exeInput = document.getElementById('edit-game-exe');
    const browseBtn = document.getElementById('btn-browse-edit-exe');
    
    exeInput.value = game.executablePath || '';
    
    // Disable editing for Steam games
    if (game.isSteam) {
        exeInput.disabled = true;
        browseBtn.disabled = true;
    } else {
        exeInput.disabled = false;
        browseBtn.disabled = false;
    }

    document.getElementById('edit-cover-file-input').value = '';

    document.getElementById('edit-game-modal').classList.add('active');
  }

  document.getElementById('btn-browse-edit-exe').addEventListener('click', async () => {
    try {
      const res = await fetch('/api/dialog/select-exe');
      const data = await res.json();
      if (data.path) {
        document.getElementById('edit-game-exe').value = data.path;
      }
    } catch (e) {
      console.error(e);
    }
  });

  document.getElementById('btn-save-edit-game').addEventListener('click', async () => {
    const id = document.getElementById('edit-game-id').value;
    const game = allGames.find(g => g.id === id);
    if (!game) return;

    game.title = document.getElementById('edit-game-title').value.trim();
    game.platform = document.getElementById('edit-game-platform').value;
    game.status = document.getElementById('edit-game-status').value;
    game.baseHours = parseFloat(document.getElementById('edit-game-base-hours').value) || 0;
    game.executablePath = document.getElementById('edit-game-exe').value.trim() || null;

    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game)
      });
      if (res.ok) {
        const saved = await res.json();
        const idx = allGames.findIndex(g => g.id === saved.id);
        if (idx !== -1) allGames[idx] = saved;
        currentGame = saved;

        document.getElementById('edit-game-modal').classList.remove('active');
        renderGameDetails(currentGame);
        renderGamesGrid();
        showToast(t('toast_game_updated'));
      }
    } catch (e) {
      console.error(e);
    }
  });

  document.getElementById('btn-upload-cover').addEventListener('click', async () => {
    const id = document.getElementById('edit-game-id').value;
    const fileInput = document.getElementById('edit-cover-file-input');
    if (!fileInput.files || fileInput.files.length === 0) {
      alert('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('cover', fileInput.files[0]);

    try {
      const res = await fetch(`/api/games/${id}/cover`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (currentGame && currentGame.id === id) {
          currentGame.coverUrl = data.coverUrl;
          renderGameDetails(currentGame);
        }
        const g = allGames.find(x => x.id === id);
        if (g) g.coverUrl = data.coverUrl;
        renderGamesGrid();
        showToast(t('toast_game_updated'));
        fileInput.value = '';
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to upload cover');
      }
    } catch (e) {
      console.error(e);
    }
  });

  // ======================== CHARTS ========================
  async function loadGameChart(gameId, period) {
    try {
      const res = await fetch(`/api/statistics?period=${period}&gameId=${gameId}`);
      if (!res.ok) return;
      const data = await res.json();

      const canvas = document.getElementById('gameHorizontalChartCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      if (gameHorizontalChart) {
        gameHorizontalChart.destroy();
      }

      const isLight = currentTheme === 'light';
      const textColor = isLight ? '#475569' : '#cbd5e1';
      const gridColor = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)';

      gameHorizontalChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: translateChartLabels(period, data.horizontalChart.labels),
          datasets: [{
            label: `Time (${data.horizontalChart.unit})`,
            data: data.horizontalChart.values,
            backgroundColor: 'rgba(99, 102, 241, 0.75)',
            borderColor: '#6366f1',
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.parsed.x} ${data.horizontalChart.unit}`
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: { color: gridColor },
              ticks: { color: textColor }
            },
            y: {
              grid: { display: false },
              ticks: { color: textColor, font: { size: 11 } }
            }
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  function setupStatsControls() {
    const periodButtons = document.querySelectorAll('#stats-period-group .pill');
    periodButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        periodButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeStatsPeriod = btn.dataset.period;

        const intervalBox = document.getElementById('stats-interval-box');
        if (activeStatsPeriod === 'year') {
          intervalBox.style.display = 'block';
        } else {
          intervalBox.style.display = 'none';
        }

        loadStatistics();
      });
    });

    const intervalButtons = document.querySelectorAll('#stats-interval-group .pill');
    intervalButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        intervalButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeStatsInterval = btn.dataset.interval;
        loadStatistics();
      });
    });
  }

  async function loadStatistics() {
    try {
      const res = await fetch(`/api/statistics?period=${activeStatsPeriod}&interval=${activeStatsInterval}`);
      if (!res.ok) return;
      const data = await res.json();

      document.getElementById('stat-total-time').textContent = `${data.totalHours} ${t('hours_abbr')}`;
      document.getElementById('stat-active-count').textContent = data.activeGamesCount;
      const top1 = data.topGames && data.topGames.length > 0 ? data.topGames[0].title : '—';
      document.getElementById('stat-top-game').textContent = top1;

      const hTitle = document.getElementById('horizontal-chart-title');
      if (activeStatsPeriod === 'day') hTitle.textContent = t('hchart_day');
      else if (activeStatsPeriod === 'week') hTitle.textContent = t('hchart_week');
      else if (activeStatsPeriod === 'month') hTitle.textContent = t('hchart_month');
      else hTitle.textContent = activeStatsInterval === 'months' ? t('hchart_year_months') : t('hchart_year_weeks');

      renderPieChart(data.pieChart);
      renderHorizontalChart(data.horizontalChart);
      renderTopGamesTable(data.topGames);
    } catch (e) {
      console.error(e);
    }
  }

  function renderPieChart(pieData) {
    const canvas = document.getElementById('pieChartCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (statsPieChart) {
      statsPieChart.destroy();
    }

    const isLight = currentTheme === 'light';
    const legendColor = isLight ? '#334155' : '#cbd5e1';

    if (!pieData.labels || pieData.labels.length === 0) {
      statsPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [t('no_activity')],
          datasets: [{ data: [1], backgroundColor: [isLight ? '#e2e8f0' : '#1e293b'], borderWidth: 0 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: legendColor } } }
        }
      });
      return;
    }

    const labels = pieData.labels.map(l => l === 'Остальные' ? t('other_games') : l);

    statsPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: pieData.values,
          backgroundColor: pieData.colors,
          borderWidth: 2,
          borderColor: isLight ? '#ffffff' : '#121721'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '58%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: legendColor, padding: 14, font: { size: 12 } }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed} ${t('hours_abbr')}`
            }
          }
        }
      }
    });
  }

  function renderHorizontalChart(chartData) {
    const canvas = document.getElementById('horizontalChartCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (statsHorizontalChart) {
      statsHorizontalChart.destroy();
    }

    const isLight = currentTheme === 'light';
    const textColor = isLight ? '#475569' : '#cbd5e1';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)';

    statsHorizontalChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: translateChartLabels(activeStatsPeriod, chartData.labels),
        datasets: [{
          label: `Time (${chartData.unit})`,
          data: chartData.values,
          backgroundColor: 'rgba(56, 189, 248, 0.75)',
          borderColor: '#38bdf8',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.x} ${chartData.unit}`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: textColor }
          },
          y: {
            grid: { display: false },
            ticks: { color: textColor, font: { size: 10 } }
          }
        }
      }
    });
  }

  function translateChartLabels(period, labels) {
    if (!labels || labels.length === 0) return [];
    const dict = I18N[currentLang] || I18N.en;

    if (period === 'week') {
      const days = dict.days_short || I18N.en.days_short;
      return labels.map((l, i) => {
        // e.g. "Пн (26)" -> extract date if present
        const m = l.match(/\((\d+)\)/);
        const dayName = days[i % 7];
        return m ? `${dayName} (${m[1]})` : dayName;
      });
    }
    if (period === 'year' && labels.length === 12) {
      const months = dict.months_short || I18N.en.months_short;
      return labels.map((l, i) => months[i] || l);
    }
    return labels;
  }

  function renderTopGamesTable(topGames) {
    const tbody = document.getElementById('top-games-tbody');
    tbody.innerHTML = '';

    if (!topGames || topGames.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted); padding: 24px;">${t('no_activity')}</td></tr>`;
      return;
    }

    topGames.forEach((g, i) => {
      const rank = i + 1;
      const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';

      const tr = document.createElement('tr');
      tr.className = 'top-game-row';
      tr.innerHTML = `
        <td><span class="rank-badge ${rankClass}">${rank}</span></td>
        <td style="font-weight: 600; color: var(--text-primary);">${escapeHtml(g.title)}</td>
        <td><span class="platform-badge">${escapeHtml(g.platform)}</span></td>
        <td style="font-weight: 700; color: var(--accent-cyan);">${g.hours} ${t('hours_abbr')}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; min-width: 60px;">
              <div style="width: ${g.percentage}%; height: 100%; background: var(--accent-primary); border-radius: 3px;"></div>
            </div>
            <span style="font-size: 12px; color: var(--text-secondary); width: 40px;">${g.percentage}%</span>
          </div>
        </td>
      `;

      tr.style.cursor = 'pointer';
      tr.addEventListener('click', () => {
        openGameDetails(g.gameId);
      });

      tbody.appendChild(tr);
    });
  }

  // ======================== SETTINGS & STEAM ========================
  function setupSettings() {
    // Language change
    const langSelect = document.getElementById('setting-language');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        applyLanguage(e.target.value);
        saveSettingsDirect();
      });
    }

    // Theme change
    const themeSelect = document.getElementById('setting-theme');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        applyTheme(e.target.value);
        saveSettingsDirect();
      });
    }

    // Steam Folder Browse
    document.getElementById('btn-browse-steam-folder').addEventListener('click', async () => {
      try {
        const res = await fetch('/api/dialog/select-steam-folder');
        const data = await res.json();
        if (data.path) {
          document.getElementById('setting-steam-path').value = data.path;
        }
      } catch (e) {
        console.error(e);
      }
    });

    // Save Settings Button
    document.getElementById('btn-save-settings').addEventListener('click', async () => {
      await saveSettingsDirect();
      showToast(t('toast_saved'));
    });

    // Sync Steam
    const handleSteamSync = async () => {
      showToast(t('settings_sync_now') + '...');
      try {
        const res = await fetch('/api/steam/scan', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          await loadGames();
          showToast(t('toast_steam_sync', { count: data.importedCount }));
        }
      } catch (e) {
        console.error(e);
      }
    };

    document.getElementById('btn-sync-steam-header').addEventListener('click', handleSteamSync);
    document.getElementById('btn-sync-steam-settings').addEventListener('click', handleSteamSync);

    // Create Desktop Shortcut
    document.getElementById('btn-create-desktop-shortcut').addEventListener('click', async () => {
      try {
        const res = await fetch('/api/shortcut/create', { method: 'POST' });
        if (res.ok) {
          showToast(t('toast_shortcut_created'));
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  async function saveSettingsDirect() {
    const settings = {
      steamPath: document.getElementById('setting-steam-path').value.trim(),
      autoTrackRunningGames: document.getElementById('setting-auto-track').checked,
      scanSteamOnStartup: document.getElementById('setting-scan-startup').checked,
      language: document.getElementById('setting-language').value,
      theme: document.getElementById('setting-theme').value
    };

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function loadSettings() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const s = await res.json();
        document.getElementById('setting-steam-path').value = s.steamPath || '';
        document.getElementById('setting-auto-track').checked = s.autoTrackRunningGames;
        document.getElementById('setting-scan-startup').checked = s.scanSteamOnStartup;

        // Apply theme & language from settings (defaults: theme = dark, language = en)
        applyTheme(s.theme || 'dark');
        applyLanguage(s.language || 'en');
      }
    } catch (e) {
      console.error(e);
      applyTheme('dark');
      applyLanguage('en');
    }
  }

  // ======================== MODALS HELPERS ========================
  function setupModals() {
    document.getElementById('btn-open-add-modal').addEventListener('click', () => {
      document.getElementById('add-game-title').value = '';
      document.getElementById('add-game-base-hours').value = '0';
      document.getElementById('add-game-exe').value = '';
      document.getElementById('add-game-notes').value = '';
      addModalSelectedCover = null;
      addModalSelectedSteamId = null;
      document.getElementById('add-cover-preview-box').innerHTML = `
        <div class="game-cover-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="6"></rect></svg>
          <span style="font-size: 11px;">${t('no_cover')}</span>
        </div>
      `;
      document.getElementById('add-game-modal').classList.add('active');
    });

    document.querySelectorAll('.close-modal-btn').forEach(btn => {
      btn.addEventListener('click', closeAllModals);
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeAllModals();
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    });
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    document.getElementById('add-autocomplete-dropdown').classList.remove('active');
    currentGame = null;
  }

  // ======================== UTILITIES ========================
  function formatHours(h) {
    if (h === undefined || h === null) return '0.0';
    return Number(h).toFixed(1);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
