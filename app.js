// app.js - 核心遊戲邏輯

// 全域狀態
const gameState = {
    currentScreen: 'home',
    currentMode: null,  // 'sound', 'kana', 'blanks'
    difficulty: null,   // 'easy', 'medium', 'hard' (僅功能三適用)
    score: 0,
    timeElapsed: 0, // 經過秒數
    timerInterval: null,
    isPlaying: false
};

// DOM 元素快取
const ui = {
    header: document.getElementById('game-header'),
    displayTime: document.getElementById('display-time'),
    displayScore: document.getElementById('display-score'),
    screens: document.querySelectorAll('.screen'),
    btnHome: document.getElementById('btn-home'),
    menuBtns: document.querySelectorAll('.btn-menu'),
    diffBtns: document.querySelectorAll('.btn-diff'),

    // 遊戲區域
    areaSound: document.getElementById('game-area-sound'),
    areaKana: document.getElementById('game-area-kana'),
    areaBlanks: document.getElementById('game-area-blanks'),
    gojuonGrid: document.getElementById('gojuon-grid'),
    optionsContainer: document.getElementById('options-container'),
    diffSelector: document.getElementById('difficulty-selector'),

    // 彈窗
    modalOverlay: document.getElementById('modal-overlay'),
    wordEmoji: document.getElementById('word-emoji'),
    wordKana: document.getElementById('word-kana'),
    wordRomaji: document.getElementById('word-romaji'),
    wordMeaning: document.getElementById('word-meaning'),
    btnNextWord: document.getElementById('btn-next-word'),

    resultModal: document.getElementById('result-modal'),
    finalScoreValue: document.getElementById('final-score-value'),
    finalTimeValue: document.getElementById('final-time-value'),
    playerNameInput: document.getElementById('player-name'),
    btnSaveScore: document.getElementById('btn-save-score'),

    // 排行榜
    leaderboardList: document.getElementById('leaderboard-list'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    btnBackHomeLb: document.getElementById('btn-back-home-lb')
};

// --- 初始化與事件綁定 ---

function init() {
    // 綁定主選單按鈕
    ui.menuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            if (target === 'screen-leaderboard') {
                showScreen('leaderboard');
                renderLeaderboard('sound'); // 預設顯示讀音配對
            } else {
                const mode = target.replace('screen-', '');
                if (mode === 'fill-blanks') {
                    showScreen(mode);
                    // 填空題需要先選難度，不直接開始遊戲
                } else {
                    startGame(mode);
                }
            }
        });
    });

    // 綁定難度選擇按鈕 (功能三)
    ui.diffBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.dataset.level;
            startGame('fill-blanks', level);
        });
    });

    // 回主畫面
    ui.btnHome.addEventListener('click', () => showScreen('home'));
    ui.btnBackHomeLb.addEventListener('click', () => showScreen('home'));

    // 彈窗「繼續」按鈕
    ui.btnNextWord.addEventListener('click', () => {
        ui.modalOverlay.classList.add('hidden');
        // TODO: 檢查遊戲是否結束
    });

    // 儲存分數按鈕
    ui.btnSaveScore.addEventListener('click', saveScore);

    // 排行榜頁籤切換
    ui.tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            ui.tabBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderLeaderboard(e.target.dataset.board);
        });
    });
}

// --- 畫面控制 ---

function showScreen(screenName) {
    // 隱藏所有畫面
    ui.screens.forEach(s => s.classList.add('hidden'));

    // 停止遊戲與計時器
    stopTimer();
    gameState.isPlaying = false;

    // 顯示目標畫面
    const targetScreen = document.getElementById(`screen-${screenName}`);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        targetScreen.style.animation = 'none'; // 重製動畫
        targetScreen.offsetHeight; // 觸發 reflow
        targetScreen.style.animation = null;
    }

    // 根據畫面顯示/隱藏資訊列
    if (screenName === 'home' || screenName === 'leaderboard') {
        ui.header.classList.add('hidden');
    } else {
        ui.header.classList.remove('hidden');
        if (screenName === 'fill-blanks') {
            // 進入填空模式時，先顯示難度選擇，隱藏遊戲區，且重設狀態
            ui.diffSelector.classList.remove('hidden');
            ui.areaBlanks.classList.add('hidden');
            ui.displayTime.textContent = "00:00";
            ui.displayScore.textContent = "0";
        }
    }
}

// --- 遊戲狀態控制 ---

function startGame(mode, difficulty = null) {
    gameState.currentMode = mode;
    gameState.difficulty = difficulty;
    gameState.score = 0;
    gameState.timeElapsed = 0;
    gameState.isPlaying = true;

    updateScoreDisplay();
    updateTimeDisplay();

    showScreen(mode);

    if (mode === 'fill-blanks') {
        ui.diffSelector.classList.add('hidden');
        ui.areaBlanks.classList.remove('hidden');
        startFillBlanksGame(difficulty);
    } else if (mode === 'match-sound') {
        startSoundMatchGame();
    } else if (mode === 'match-kana') {
        startKanaMatchGame();
    }

    // 啟動計時器
    startTimer();
}

function endGame() {
    stopTimer();
    gameState.isPlaying = false;

    // 顯示結算彈窗
    ui.finalScoreValue.textContent = gameState.score;
    ui.finalTimeValue.textContent = formatTime(gameState.timeElapsed);
    ui.playerNameInput.value = ''; // 清空輸入
    ui.resultModal.classList.remove('hidden');
}

// --- 計時器與計分 ---

function startTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        gameState.timeElapsed++;
        updateTimeDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(gameState.timerInterval);
}

function updateTimeDisplay() {
    ui.displayTime.textContent = formatTime(gameState.timeElapsed);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function addScore(points) {
    gameState.score += points;
    updateScoreDisplay();
}

function updateScoreDisplay() {
    ui.displayScore.textContent = gameState.score;
    // 添加一個簡單的放大動畫效果
    ui.displayScore.style.transform = 'scale(1.5)';
    setTimeout(() => {
        ui.displayScore.style.transform = 'scale(1)';
    }, 200);
}

// --- 單字展示彈窗與語音播放 ---

function playAudio(text, lang = 'ja-JP') {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9; // 稍微放慢速度適合小孩
        window.speechSynthesis.speak(utterance);
    }
}

function showWordModal(kanaObj) {
    ui.wordEmoji.textContent = kanaObj.emoji;
    ui.wordKana.textContent = kanaObj.word;
    ui.wordRomaji.textContent = kanaObj.romaji;
    ui.wordMeaning.textContent = kanaObj.meaning;

    ui.modalOverlay.classList.remove('hidden');
    playAudio(kanaObj.word); // 顯示彈窗時自動播放單字發音
}

// --- 遊戲邏輯：功能一 (讀音配對) ---
let matchedPairsSound = 0;
let soundGameKanaList = [];
let firstCardSound = null;
let isAnimatingSound = false;

function startSoundMatchGame() {
    ui.areaSound.innerHTML = '';
    matchedPairsSound = 0;
    firstCardSound = null;
    isAnimatingSound = false;

    // 隨機抽選 6 個不同的假名 (共 12 張卡片)
    const shuffledData = [...cleanedKanaData].sort(() => 0.5 - Math.random());
    const selectedKana = shuffledData.slice(0, 6);

    // 產生配對陣列：一張顯示假名，一張顯示發音按鈕 (或羅馬音)
    const cards = [];
    selectedKana.forEach(k => {
        cards.push({ id: k.hiragana, type: 'kana', display: k.hiragana, obj: k });
        // 為了讓卡片有明顯區別，發音卡顯示喇叭圖示與羅馬音提示
        cards.push({ id: k.hiragana, type: 'sound', display: `🔊 ${k.romaji}`, obj: k });
    });

    // 打亂卡片順序
    cards.sort(() => 0.5 - Math.random());

    // 建立棋盤 (CSS grid)
    const grid = document.createElement('div');
    grid.className = 'gojuon-grid'; // 重用 grid 樣式
    // 強制設定為 4 欄 (4x3 = 12張)
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)';

    cards.forEach((card, index) => {
        const btn = document.createElement('div');
        btn.className = 'kana-card';
        // HTML 屬性無法存物件，所以存在 dataset 方便比對
        btn.dataset.index = index;
        btn.dataset.id = card.id;
        btn.dataset.type = card.type;
        btn.innerHTML = card.display;

        // 點擊事件
        btn.addEventListener('click', () => handleSoundCardClick(btn, card));
        grid.appendChild(btn);
    });

    soundGameKanaList = cards;
    ui.areaSound.appendChild(grid);
}

function handleSoundCardClick(cardElement, cardData) {
    if (isAnimatingSound || cardElement.classList.contains('matched') || cardElement.classList.contains('selected')) {
        return;
    }

    // 如果點到聲音卡，直接播放發音
    if (cardData.type === 'sound') {
        playAudio(cardData.id);
    }

    cardElement.classList.add('selected');

    if (!firstCardSound) {
        // 翻第一張卡
        firstCardSound = { el: cardElement, data: cardData };
    } else {
        // 翻第二張卡，進行比對
        const secondCard = { el: cardElement, data: cardData };
        isAnimatingSound = true;

        if (firstCardSound.data.id === secondCard.data.id && firstCardSound.data.type !== secondCard.data.type) {
            // 配對成功！(確認是同一個字，且一邊是 kana, 一邊是 sound)
            addScore(100);

            setTimeout(() => {
                firstCardSound.el.classList.remove('selected');
                secondCard.el.classList.remove('selected');
                firstCardSound.el.classList.add('matched');
                secondCard.el.classList.add('matched');

                // 顯示單字獎勵彈窗
                showWordModal(cardData.obj);

                matchedPairsSound++;

                // 確認是否完成
                if (matchedPairsSound === 6) { // 6對卡片
                    setTimeout(endGame, 1000);
                }

                resetTurnSound();
            }, 600);
        } else {
            // 配對失敗
            setTimeout(() => {
                firstCardSound.el.classList.remove('selected');
                secondCard.el.classList.remove('selected');
                // 扣一點分數以資懲罰？(暫不扣分確保小孩不挫折，或扣10分)
                if (gameState.score > 0) addScore(-10);
                resetTurnSound();
            }, 1000); // 給玩家 1 秒看錯了哪裡
        }
    }
}

function resetTurnSound() {
    firstCardSound = null;
    isAnimatingSound = false;
}

// --- 遊戲邏輯：功能二 (平片假名配對) ---
let matchedPairsKana = 0;
let firstCardKana = null;
let isAnimatingKana = false;

function startKanaMatchGame() {
    ui.areaKana.innerHTML = '';
    matchedPairsKana = 0;
    firstCardKana = null;
    isAnimatingKana = false;

    // 隨機抽選 8 個不同的假名 (共 16 張卡片，4x4 版面)
    const shuffledData = [...cleanedKanaData].sort(() => 0.5 - Math.random());
    const selectedKana = shuffledData.slice(0, 8);

    // 產生配對陣列：平假名 與 片假名
    const cards = [];
    selectedKana.forEach(k => {
        cards.push({ id: k.hiragana, type: 'hiragana', display: k.hiragana, obj: k });
        cards.push({ id: k.hiragana, type: 'katakana', display: k.katakana, obj: k });
    });

    // 打亂卡片
    cards.sort(() => 0.5 - Math.random());

    const grid = document.createElement('div');
    grid.className = 'gojuon-grid';
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)';

    cards.forEach((card, index) => {
        const btn = document.createElement('div');
        btn.className = 'kana-card';
        btn.dataset.id = card.id;
        btn.dataset.type = card.type;
        btn.innerHTML = card.display;

        btn.addEventListener('click', () => handleKanaCardClick(btn, card));
        grid.appendChild(btn);
    });

    ui.areaKana.appendChild(grid);
}

function handleKanaCardClick(cardElement, cardData) {
    if (isAnimatingKana || cardElement.classList.contains('matched') || cardElement.classList.contains('selected')) {
        return;
    }

    playAudio(cardData.obj.word); // 點擊時播放該字對應單字發音 (或改成播放該假名發音 cardData.obj.hiragana)

    cardElement.classList.add('selected');

    if (!firstCardKana) {
        firstCardKana = { el: cardElement, data: cardData };
    } else {
        const secondCard = { el: cardElement, data: cardData };
        isAnimatingKana = true;

        // 配對條件：同一個字母，且一個是平假名一個是片假名
        if (firstCardKana.data.id === secondCard.data.id && firstCardKana.data.type !== secondCard.data.type) {
            addScore(100);

            setTimeout(() => {
                firstCardKana.el.classList.remove('selected');
                secondCard.el.classList.remove('selected');
                firstCardKana.el.classList.add('matched');
                secondCard.el.classList.add('matched');

                showWordModal(cardData.obj);

                matchedPairsKana++;
                if (matchedPairsKana === 8) {
                    setTimeout(endGame, 1000);
                }
                resetTurnKana();
            }, 600);
        } else {
            setTimeout(() => {
                firstCardKana.el.classList.remove('selected');
                secondCard.el.classList.remove('selected');
                if (gameState.score > 0) addScore(-10);
                resetTurnKana();
            }, 1000);
        }
    }
}

function resetTurnKana() {
    firstCardKana = null;
    isAnimatingKana = false;
}

// --- 遊戲邏輯：功能三 (五十音填空) ---
let blanksGameState = {
    blanksLeft: 0,
    currentActiveBlank: null,
    hiddenItems: [] // 記錄被挖空的字
};

function startFillBlanksGame(difficulty) {
    ui.gojuonGrid.innerHTML = '';
    ui.optionsContainer.innerHTML = '';
    ui.optionsContainer.classList.add('hidden');
    blanksGameState.hiddenItems = [];
    blanksGameState.blanksLeft = 0;

    // 將版面設為 5 欄 (あいうえお)
    ui.gojuonGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';

    // 計算總共有多少有效的字 (非 null)
    const validKanaCount = gojuonGridLayout.flat().filter(k => k !== null).length; // 46 個字

    // 決定要挖空幾個字
    let numToHide = 0;
    if (difficulty === 'easy') numToHide = Math.floor(validKanaCount * 0.25); // 隱藏 1/4 (簡單)
    else if (difficulty === 'medium') numToHide = Math.floor(validKanaCount * 0.5); // 隱藏 1/2 (中等)
    else if (difficulty === 'hard') numToHide = validKanaCount; // 全部隱藏 (困難)

    // 從 valid kana 中選出要挖空的字
    let validKanaList = gojuonGridLayout.flat().filter(k => k !== null);
    validKanaList.sort(() => 0.5 - Math.random());
    const kanaToHide = new Set(validKanaList.slice(0, numToHide));

    blanksGameState.blanksLeft = numToHide;

    // 渲染表格
    gojuonGridLayout.forEach((row, rowIndex) => {
        row.forEach((kanaStr, colIndex) => {
            const cell = document.createElement('div');
            cell.className = 'kana-card';

            if (kanaStr === null) {
                // 空格 (如 や行、わ行 缺少的字) 不可點擊
                cell.classList.add('empty');
                cell.innerHTML = '';
                ui.gojuonGrid.appendChild(cell);
                return;
            }

            // 找到對應的物件以取得完整資料
            const kObj = cleanedKanaData.find(k => k.hiragana === kanaStr);
            if (!kObj) {
                console.error('Data missing for:', kanaStr);
            }

            cell.dataset.id = kanaStr;
            cell.dataset.romaji = kObj ? kObj.romaji : '';

            if (kanaToHide.has(kanaStr)) {
                // 這個字被挖空，顯示 ? 或空白，可點擊
                cell.innerHTML = '❓';
                cell.classList.add('blank-cell');
                blanksGameState.hiddenItems.push(kanaStr);

                cell.addEventListener('click', () => handleBlankClick(cell, kanaStr));
            } else {
                // 保留顯示的字，不能點擊
                cell.innerHTML = kanaStr;
                cell.classList.add('matched'); // 用 matched 樣式表示不可再填寫
            }

            ui.gojuonGrid.appendChild(cell);
        });
    });
}

function handleBlankClick(cellElement, targetKana) {
    if (cellElement.classList.contains('matched')) return; // 已填答正確

    // 移除之前的選取狀態
    if (blanksGameState.currentActiveBlank) {
        blanksGameState.currentActiveBlank.el.classList.remove('selected');
    }

    cellElement.classList.add('selected');
    blanksGameState.currentActiveBlank = { el: cellElement, target: targetKana };

    // 顯示下方選項
    generateOptions(targetKana);
}

function generateOptions(targetKana) {
    ui.optionsContainer.innerHTML = '';
    ui.optionsContainer.classList.remove('hidden');

    // 選出正確解答
    const options = [targetKana];

    // 產生 3 個錯誤解答 (從未被填答的隱藏假名或全資料隨機選)
    let pool = [...cleanedKanaData.map(k => k.hiragana)].filter(k => k !== targetKana);
    pool.sort(() => 0.5 - Math.random());

    options.push(...pool.slice(0, 3));

    // 打亂選項順序
    options.sort(() => 0.5 - Math.random());

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;

        btn.addEventListener('click', () => checkAnswer(opt));
        ui.optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedKana) {
    const activeData = blanksGameState.currentActiveBlank;
    if (!activeData) return;

    const target = activeData.target;
    const cell = activeData.el;

    if (selectedKana === target) {
        // 答對了！
        playAudio(target); // 念出這個假名
        addScore(50);

        cell.innerHTML = target;
        cell.classList.remove('selected', 'blank-cell');
        cell.classList.add('matched');

        ui.optionsContainer.innerHTML = ''; // 清除選項
        ui.optionsContainer.classList.add('hidden');
        blanksGameState.currentActiveBlank = null;

        blanksGameState.blanksLeft--;

        if (blanksGameState.blanksLeft === 0) {
            setTimeout(endGame, 1000);
        }
    } else {
        // 答錯，稍微抖動格子並扣分
        cell.style.transform = 'translateX(-5px)';
        setTimeout(() => cell.style.transform = 'translateX(5px)', 100);
        setTimeout(() => cell.style.transform = 'scale(1.1)', 200); // 回復選取狀態的 scale

        if (gameState.score > 0) addScore(-5);

        // 錯誤音效 (可用語音提示)
        // playAudio('ちがうよ'); 
    }
}

// --- 排行榜 (LocalStorage) ---

function saveScore() {
    const name = ui.playerNameInput.value.trim() || '無名英雄';
    const scoreData = {
        name: name,
        score: gameState.score,
        time: gameState.timeElapsed,
        date: new Date().toISOString()
    };

    // 根據模式儲存
    let boardKey = `kanagame_${gameState.currentMode}`;
    if (gameState.currentMode === 'fill-blanks') {
        boardKey += `_${gameState.difficulty}`;
    }

    let scores = JSON.parse(localStorage.getItem(boardKey)) || [];
    scores.push(scoreData);

    // 依分數高低排序，同分比時間(越短越好)
    scores.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.time - b.time;
    });

    // 只取前 10 名
    scores = scores.slice(0, 10);
    localStorage.setItem(boardKey, JSON.stringify(scores));

    // 關閉彈窗並切換至排行榜
    ui.resultModal.classList.add('hidden');
    showScreen('leaderboard');

    // 切換到對應的頁籤
    let tabTarget = gameState.currentMode;
    if (tabTarget === 'match-sound') tabTarget = 'sound';
    if (tabTarget === 'match-kana') tabTarget = 'kana';
    if (tabTarget === 'fill-blanks') tabTarget = 'blanks';

    ui.tabBtns.forEach(btn => {
        if (btn.dataset.board === tabTarget) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    renderLeaderboard(tabTarget);
}

function renderLeaderboard(boardType) {
    let boardKey = '';
    let titleAddon = '';

    if (boardType === 'blanks') {
        // 預設顯示中等難度的排行榜，或合併顯示。為求簡單，這裡先顯示中等
        // TODO: 應該在畫面上增加難度切換，這裡作為示範先寫死 'medium' 或合併。
        // 目前先直接以 key 為 kanagame_fill-blanks_medium 示範
        boardKey = `kanagame_fill-blanks_medium`;
        titleAddon = ' (中等難度)';
    } else if (boardType === 'sound') {
        boardKey = `kanagame_match-sound`;
    } else if (boardType === 'kana') {
        boardKey = `kanagame_match-kana`;
    }

    const scores = JSON.parse(localStorage.getItem(boardKey)) || [];
    ui.leaderboardList.innerHTML = '';

    if (scores.length === 0) {
        ui.leaderboardList.innerHTML = `<li style="justify-content:center;color:#999;">目前沒有紀錄${titleAddon}</li>`;
        return;
    }

    scores.forEach((s, index) => {
        const li = document.createElement('li');

        let rankIcon = `${index + 1}.`;
        if (index === 0) rankIcon = '🥇';
        if (index === 1) rankIcon = '🥈';
        if (index === 2) rankIcon = '🥉';

        li.innerHTML = `
            <span class="rank">${rankIcon}</span>
            <span class="player-name">${s.name}</span>
            <span class="player-score">${s.score}分 (${formatTime(s.time)})</span>
        `;
        ui.leaderboardList.appendChild(li);
    });
}

// --- 啟動函式 ---
document.addEventListener('DOMContentLoaded', init);
