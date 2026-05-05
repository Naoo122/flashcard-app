const words = [
    {
        en: "Resilient",
        ja: "回復力のある、立ち直りが早い",
        incorrectJa: ["抵抗する", "無関心な", "脆弱な"],
        exampleEn: "She is highly resilient and handles stress well.",
        exampleJa: "彼女は非常に回復力があり、ストレスにもうまく対処する。"
    },
    {
        en: "Ubiquitous",
        ja: "偏在する、どこにでもある",
        incorrectJa: ["独特な", "一時的な", "高価な"],
        exampleEn: "Smartphones have become ubiquitous in modern society.",
        exampleJa: "スマートフォンは現代社会においてどこにでもあるものになった。"
    },
    {
        en: "Elucidate",
        ja: "明らかにする、解明する",
        incorrectJa: ["隠蔽する", "複雑にする", "無視する"],
        exampleEn: "Please elucidate the reasons for your decision.",
        exampleJa: "あなたの決断の理由を明らかにしてください。"
    }
];

let currentIndex = 0;
let isAnswered = false;

// DOM Elements
const flashcard = document.getElementById('flashcard');
const enWord = document.getElementById('en-word');
const jaMeaning = document.getElementById('ja-meaning');
const enExample = document.getElementById('en-example');
const jaExample = document.getElementById('ja-example');
const quizOptions = document.getElementById('quiz-options');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const knownBtn = document.getElementById('known-btn');
const learningBtn = document.getElementById('learning-btn');
const pronounceBtnFront = document.getElementById('pronounce-btn-front');
const pronounceExampleBtn = document.getElementById('pronounce-example-btn');

// Settings & API Elements
const openSettingsBtn = document.getElementById('open-settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const settingsModal = document.getElementById('settings-modal');
const apiKeyInput = document.getElementById('api-key-input');
const fetchNytBtn = document.getElementById('fetch-nyt-btn');
const loadingOverlay = document.getElementById('loading-overlay');

// Array Shuffle Utility
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateCard() {
    const currentWord = words[currentIndex];
    isAnswered = false;
    
    // Fade out effect
    flashcard.style.opacity = 0;
    
    setTimeout(() => {
        // Update content
        enWord.textContent = currentWord.en;
        jaMeaning.textContent = currentWord.ja;
        enExample.textContent = currentWord.exampleEn;
        jaExample.textContent = currentWord.exampleJa;
        
        // Generate Quiz Options
        quizOptions.innerHTML = '';
        let options = [currentWord.ja, ...currentWord.incorrectJa];
        options = shuffleArray(options);
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-btn';
            btn.textContent = opt;
            btn.addEventListener('click', (e) => handleAnswer(e, opt === currentWord.ja));
            quizOptions.appendChild(btn);
        });
        
        // Ensure card is showing front
        flashcard.classList.remove('flipped');
        
        // Update progress
        const progressPercentage = ((currentIndex + 1) / words.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${currentIndex + 1} / ${words.length}`;
        
        // Fade in
        flashcard.style.opacity = 1;
    }, 300);
}

function handleAnswer(e, isCorrect) {
    if (isAnswered) return;
    
    const btn = e.target;
    if (isCorrect) {
        btn.classList.add('correct');
        isAnswered = true;
        
        // Mark the other buttons as disabled
        Array.from(quizOptions.children).forEach(b => {
            if (b !== btn) b.style.opacity = '0.5';
        });

        // Flip to back after a short delay
        setTimeout(() => {
            flashcard.classList.add('flipped');
        }, 600);
    } else {
        btn.classList.add('wrong');
        setTimeout(() => {
            btn.classList.remove('wrong');
        }, 400);
    }
}

function nextCard() {
    currentIndex = (currentIndex + 1) % words.length;
    updateCard();
}

function prevCard() {
    currentIndex = (currentIndex - 1 + words.length) % words.length;
    updateCard();
}

// Event Listeners
nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextCard();
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    prevCard();
});

knownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextCard();
});

learningBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextCard();
});

// Pronunciation Functionality
function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9; // Slightly slower for better understanding
        
        // Voice selection (optional, improves quality if a good English voice is available)
        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(voice => voice.lang.startsWith('en-'));
        if (enVoice) {
            utterance.voice = enVoice;
        }
        
        window.speechSynthesis.speak(utterance);
    } else {
        alert("お使いのブラウザは音声合成に対応していません。");
    }
}

// Load voices once to ensure they are available when requested
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}

pronounceBtnFront.addEventListener('click', (e) => {
    e.stopPropagation();
    const currentWord = words[currentIndex].en;
    speakText(currentWord);
});

pronounceExampleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const currentExample = words[currentIndex].exampleEn;
    speakText(currentExample);
});

// Settings Logic
function getApiKey() {
    return localStorage.getItem('gemini_api_key');
}

openSettingsBtn.addEventListener('click', () => {
    apiKeyInput.value = getApiKey() || '';
    settingsModal.classList.remove('hidden');
});

closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
});

saveSettingsBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        localStorage.setItem('gemini_api_key', key);
    } else {
        localStorage.removeItem('gemini_api_key');
    }
    settingsModal.classList.add('hidden');
});

// Gemini API Logic
fetchNytBtn.addEventListener('click', async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
        alert("Gemini APIキーが設定されていません。右上の歯車アイコンから設定してください。");
        settingsModal.classList.remove('hidden');
        return;
    }

    loadingOverlay.classList.remove('hidden');

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `あなたは優秀な英語教師です。今日のニューヨークタイムズ（New York Times）の記事で頻出している、ネイティブ向けの重要英単語を5つピックアップし、4択クイズの形式にしてください。
                        以下のJSON形式で配列のみを返してください。マークダウンや説明は一切含めないでください。
                        [
                          {
                            "en": "英単語",
                            "ja": "正しい日本語の意味",
                            "incorrectJa": ["間違った意味1", "間違った意味2", "間違った意味3"],
                            "exampleEn": "ニュース風の英語例文",
                            "exampleJa": "その例文の自然な日本語訳"
                          }
                        ]`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        
        // Remove markdown formatting if AI included it by mistake
        const cleanJsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const newWords = JSON.parse(cleanJsonStr);

        if (Array.isArray(newWords) && newWords.length > 0) {
            words.length = 0; // clear current
            words.push(...newWords);
            currentIndex = 0;
            updateCard();
            alert("ニューヨークタイムズの最新単語を取得しました！");
        }
    } catch (error) {
        console.error(error);
        alert("単語の取得に失敗しました。APIキーが正しいか、コンソールのエラーを確認してください。");
    } finally {
        loadingOverlay.classList.add('hidden');
    }
});

// Initial load
updateCard();
flashcard.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
