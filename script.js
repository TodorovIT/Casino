const fruits = ['🍒', '🍋', '🍌', '🍉', '🍇', '🍊']; // Списък с валидни плодове
const spinButton = document.getElementById('spinButton');
const resultMessage = document.getElementById('resultMessage');
let currentBet = 1; // Начален залог

// Шансове за печалба
const winChances = {
    '🍒': 20, // Череши: 20% шанс
    '🍋': 15, // Лимони: 15% шанс
    '🍌': 10, // Банани: 10% шанс
    '🍉': 8,  // Дини: 8% шанс
    '🍇': 5,  // Грозде: 5% шанс
    '🍊': 2,  // Портокали: 2% шанс
};

// Функция, която връща случайни плодове на базата на шансовете
function getRandomFruit() {
    const rand = Math.random() * 100; // Генерираме случайно число от 0 до 100
    let cumulativeChance = 0;

    for (const fruit in winChances) {
        cumulativeChance += winChances[fruit];
        if (rand <= cumulativeChance) {
            return fruit; // Връщаме плода, който съвпада с генерираното случайно число
        }
    }
    return fruits[0]; // Връщаме първия плод по подразбиране, ако нещо се обърка
}

// Функция за инициализация на барабаните с плодове
function initializeReels() {
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');

    // Започваме с плодовете (показваме череши по подразбиране)
    for (let i = 0; i < 3; i++) {
        reel1.innerHTML += `<div>🍒</div>`;
        reel2.innerHTML += `<div>🍒</div>`;
        reel3.innerHTML += `<div>🍒</div>`;
    }
}

// Функция за генериране на падащи пари
function generateMoneyRain() {
    const moneySymbols = ['💵', '💰', '💴'];
    const moneyContainer = document.createElement('div');
    moneyContainer.className = 'money';
    document.body.appendChild(moneyContainer);

    // Създаване на 10 падащи парични символа
    for (let i = 0; i < 10; i++) {
        const money = document.createElement('span');
        money.textContent = moneySymbols[Math.floor(Math.random() * moneySymbols.length)];
        money.style.position = 'absolute';
        money.style.left = Math.random() * 100 + 'vw'; // Случайна позиция по ширина
        money.style.animation = `money-fall 3s linear forwards`;
        money.style.fontSize = '30px'; // Размер на парите
        moneyContainer.appendChild(money);
        
        // Изчистване на падащите пари след анимацията
        setTimeout(() => {
            money.remove();
        }, 3000);
    }
}

// Функция за завъртане на барабаните
function spinReels() {
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');

    // Изчистване на предишните плодове
    reel1.innerHTML = '';
    reel2.innerHTML = '';
    reel3.innerHTML = '';

    // Показваме нови плодове с забавяне
    setTimeout(() => {
        let fruitsToShow = [];

        // Добавяме нови плодове с интервал от 1 секунда
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const fruit = getRandomFruit();
                fruitsToShow.push(fruit);
                if (i === 0) {
                    reel1.innerHTML += `<div>${fruit}</div>`;
                } else if (i === 1) {
                    reel2.innerHTML += `<div>${fruit}</div>`;
                } else {
                    reel3.innerHTML += `<div>${fruit}</div>`;
                }

                // След третия плод проверяваме за печалба
                if (i === 2) {
                    setTimeout(() => {
                        checkResult(fruitsToShow);
                    }, 1000); // Изчакване след последния плод
                }
            }, i * 1000); // Всеки плод се показва на интервал от 1 секунда
        }
    }, 1000); // Първоначално изчакване от 1 секунда преди показване на плодовете
}

// Проверка за резултат
function checkResult(fruits) {
    const [fruit1, fruit2, fruit3] = fruits;

    // Определяме печалбата в зависимост от плодовете
    let payoutMultiplier;
    switch (fruit1) {
        case '🍒': payoutMultiplier = 2; break;   // 2x залога
        case '🍋': payoutMultiplier = 2.5; break; // 2.5x залога
        case '🍌': payoutMultiplier = 3; break;   // 3x залога
        case '🍉': payoutMultiplier = 5; break;   // 5x залога
        case '🍇': payoutMultiplier = 10; break;  // 10x залога
        case '🍊': payoutMultiplier = 100; break; // 100x залога
        default: payoutMultiplier = 0; break;     // Няма печалба
    }

    const payout = currentBet * payoutMultiplier; // Размер на печалбата
    if (fruit1 === fruit2 && fruit2 === fruit3 && payout > 0) {
        resultMessage.textContent = `Поздравления! Вие спечелихте ${payout}лв. (т.е. ${payoutMultiplier}x вашия залог от ${currentBet})!`;
        generateMoneyRain(); // Генериране на падащи пари
    } else {
        resultMessage.textContent = 'Опитайте отново!';
    }
}

// Добавяме слушатели за бутоните за залог
const betButtons = document.querySelectorAll('.betButton');
betButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentBet = parseInt(button.dataset.bet); // Обновяване на текущия залог
        resultMessage.textContent = `Текущ залог: ${currentBet}лв.`; // Показваме текущия залог
    });
});

// Добавяме слушител за бутона за завъртане
spinButton.addEventListener('click', () => {
    spinReels();
    
    // Изчакване от 5 секунди преди следващото завъртане
    spinButton.disabled = true; // Деактивиране на бутона
    setTimeout(() => {
        spinButton.disabled = false; // Активиране на бутона след 5 секунди
    }, 5000); // 5000 ms = 5 секунди
});

// Инициализация на плодовете при зареждане на страницата
initializeReels();
