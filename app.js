const words = [
    {
        en: "Resilient",
        ja: "回復力のある、立ち直りが早い",
        exampleEn: "She is highly resilient and handles stress well.",
        exampleJa: "彼女は非常に回復力があり、ストレスにもうまく対処する。"
    },
    {
        en: "Ubiquitous",
        ja: "偏在する、どこにでもある",
        exampleEn: "Smartphones have become ubiquitous in modern society.",
        exampleJa: "スマートフォンは現代社会においてどこにでもあるものになった。"
    },
    {
        en: "Elucidate",
        ja: "明らかにする、解明する",
        exampleEn: "Please elucidate the reasons for your decision.",
        exampleJa: "あなたの決断の理由を明らかにしてください。"
    },
    {
        en: "Ephemeral",
        ja: "つかの間の、はかない",
        exampleEn: "Fame in the world of rock and pop is largely ephemeral.",
        exampleJa: "ロックやポップの世界での名声は、大抵はかないものだ。"
    },
    {
        en: "Pragmatic",
        ja: "実用的な、現実的な",
        exampleEn: "We need to take a more pragmatic approach to this problem.",
        exampleJa: "この問題に対して、より現実的なアプローチを取る必要がある。"
    }
];

let currentIndex = 0;

// DOM Elements
const flashcard = document.getElementById('flashcard');
const enWord = document.getElementById('en-word');
const jaMeaning = document.getElementById('ja-meaning');
const enExample = document.getElementById('en-example');
const jaExample = document.getElementById('ja-example');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const knownBtn = document.getElementById('known-btn');
const learningBtn = document.getElementById('learning-btn');

function updateCard() {
    const currentWord = words[currentIndex];
    
    // Fade out effect
    flashcard.style.opacity = 0;
    
    setTimeout(() => {
        // Update content
        enWord.textContent = currentWord.en;
        jaMeaning.textContent = currentWord.ja;
        enExample.textContent = currentWord.exampleEn;
        jaExample.textContent = currentWord.exampleJa;
        
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

function nextCard() {
    currentIndex = (currentIndex + 1) % words.length;
    updateCard();
}

function prevCard() {
    currentIndex = (currentIndex - 1 + words.length) % words.length;
    updateCard();
}

// Event Listeners
flashcard.addEventListener('click', () => {
    flashcard.classList.toggle('flipped');
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextCard();
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    prevCard();
});

// Both Known and Learning currently just go to the next card, 
// but in a real app, they would affect spaced repetition logic.
knownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Optional: Add some celebration animation here
    nextCard();
});

learningBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextCard();
});

// Initial load
updateCard();
flashcard.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
