// GameTracker Frontend Application Logic

(function() {
  'use strict';

  // State
  let allGames = [];
  let currentGame = null;
  let currentTab = 'library';
  let activeStatsPeriod = 'week';
  let activeStatsInterval = 'standard';
  let activeGameChartPeriod = 'week';

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

  // Status mapping
  const StatusLabels = {
    playing: 'Играю',
    plan: 'Планирую играть',
    completed: 'Прошел',
    on_hold: 'Отложил',
    dropped: 'Забросил'
  };

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupFiltersAndSearch();
    setupModals();
    setupAddGameAutocomplete();
    setupGameDetails();
    setupSettings();
    setupStatsControls();

    // Initial data load
    loadGames();
    loadSettings();

    // Start background live polling for running game status
    startLivePolling();
  });

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
      if (!res.ok) throw new Error('Ошибка загрузки игр');
      allGames = await res.json();
      renderGamesGrid();
      updateHeaderRunningStatus();

      // If details modal is open for a game, update its live data
      if (currentGame) {
        const updated = allGames.find(g => g.id === currentGame.id);
        if (updated) {
          currentGame = updated;
          renderGameDetails(currentGame);
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
              currentGame = updated;
              renderGameDetails(currentGame);
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
      textEl.textContent = `Сейчас запущена: ${runningGame.title} (${formatHours(runningGame.totalHours)})`;
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
          liveOverlay.innerHTML = '<div class="pulse-dot"></div> Играет сейчас';
          wrapper.appendChild(liveOverlay);
        } else if (!game.isRunning && liveOverlay) {
          liveOverlay.remove();
        }

        const hoursEl = card.querySelector('.hours-tag');
        if (hoursEl) hoursEl.textContent = `${formatHours(game.totalHours)} ч`;
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

    // Pill group helper
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
      if (filters.sort === 'alpha_asc') return a.title.localeCompare(b.title, 'ru');
      if (filters.sort === 'alpha_desc') return b.title.localeCompare(a.title, 'ru');
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
          <div style="font-size: 17px; font-weight: 600; color: #fff;">Игры не найдены</div>
          <div style="font-size: 13px;">Попробуйте изменить параметры поиска или добавьте новую игру</div>
          <button class="btn btn-primary btn-sm" onclick="document.getElementById('btn-open-add-modal').click()">+ Добавить игру</button>
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

    // Cover image or placeholder
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
        ${game.isRunning ? '<div class="live-playing-overlay"><div class="pulse-dot"></div> Играет сейчас</div>' : ''}
        ${coverHtml}
      </div>
      <div class="game-card-body">
        <div class="game-title" title="${escapeHtml(game.title)}">${escapeHtml(game.title)}</div>
        <div class="game-card-footer">
          <span>Сыграно</span>
          <span class="hours-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${formatHours(game.totalHours)} ч
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

    // Close autocomplete on click outside
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

      // Special item: create custom game without cover
      const customItem = document.createElement('div');
      customItem.className = 'custom-game-btn-item';
      customItem.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <span>Создать «${escapeHtml(query)}» без обложки</span>
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
            <span style="font-size: 11px;">Нет обложки</span>
          </div>
        `;
      }
    }

    // Save New Game Button
    document.getElementById('btn-save-new-game').addEventListener('click', async () => {
      const title = input.value.trim();
      if (!title) {
        alert('Пожалуйста, укажите название игры');
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
          showToast(`Игра «${title}» добавлена!`);
          await loadGames();
        } else {
          const err = await res.json();
          alert(err.error || 'Ошибка при сохранении игры');
        }
      } catch (err) {
        console.error(err);
      }
    });

    // Native file dialog for Add Game EXE
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

  // ======================== GAME DETAILS MODAL ========================
  function setupGameDetails() {
    // Save Notes Button
    document.getElementById('btn-save-notes').addEventListener('click', async () => {
      if (!currentGame) return;
      const notes = document.getElementById('detail-notes-textarea').value;
      currentGame.notes = notes;
      await saveCurrentGame();
      showToast('Заметки сохранены');
    });

    // Add ToDo Item Button & Enter key
    const todoInput = document.getElementById('detail-new-todo-input');
    const addTodo = async () => {
      if (!currentGame) return;
      const text = todoInput.value.trim();
      if (!text) return;

      if (!currentGame.toDos) currentGame.toDos = [];
      currentGame.toDos.push({
        id: Math.random().toString(36).substring(2, 10),
        text: text,
        done: false,
        createdAt: new Date().toISOString()
      });

      todoInput.value = '';
      renderTodoList(currentGame.toDos);
      await saveCurrentGame();
    };

    document.getElementById('btn-add-todo').addEventListener('click', addTodo);
    todoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTodo();
      }
    });

    // Delete Game Button
    document.getElementById('btn-delete-game').addEventListener('click', async () => {
      if (!currentGame) return;
      if (!confirm(`Вы действительно хотите удалить игру «${currentGame.title}» и всю историю времени?`)) {
        return;
      }

      try {
        const res = await fetch(`/api/games/${currentGame.id}`, { method: 'DELETE' });
        if (res.ok) {
          closeAllModals();
          showToast(`Игра «${currentGame.title}» удалена`);
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
      coverImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="255" viewBox="0 0 170 255"><rect width="170" height="255" fill="%231a202c"/><text x="50%" y="50%" fill="%2364748b" text-anchor="middle" font-family="sans-serif" font-size="16">Нет обложки</text></svg>';
    }

    // Badges
    const statusBadge = document.getElementById('detail-status-badge');
    statusBadge.className = `status-badge status-${game.status}`;
    statusBadge.textContent = StatusLabels[game.status] || game.status;

    document.getElementById('detail-platform-badge').textContent = game.platform;

    const steamBadge = document.getElementById('detail-steam-badge');
    steamBadge.style.display = game.isSteam ? 'inline-flex' : 'none';

    const runningBadge = document.getElementById('detail-running-badge');
    runningBadge.style.display = game.isRunning ? 'inline-flex' : 'none';

    // Playtime
    document.getElementById('detail-total-hours').textContent = `${formatHours(game.totalHours)} ч`;
    const trackedMins = Math.round((game.trackedSeconds || 0) / 60);
    const trackedHours = (trackedMins / 60).toFixed(1);
    document.getElementById('detail-hours-breakdown').textContent = 
      `Базовые: ${game.baseHours} ч | Отслежено в фоне: ${trackedHours} ч (${trackedMins} мин)`;

    // Exe path
    const exeSpan = document.getElementById('detail-exe-path');
    exeSpan.textContent = game.executablePath || 'Не указан (время не трекается в фоне)';

    // Notes
    document.getElementById('detail-notes-textarea').value = game.notes || '';

    // ToDo list
    renderTodoList(game.toDos || []);
  }

  function renderTodoList(todos) {
    const list = document.getElementById('detail-todo-list');
    list.innerHTML = '';

    if (!todos || todos.length === 0) {
      list.innerHTML = '<div style="font-size: 12px; color: var(--text-muted); padding: 8px;">Задач пока нет. Добавьте задачу выше.</div>';
      return;
    }

    todos.forEach((todo, idx) => {
      const item = document.createElement('div');
      item.className = `todo-item ${todo.done ? 'done' : ''}`;

      item.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.done ? 'checked' : ''}>
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <button class="todo-del-btn" title="Удалить задачу">✕</button>
      `;

      // Toggle done
      const checkbox = item.querySelector('.todo-checkbox');
      checkbox.addEventListener('change', async () => {
        todo.done = checkbox.checked;
        item.classList.toggle('done', todo.done);
        await saveCurrentGame();
      });

      // Delete item
      const delBtn = item.querySelector('.todo-del-btn');
      delBtn.addEventListener('click', async () => {
        todos.splice(idx, 1);
        renderTodoList(todos);
        await saveCurrentGame();
      });

      list.appendChild(item);
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
        // Update in allGames
        const idx = allGames.findIndex(g => g.id === saved.id);
        if (idx !== -1) allGames[idx] = saved;
        currentGame = saved;
        renderGamesGrid();
      }
    } catch (e) {
      console.error(e);
    }
  }

  // ======================== EDIT GAME MODAL & COVER UPLOAD ========================
  function openEditModal(game) {
    document.getElementById('edit-game-id').value = game.id;
    document.getElementById('edit-game-title').value = game.title;
    document.getElementById('edit-game-platform').value = game.platform;
    document.getElementById('edit-game-status').value = game.status;
    document.getElementById('edit-game-base-hours').value = game.baseHours;
    document.getElementById('edit-game-exe').value = game.executablePath || '';
    document.getElementById('edit-cover-file-input').value = '';

    document.getElementById('edit-game-modal').classList.add('active');
  }

  // Browse EXE for Edit Modal
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

  // Save Edit Changes
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
        showToast('Изменения сохранены');
      }
    } catch (e) {
      console.error(e);
    }
  });

  // Upload Custom Cover (scaled / cropped to 2:3 ratio)
  document.getElementById('btn-upload-cover').addEventListener('click', async () => {
    const id = document.getElementById('edit-game-id').value;
    const fileInput = document.getElementById('edit-cover-file-input');
    if (!fileInput.files || fileInput.files.length === 0) {
      alert('Пожалуйста, выберите файл изображения');
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
        showToast('Обложка успешно загружена и адаптирована (2:3)');
        fileInput.value = '';
      } else {
        const err = await res.json();
        alert(err.error || 'Ошибка загрузки обложки');
      }
    } catch (e) {
      console.error(e);
    }
  });

  // ======================== GAME HORIZONTAL ACTIVITY CHART ========================
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

      gameHorizontalChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.horizontalChart.labels,
          datasets: [{
            label: `Время (${data.horizontalChart.unit})`,
            data: data.horizontalChart.values,
            backgroundColor: 'rgba(99, 102, 241, 0.75)',
            borderColor: '#6366f1',
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y', // Horizontal chart
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
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94a3b8' }
            },
            y: {
              grid: { display: false },
              ticks: { color: '#cbd5e1', font: { size: 11 } }
            }
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  // ======================== STATISTICS VIEW ========================
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

      // Update Summary Cards
      document.getElementById('stat-total-time').textContent = `${data.totalHours} ч`;
      document.getElementById('stat-active-count').textContent = data.activeGamesCount;
      const top1 = data.topGames && data.topGames.length > 0 ? data.topGames[0].title : '—';
      document.getElementById('stat-top-game').textContent = top1;

      // Update Horizontal Chart Title
      const hTitle = document.getElementById('horizontal-chart-title');
      if (activeStatsPeriod === 'day') hTitle.textContent = 'Время игры по часам (минут)';
      else if (activeStatsPeriod === 'week') hTitle.textContent = 'Время игры по дням недели (часов)';
      else if (activeStatsPeriod === 'month') hTitle.textContent = 'Время игры по дням месяца (часов)';
      else hTitle.textContent = activeStatsInterval === 'months' ? 'Время игры по месяцам (часов)' : 'Время игры по неделям года (часов)';

      // 1. Render Pie Chart
      renderPieChart(data.pieChart);

      // 2. Render Main Horizontal Bar Chart
      renderHorizontalChart(data.horizontalChart);

      // 3. Render Top Games Table
      renderTopGamesTable(data.topGames);
    } catch (e) {
      console.error(e);
    }
  }

  function renderPieChart(pieData) {
    const canvas = document.getElementById('pieChartCanvas');
    const ctx = canvas.getContext('2d');

    if (statsPieChart) {
      statsPieChart.destroy();
    }

    if (!pieData.labels || pieData.labels.length === 0) {
      // Empty chart placeholder
      statsPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Нет данных за период'],
          datasets: [{ data: [1], backgroundColor: ['#1e293b'], borderWidth: 0 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#64748b' } } }
        }
      });
      return;
    }

    statsPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: pieData.labels,
        datasets: [{
          data: pieData.values,
          backgroundColor: pieData.colors,
          borderWidth: 2,
          borderColor: '#121721'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '58%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#cbd5e1', padding: 14, font: { size: 12 } }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed} ч`
            }
          }
        }
      }
    });
  }

  function renderHorizontalChart(chartData) {
    const canvas = document.getElementById('horizontalChartCanvas');
    const ctx = canvas.getContext('2d');

    if (statsHorizontalChart) {
      statsHorizontalChart.destroy();
    }

    statsHorizontalChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: `Время (${chartData.unit})`,
          data: chartData.values,
          backgroundColor: 'rgba(56, 189, 248, 0.75)',
          borderColor: '#38bdf8',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y', // Horizontal chart
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
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#cbd5e1', font: { size: 10 } }
          }
        }
      }
    });
  }

  function renderTopGamesTable(topGames) {
    const tbody = document.getElementById('top-games-tbody');
    tbody.innerHTML = '';

    if (!topGames || topGames.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted); padding: 24px;">Активности за выбранный период не зафиксировано.</td></tr>`;
      return;
    }

    topGames.forEach((g, i) => {
      const rank = i + 1;
      const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';

      const tr = document.createElement('tr');
      tr.className = 'top-game-row';
      tr.innerHTML = `
        <td><span class="rank-badge ${rankClass}">${rank}</span></td>
        <td style="font-weight: 600; color: #fff;">${escapeHtml(g.title)}</td>
        <td><span class="platform-badge">${escapeHtml(g.platform)}</span></td>
        <td style="font-weight: 700; color: var(--accent-cyan);">${g.hours} ч</td>
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

    // Save Settings
    document.getElementById('btn-save-settings').addEventListener('click', async () => {
      const settings = {
        steamPath: document.getElementById('setting-steam-path').value.trim(),
        autoTrackRunningGames: document.getElementById('setting-auto-track').checked,
        scanSteamOnStartup: document.getElementById('setting-scan-startup').checked
      };

      try {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        });
        if (res.ok) {
          showToast('Настройки сохранены');
        }
      } catch (e) {
        console.error(e);
      }
    });

    // Sync Steam Now (Header button & Settings button)
    const handleSteamSync = async () => {
      showToast('Сканирование библиотек Steam...');
      try {
        const res = await fetch('/api/steam/scan', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          await loadGames();
          showToast(`Импорт завершен! Добавлено/обновлено: ${data.importedCount} игр`);
        } else {
          showToast('Ошибка при сканировании Steam');
        }
      } catch (e) {
        console.error(e);
        showToast('Не удалось подключиться к Steam');
      }
    };

    document.getElementById('btn-sync-steam-header').addEventListener('click', handleSteamSync);
    document.getElementById('btn-sync-steam-settings').addEventListener('click', handleSteamSync);

    // Create Desktop Shortcut
    document.getElementById('btn-create-desktop-shortcut').addEventListener('click', async () => {
      try {
        const res = await fetch('/api/shortcut/create', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          showToast(`Ярлык создан на рабочем столе: ${data.path}`);
        } else {
          showToast('Ошибка создания ярлыка');
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  async function loadSettings() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const s = await res.json();
        document.getElementById('setting-steam-path').value = s.steamPath || '';
        document.getElementById('setting-auto-track').checked = s.autoTrackRunningGames;
        document.getElementById('setting-scan-startup').checked = s.scanSteamOnStartup;
      }
    } catch (e) {
      console.error(e);
    }
  }

  // ======================== MODALS HELPERS ========================
  function setupModals() {
    // Open Add Modal
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
          <span style="font-size: 11px;">Нет обложки</span>
        </div>
      `;
      document.getElementById('add-game-modal').classList.add('active');
    });

    // Close buttons on all modals
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
      btn.addEventListener('click', closeAllModals);
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeAllModals();
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    });
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    document.getElementById('add-autocomplete-dropdown').classList.remove('active');
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
