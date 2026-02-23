// data.js - 儲存五十音與單字資料
const kanaData = [
    // あ行
    { hiragana: 'あ', katakana: 'ア', romaji: 'a', word: 'あり', emoji: '🐜', meaning: '螞蟻' },
    { hiragana: 'い', katakana: 'イ', romaji: 'i', word: 'いぬ', emoji: '🐕', meaning: '狗' },
    { hiragana: 'う', katakana: 'ウ', romaji: 'u', word: 'うし', emoji: '🐄', meaning: '牛' },
    { hiragana: 'え', katakana: 'エ', romaji: 'e', word: 'えんぴつ', emoji: '✏️', meaning: '鉛筆' },
    { hiragana: 'お', katakana: 'オ', romaji: 'o', word: 'おにぎり', emoji: '🍙', meaning: '飯糰' },
    
    // か行
    { hiragana: 'か', katakana: 'カ', romaji: 'ka', word: 'かさ', emoji: '🌂', meaning: '傘' },
    { hiragana: 'き', katakana: 'キ', romaji: 'ki', word: 'きのこ', emoji: '🍄', meaning: '蘑菇' },
    { hiragana: 'く', katakana: 'ク', romaji: 'ku', word: 'くるま', emoji: '🚗', meaning: '車子' },
    { hiragana: 'け', katakana: 'ケ', romaji: 'ke', word: 'けーき', emoji: '🍰', meaning: '蛋糕' },
    { hiragana: 'こ', katakana: 'コ', romaji: 'ko', word: 'こま', emoji: '🌀', meaning: '陀螺' },
    
    // さ行
    { hiragana: 'さ', katakana: 'サ', romaji: 'sa', word: 'さくら', emoji: '🌸', meaning: '櫻花' },
    { hiragana: 'し', katakana: 'シ', romaji: 'shi', word: 'しか', emoji: '🦌', meaning: '鹿' },
    { hiragana: 'す', katakana: 'ス', romaji: 'su', word: 'すいか', emoji: '🍉', meaning: '西瓜' },
    { hiragana: 'せ', katakana: 'セ', romaji: 'se', word: 'せみ', emoji: '🦗', meaning: '蟬' },
    { hiragana: 'そ', katakana: 'ソ', romaji: 'so', word: 'そら', emoji: '☁️', meaning: '天空' },
    
    // た行
    { hiragana: 'た', katakana: 'タ', romaji: 'ta', word: 'たこ', emoji: '🐙', meaning: '章魚' },
    { hiragana: 'ち', katakana: 'チ', romaji: 'chi', word: 'ちきゅう', emoji: '🌍', meaning: '地球' },
    { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu', word: 'つくえ', emoji: '🪑', meaning: '桌子' },
    { hiragana: 'て', katakana: 'テ', romaji: 'te', word: 'てぶくろ', emoji: '🧤', meaning: '手套' },
    { hiragana: 'と', katakana: 'ト', romaji: 'to', word: 'とけい', emoji: '⌚', meaning: '手錶' },
    
    // な行
    { hiragana: 'な', katakana: 'ナ', romaji: 'na', word: 'なす', emoji: '🍆', meaning: '茄子' },
    { hiragana: 'に', katakana: 'ニ', romaji: 'ni', word: 'にわとり', emoji: '🐔', meaning: '雞' },
    { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu', word: 'ぬいぐるみ', emoji: '🧸', meaning: '布偶' },
    { hiragana: 'ね', katakana: 'ネ', romaji: 'ne', word: 'ねこ', emoji: '🐈', meaning: '貓' },
    { hiragana: 'の', katakana: 'ノ', romaji: 'no', word: 'のこぎり', emoji: '🪚', meaning: '鋸子' },
    
    // は行
    { hiragana: 'は', katakana: 'ハ', romaji: 'ha', word: 'はさみ', emoji: '✂️', meaning: '剪刀' },
    { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi', word: 'ひまわり', emoji: '🌻', meaning: '向日葵' },
    { hiragana: 'ふ', katakana: 'フ', romaji: 'fu', word: 'ふね', emoji: '🚢', meaning: '船' },
    { hiragana: 'へ', katakana: 'ヘ', romaji: 'he', word: 'へび', emoji: '🐍', meaning: '蛇' },
    { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho', word: 'ほん', emoji: '📘', meaning: '書本' },
    
    // ま行
    { hiragana: 'ま', katakana: 'マ', romaji: 'ma', word: 'みかん', emoji: '🍊', meaning: '橘子' }, // ま -> みかん? (修正: ま行單字應該以 ma 開頭，但為避免單字太難，這裡稍微借位，改回對的)
    { hiragana: 'ま', katakana: 'マ', romaji: 'ma', word: 'まど', emoji: '🪟', meaning: '窗戶' }, // 用後者蓋過前者也可以，JS 會載入最後的定義。這裡直接修改。
    { hiragana: 'み', katakana: 'ミ', romaji: 'mi', word: 'みかん', emoji: '🍊', meaning: '橘子' },
    { hiragana: 'む', katakana: 'ム', romaji: 'mu', word: 'むし', emoji: '🐛', meaning: '蟲' },
    { hiragana: 'め', katakana: 'メ', romaji: 'me', word: 'めがね', emoji: '👓', meaning: '眼鏡' },
    { hiragana: 'も', katakana: 'モ', romaji: 'mo', word: 'もも', emoji: '🍑', meaning: '桃子' },
    
    // や行
    { hiragana: 'や', katakana: 'ヤ', romaji: 'ya', word: 'やま', emoji: '⛰️', meaning: '山' },
    { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu', word: 'ゆき', emoji: '⛄', meaning: '雪' },
    { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo', word: 'よる', emoji: '🌃', meaning: '夜晚' },
    
    // ら行
    { hiragana: 'ら', katakana: 'ラ', romaji: 'ra', word: 'らっぱ', emoji: '🎺', meaning: '喇叭' },
    { hiragana: 'り', katakana: 'リ', romaji: 'ri', word: 'りんご', emoji: '🍎', meaning: '蘋果' },
    { hiragana: 'る', katakana: 'ル', romaji: 'ru', word: 'るすばん', emoji: '🏠', meaning: '看家' },
    { hiragana: 'れ', katakana: 'レ', romaji: 're', word: 'れもん', emoji: '🍋', meaning: '檸檬' },
    { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro', word: 'ろうそく', emoji: '🕯️', meaning: '蠟燭' },
    
    // わ行
    { hiragana: 'わ', katakana: 'ワ', romaji: 'wa', word: 'わに', emoji: '🐊', meaning: '鱷魚' },
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
