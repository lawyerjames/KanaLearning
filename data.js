// data.js - 儲存五十音與單字資料
const kanaData = [
    // あ行
    { hiragana: 'あ', katakana: 'ア', romaji: 'a', word: 'あさひ', emoji: '🧔🏻‍♂️', meaning: '旭(東峰)' },
    { hiragana: 'い', katakana: 'イ', romaji: 'i', word: 'いわいずみ', emoji: '💪', meaning: '岩泉' },
    { hiragana: 'う', katakana: 'ウ', romaji: 'u', word: 'うしじま', emoji: '🦅', meaning: '牛島' },
    { hiragana: 'え', katakana: 'エ', romaji: 'e', word: 'えーす', emoji: '⭐', meaning: '王牌' },
    { hiragana: 'お', katakana: 'オ', romaji: 'o', word: 'おいかわ', emoji: '👑', meaning: '及川' },

    // か行
    { hiragana: 'か', katakana: 'カ', romaji: 'ka', word: 'かげやま', emoji: '🥛', meaning: '影山' },
    { hiragana: 'き', katakana: 'キ', romaji: 'ki', word: 'きよこ', emoji: '👓', meaning: '潔子' },
    { hiragana: 'く', katakana: 'ク', romaji: 'ku', word: 'くろお', emoji: '🐈‍⬛', meaning: '黑尾' },
    { hiragana: 'け', katakana: 'ケ', romaji: 'ke', word: 'けんま', emoji: '🎮', meaning: '研磨' },
    { hiragana: 'こ', katakana: 'コ', romaji: 'ko', word: 'こーち', emoji: '📣', meaning: '教練' },

    // さ行
    { hiragana: 'さ', katakana: 'サ', romaji: 'sa', word: 'さーぶ', emoji: '🏐', meaning: '發球' },
    { hiragana: 'し', katakana: 'シ', romaji: 'shi', word: 'しみず', emoji: '📋', meaning: '清水' },
    { hiragana: 'す', katakana: 'ス', romaji: 'su', word: 'すがわら', emoji: '🕊️', meaning: '菅原' },
    { hiragana: 'せ', katakana: 'セ', romaji: 'se', word: 'せったー', emoji: '👐', meaning: '舉球員' },
    { hiragana: 'そ', katakana: 'ソ', romaji: 'so', word: 'そっこう', emoji: '⚡', meaning: '速攻' },

    // た行
    { hiragana: 'た', katakana: 'タ', romaji: 'ta', word: 'たなか', emoji: '🦲', meaning: '田中' },
    { hiragana: 'ち', katakana: 'チ', romaji: 'chi', word: 'ちーむ', emoji: '🤝', meaning: '隊伍' },
    { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu', word: 'つきしま', emoji: '🌙', meaning: '月島' },
    { hiragana: 'て', katakana: 'テ', romaji: 'te', word: 'てんどう', emoji: '🍫', meaning: '天童' },
    { hiragana: 'と', katakana: 'ト', romaji: 'to', word: 'とす', emoji: '🤲', meaning: '托球' },

    // な行
    { hiragana: 'な', katakana: 'ナ', romaji: 'na', word: 'なつ', emoji: '👧', meaning: '夏(日向妹)' },
    { hiragana: 'に', katakana: 'ニ', romaji: 'ni', word: 'にしのや', emoji: '⚡', meaning: '西谷' },
    { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu', word: 'ぬぐ', emoji: '👕', meaning: '脫下(外套)' },
    { hiragana: 'ね', katakana: 'ネ', romaji: 'ne', word: 'ねこま', emoji: '🐱', meaning: '音駒' },
    { hiragana: 'の', katakana: 'ノ', romaji: 'no', word: 'のや', emoji: '🦸‍♂️', meaning: '谷(西谷)' },

    // は行
    { hiragana: 'は', katakana: 'ハ', romaji: 'ha', word: 'はいきゅー', emoji: '🏐', meaning: '排球' },
    { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi', word: 'ひなた', emoji: '☀️', meaning: '日向' },
    { hiragana: 'ふ', katakana: 'フ', romaji: 'ふ', word: 'ふくろうだに', emoji: '🦉', meaning: '梟谷' },
    { hiragana: 'へ', katakana: 'ヘ', romaji: 'he', word: 'へっでぃんぐ', emoji: '🤕', meaning: '頭球' },
    { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho', word: 'ほしうみ', emoji: '🌟', meaning: '星海' },

    // ま行
    { hiragana: 'ま', katakana: 'マ', romaji: 'ma', word: 'まねーじゃー', emoji: '📝', meaning: '經理' },
    { hiragana: 'み', katakana: 'ミ', romaji: 'mi', word: 'みや', emoji: '🦊', meaning: '宮(兄弟)' },
    { hiragana: 'む', katakana: 'ム', romaji: 'mu', word: 'むじなざか', emoji: '🦡', meaning: '貉坂' },
    { hiragana: 'め', katakana: 'メ', romaji: 'me', word: 'めんばー', emoji: '🧑‍🤝‍🧑', meaning: '隊友' },
    { hiragana: 'も', katakana: 'モ', romaji: 'mo', word: 'もりすけ', emoji: '🛡️', meaning: '衛輔(夜久)' },

    // や行
    { hiragana: 'や', katakana: 'ヤ', romaji: 'ya', word: 'やまぐち', emoji: '🍟', meaning: '山口' },
    { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu', word: 'ゆう', emoji: '🌩️', meaning: '夕(西谷)' },
    { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo', word: 'よる', emoji: '🌙', meaning: '夜' },

    // ら行
    { hiragana: 'ら', katakana: 'ラ', romaji: 'ra', word: 'らいばる', emoji: '🔥', meaning: '對手' },
    { hiragana: 'り', katakana: 'リ', romaji: 'ri', word: 'りべろ', emoji: '🛡️', meaning: '自由球員' },
    { hiragana: 'る', katakana: 'ル', romaji: 'ru', word: 'るーきー', emoji: '🌱', meaning: '新人' },
    { hiragana: 'れ', katakana: 'レ', romaji: 're', word: 'れしーぶ', emoji: '👐', meaning: '接球' },
    { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro', word: 'ろーてーしょん', emoji: '🔄', meaning: '輪轉' },

    // わ行
    { hiragana: 'わ', katakana: 'ワ', romaji: 'wa', word: 'わしじょう', emoji: '🦅', meaning: '鷲匠' },
    { hiragana: 'を', katakana: 'ヲ', romaji: 'wo', word: 'を', emoji: '🪧', meaning: '助詞' },
    { hiragana: 'ん', katakana: 'ン', romaji: 'n', word: 'ん', emoji: '🔤', meaning: '撥音' }
];

// 五十音完整排版結構 (包含空的段落，用於功能三的表格)
const gojuonGridLayout = [
    ['あ', 'い', 'う', 'え', 'お'],
    ['か', 'き', 'く', 'け', 'こ'],
    ['さ', 'し', 'す', 'せ', 'そ'],
    ['た', 'ち', 'つ', 'て', 'と'],
    ['な', 'に', 'ぬ', 'ね', 'の'],
    ['は', 'ひ', 'ふ', 'へ', 'ほ'],
    ['ま', 'み', 'む', 'め', 'も'],
    ['や', null, 'ゆ', null, 'よ'],
    ['ら', 'り', 'る', 'れ', 'ろ'],
    ['わ', null, null, null, 'を'],
    ['ん', null, null, null, null]
];

// 確保去重
const cleanedKanaData = kanaData.filter((item, index, self) =>
    index === self.findIndex((t) => t.hiragana === item.hiragana)
);

// 新增：排球少年專屬單字庫 (供平片假名配對模式使用)
const haikyuuWords = {
    '2': [
        { hiragana: 'とす', katakana: 'トス', meaning: '托球' },
        { hiragana: 'ねこ', katakana: 'ネコ', meaning: '貓(音駒)' },
        { hiragana: 'くろ', katakana: 'クロ', meaning: '黑(黑尾)' },
        { hiragana: 'ひな', katakana: 'ヒナ', meaning: '雛(日向)' },
        { hiragana: 'うし', katakana: 'ウシ', meaning: '牛(牛島)' },
        { hiragana: 'のや', katakana: 'ノヤ', meaning: '谷(西谷)' },
        { hiragana: 'みや', katakana: 'ミヤ', meaning: '宮(兄弟)' },
        { hiragana: 'なつ', katakana: 'ナツ', meaning: '夏(日向妹)' },
        { hiragana: 'やく', katakana: 'ヤク', meaning: '夜久' },
        { hiragana: 'わし', katakana: 'ワシ', meaning: '鷲(鷲匠)' }
    ],
    '3': [
        { hiragana: 'ひなた', katakana: 'ヒナタ', meaning: '日向' },
        { hiragana: 'あさひ', katakana: 'アサヒ', meaning: '旭(東峰)' },
        { hiragana: 'たなか', katakana: 'タナカ', meaning: '田中' },
        { hiragana: 'けんま', katakana: 'ケンマ', meaning: '研磨' },
        { hiragana: 'きよこ', katakana: 'キヨコ', meaning: '潔子' },
        { hiragana: 'しみず', katakana: 'シミズ', meaning: '清水' },
        { hiragana: 'しらぶ', katakana: 'シラブ', meaning: '白布' },
        { hiragana: 'ごしき', katakana: 'ゴシキ', meaning: '五色' },
        { hiragana: 'りべろ', katakana: 'リベロ', meaning: '自由球員' },
        { hiragana: 'からす', katakana: 'カラス', meaning: '烏' },
        { hiragana: 'ふくろ', katakana: 'フクロ', meaning: '梟' }
    ],
    '4': [
        { hiragana: 'かげやま', katakana: 'カゲヤマ', meaning: '影山' },
        { hiragana: 'つきしま', katakana: 'ツキシマ', meaning: '月島' },
        { hiragana: 'やまぐち', katakana: 'ヤマグチ', meaning: '山口' },
        { hiragana: 'すがわら', katakana: 'スガワラ', meaning: '菅原' },
        { hiragana: 'おいかわ', katakana: 'オイカワ', meaning: '及川' },
        { hiragana: 'さわむら', katakana: 'サワムラ', meaning: '澤村' },
        { hiragana: 'にしのや', katakana: 'ニシノヤ', meaning: '西谷' },
        { hiragana: 'あかあし', katakana: 'アカアシ', meaning: '赤葦' },
        { hiragana: 'もりすけ', katakana: 'モリスケ', meaning: '衛輔' },
        { hiragana: 'しらとり', katakana: 'シラトリ', meaning: '白鳥' }
    ]
};
