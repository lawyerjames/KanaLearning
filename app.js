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
    soundDiffSelector: document.getElementById('sound-difficulty-selector'),
    soundDiffBtns: document.querySelectorAll('.sound-diff-btn'),
    opponentName: document.getElementById('opponent-name'),
    opponentScoreVal: document.getElementById('opponent-score-val'),
    playerScoreVal: document.getElementById('player-score-val'),
    volleyQuestion: document.getElementById('volley-question'),
    volleyMessage: document.getElementById('volley-message'),
    volleyTimerBar: document.getElementById('volley-timer'),
    soundOptionsContainer: document.getElementById('sound-options-container'),

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
                if (mode === 'fill-blanks' || mode === 'match-sound') {
                    showScreen(mode);
                    // 設定題與對戰題需要先選難度，不直接開始遊戲
                } else {
                    startGame(mode);
                }
            }
        });
    });

    // 綁定難度選擇按鈕 (功能一 & 功能三)
    ui.diffBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.dataset.level;
            if (btn.classList.contains('sound-diff-btn')) {
                startGame('match-sound', level);
            } else {
                startGame('fill-blanks', level);
            }
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
        } else if (screenName === 'match-sound') {
            // 進入對戰模式時，顯示難度選擇
            ui.soundDiffSelector.classList.remove('hidden');
            ui.areaSound.classList.add('hidden');
            ui.displayTime.textContent = "00:00";
            ui.displayScore.textContent = "0";

            // 處理關卡解鎖機制
            const unlockLevel = parseInt(localStorage.getItem('kanagame_unlock_level')) || 1;
            ui.soundDiffBtns.forEach(btn => {
                const level = parseInt(btn.dataset.level);
                if (level > unlockLevel) {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.innerHTML = `🔒 關卡 ${level} (???)`;
                } else {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    // 恢復原本的文字
                    if (level === 1) btn.innerHTML = '⭐ 預賽 (扇南) - 5秒';
                    if (level === 2) btn.innerHTML = '⭐⭐ 複賽 (和久谷南) - 4秒';
                    if (level === 3) btn.innerHTML = '⭐⭐⭐ 準決賽 (青葉城西) - 3秒';
                    if (level === 4) btn.innerHTML = '⭐⭐⭐⭐ 決賽 (白鳥澤) - 2秒';
                }
            });
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
        ui.soundDiffSelector.classList.add('hidden');
        ui.areaSound.classList.remove('hidden');
        startVolleyballMatch(difficulty);
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

// --- 遊戲邏輯：功能一 (讀音對戰 - 排球模式) ---
const volleyData = {
    timer: null,
    timeLeft: 0,
    maxTime: 0,
    opponentScore: 0,
    playerScore: 0,
    targetKana: null,
    isAnimating: false,
    deuceMode: false,
    currentLevel: '1'
};

const opponentConfig = {
    '1': { name: '扇南高校', time: 5, players: ['十和田', '秋宮'], probHira: 1.0 },
    '2': { name: '和久谷南', time: 4, players: ['中島', '川渡'], probHira: 0.75 },
    '3': { name: '青葉城西', time: 3, players: ['及川', '岩泉', '金田一', '國見', '京谷', '花卷', '松川'], probHira: 0.5 },
    '4': { name: '白鳥澤', time: 2, players: ['牛島', '天童', '五色', '白布', '大平', '瀨見', '山形'], probHira: 0.25 }
};

const karasunoPlayers = ['日向', '影山', '澤村', '菅原', '東峰', '西谷', '田中', '月島', '山口'];

function getVolleyActionMessage(isSuccess) {
    const config = opponentConfig[volleyData.currentLevel] || opponentConfig['1'];
    const actions = ['扣球成功！', '防守成功！'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    if (isSuccess) {
        const player = karasunoPlayers[Math.floor(Math.random() * karasunoPlayers.length)];
        return `${player} ${action}`;
    } else {
        const player = config.players[Math.floor(Math.random() * config.players.length)];
        return `${player} ${action}`;
    }
}

function startVolleyballMatch(difficultyLevel) {
    const config = opponentConfig[difficultyLevel] || opponentConfig['1'];
    volleyData.currentLevel = difficultyLevel;
    volleyData.maxTime = config.time * 1000;
    volleyData.opponentScore = 0;
    volleyData.playerScore = 0;
    volleyData.deuceMode = false;
    volleyData.isAnimating = false;

    ui.opponentName.textContent = config.name;
    updateVolleyballScoreboards();

    showVolleyMessage('READY', 'warning');
    ui.volleyQuestion.textContent = '🏐';
    ui.soundOptionsContainer.innerHTML = '';
    ui.volleyTimerBar.style.width = '100%';

    // 延遲開始第一球
    setTimeout(() => {
        ui.volleyMessage.classList.remove('show');
        nextVolley();
    }, 1500);
}

function updateVolleyballScoreboards() {
    ui.opponentScoreVal.textContent = volleyData.opponentScore;
    ui.playerScoreVal.textContent = volleyData.playerScore;
}

function nextVolley() {
    if (volleyData.isAnimating) return;

    clearInterval(volleyData.timer);
    ui.volleyTimerBar.style.width = '100%';
    ui.volleyTimerBar.className = 'timer-bar safe';

    const config = opponentConfig[volleyData.currentLevel] || opponentConfig['1'];

    // 隨機抽選題目 (從清理過的資料集中)
    const randomKana = cleanedKanaData[Math.floor(Math.random() * cleanedKanaData.length)];
    volleyData.targetKana = randomKana;

    // 先決定這球主要是考平假名還是片假名 (控制難度的比例)
    const isHiraganaPrimary = Math.random() < config.probHira;
    const primaryType = isHiraganaPrimary ? 'hiragana' : 'katakana';

    // 決定可以用來配對的第二種語言 (羅馬音永遠可以，片假名只在非預賽且這題主角不是片假名時可能出現)
    let possibleSecondaryTypes = ['romaji'];
    if (primaryType === 'katakana') {
        possibleSecondaryTypes.push('hiragana');
    } else if (primaryType === 'hiragana' && config.probHira < 1.0) {
        possibleSecondaryTypes.push('katakana');
    }
    const secondaryType = possibleSecondaryTypes[Math.floor(Math.random() * possibleSecondaryTypes.length)];

    // 決定誰當題目、誰當選項
    let questionType, answerType;
    if (Math.random() < 0.5) {
        questionType = primaryType;
        answerType = secondaryType;
    } else {
        questionType = secondaryType;
        answerType = primaryType;
    }

    volleyData.questionType = questionType;
    volleyData.answerType = answerType; // 記錄選項類型，後續驗證用

    ui.volleyQuestion.textContent = randomKana[questionType];
    playAudio(randomKana.hiragana); // 唸出題目發音

    generateVolleyOptions(randomKana);

    // 開始計時
    volleyData.timeLeft = volleyData.maxTime;
    volleyData.timer = setInterval(updateVolleyTimer, 50);
}

function generateVolleyOptions(targetData) {
    ui.soundOptionsContainer.innerHTML = '';
    const answerType = volleyData.answerType;

    const options = [targetData];
    let pool = [...cleanedKanaData].filter(k => k.hiragana !== targetData.hiragana);
    pool.sort(() => 0.5 - Math.random());
    options.push(...pool.slice(0, 3));
    options.sort(() => 0.5 - Math.random());

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt[answerType]; // 根據決定的類型顯示文字

        // 為了避免出現有些片假名/平假名長一樣的狀況，如果在片假名字體大小會不一樣，這裡統一用CSS確保。
        // （現有CSS已經很大，不影響）

        btn.addEventListener('click', () => checkVolleyAnswer(opt.hiragana, btn));
        ui.soundOptionsContainer.appendChild(btn);
    });
}

function updateVolleyTimer() {
    volleyData.timeLeft -= 50;
    if (volleyData.timeLeft < 0) volleyData.timeLeft = 0;
    const percentage = (volleyData.timeLeft / volleyData.maxTime) * 100;

    ui.volleyTimerBar.style.width = percentage + '%';

    if (percentage <= 0) {
        clearInterval(volleyData.timer);
        onVolleyTimeout();
        return;
    }

    if (percentage < 30) {
        ui.volleyTimerBar.className = 'timer-bar danger';
    } else if (percentage < 60) {
        ui.volleyTimerBar.className = 'timer-bar warning';
    } else {
        ui.volleyTimerBar.className = 'timer-bar safe';
    }
}

function onVolleyTimeout() {
    volleyData.isAnimating = true;

    // 找出正確解答按鈕並標示
    const btns = ui.soundOptionsContainer.querySelectorAll('.option-btn');
    const correctText = volleyData.targetKana[volleyData.answerType];

    btns.forEach(b => {
        b.disabled = true;
        if (b.textContent === correctText) {
            b.style.backgroundColor = 'var(--success-color)';
        }
    });

    showVolleyMessage(getVolleyActionMessage(false), 'error');
    volleyData.opponentScore++;
    updateVolleyballScoreboards();

    setTimeout(checkMatchWinner, 1500);
}

function checkVolleyAnswer(selectedHiragana, btnElement) {
    if (volleyData.isAnimating) return;
    volleyData.isAnimating = true;
    clearInterval(volleyData.timer); // 停止計時

    const isCorrect = (selectedHiragana === volleyData.targetKana.hiragana);
    const btns = ui.soundOptionsContainer.querySelectorAll('.option-btn');
    btns.forEach(b => b.disabled = true);

    if (isCorrect) {
        btnElement.style.backgroundColor = 'var(--success-color)';
        showVolleyMessage(getVolleyActionMessage(true), 'success');
        addScore(50); // 遊戲總分 (排行榜用)
        volleyData.playerScore++;
    } else {
        btnElement.style.backgroundColor = 'var(--error-color)';

        // 標示正確答案
        const correctText = volleyData.targetKana[volleyData.answerType];
        btns.forEach(b => {
            if (b.textContent === correctText) {
                b.style.backgroundColor = 'var(--success-color)';
            }
        });
        showVolleyMessage(getVolleyActionMessage(false), 'error');
        volleyData.opponentScore++;
    }

    updateVolleyballScoreboards();
    setTimeout(checkMatchWinner, 1500);
}

function showVolleyMessage(msg, type) {
    ui.volleyMessage.textContent = msg;
    ui.volleyMessage.style.color = type === 'success' ? '#4CAF50' : '#FF5722';
    if (type === 'warning') ui.volleyMessage.style.color = '#FFC107';

    ui.volleyMessage.classList.remove('show');
    void ui.volleyMessage.offsetWidth; // trigger reflow
    ui.volleyMessage.classList.add('show');
}

function checkMatchWinner() {
    const pScore = volleyData.playerScore;
    const oScore = volleyData.opponentScore;

    // 檢查 Deuce (24:24 以上)
    if (pScore >= 24 && oScore >= 24) {
        if (!volleyData.deuceMode) {
            volleyData.deuceMode = true;
            showVolleyMessage('Deuce!', 'warning');
            setTimeout(() => {
                ui.volleyMessage.classList.remove('show');
                volleyData.isAnimating = false;
                nextVolley();
            }, 1500);
            return;
        }

        if (Math.abs(pScore - oScore) >= 2) {
            endVolleyballMatch(pScore > oScore ? 'player' : 'opponent');
            return;
        }
    } else {
        // 正常 25 分獲勝
        if (pScore >= 25) {
            endVolleyballMatch('player');
            return;
        } else if (oScore >= 25) {
            endVolleyballMatch('opponent');
            return;
        }
    }

    // 尚未有人獲勝，下一球
    volleyData.isAnimating = false;
    ui.volleyMessage.classList.remove('show');
    nextVolley();
}

function endVolleyballMatch(winner) {
    ui.soundOptionsContainer.innerHTML = '';
    ui.volleyQuestion.textContent = '🏆';
    clearInterval(volleyData.timer);

    if (winner === 'player') {
        showVolleyMessage('烏野高校 勝利！', 'success');
        addScore(1000); // 獲勝額外獎金分數

        // 處理關卡解鎖進度
        const currentUnlock = parseInt(localStorage.getItem('kanagame_unlock_level')) || 1;
        const playedLevel = parseInt(volleyData.currentLevel);
        if (playedLevel === currentUnlock && playedLevel < 4) {
            localStorage.setItem('kanagame_unlock_level', (playedLevel + 1).toString());
        }
    } else {
        showVolleyMessage('比賽結束...', 'error');
    }

    setTimeout(endGame, 3000);
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
