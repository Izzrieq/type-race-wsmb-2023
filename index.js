const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const restartElement = document.getElementById('restartBtn');
const wpmElement = document.getElementById('wpm');

quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    let correct = true;
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
        }
    });

    if (correct && arrayValue.length === arrayQuote.length) {
        displayWinner();
    }
});

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content);
}

async function renderNewQuote() {
    const quote = await getRandomQuote();
    console.log(quote);
    quoteDisplayElement.innerHTML = '';
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    quoteInputElement.value = null;
    startTimer();
}

let startTime;
let timerInterval;

function startTimer() {
    timerElement.innerText = 0;
    startTime = new Date();
    timerInterval = setInterval(() => {
        timerElement.innerText = getTimerTime();
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

function displayWinner() {
    clearInterval(timerInterval);
    const timeTakenSeconds = getTimerTime();
    const timeTakenMinutes = timeTakenSeconds / 60;
    const numberOfWords = countWords(quoteDisplayElement.innerText);
    const wpm = Math.floor(numberOfWords / timeTakenMinutes);
    wpmElement.innerText = `Your typing speed is ${wpm} WPM.`;
}

function countWords(str) {
    return str.split(' ').filter(word => word.length > 0).length;
}

restartElement.addEventListener('click', restartGame);

function restartGame() {
    clearInterval(timerInterval);
    quoteInputElement.value = '';
    quoteDisplayElement.innerHTML = '';
    wpmElement.innerText = ''; // Clear WPM display
    renderNewQuote();
}

renderNewQuote();
