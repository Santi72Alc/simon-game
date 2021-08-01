let order = []; // Combinación de los colores generados
let playerOrder = []; // Orden de pulsación de los colores seleccionados por el usuario
let flash;
let turn; // Turno del juego
let good; // Pulsación valida o no. (true/false)
let compTurn;
let intervalId;
let strict = false; // Modo de juego. (true -> Si error nuevo juego / false -> Se repite el turno )
let noise = true;
let on = false;
let win; // Se ha ganado el juego

const MAX_COUNT = 5; // Número de combinaciones para ganar

const turnCounter = document.querySelector('#turn');
const topLeft = document.querySelector('#topleft');
const topRight = document.querySelector('#topright');
const bottomLeft = document.querySelector('#bottomleft');
const bottomRight = document.querySelector('#bottomright');
const onButton = document.querySelector('#on');
onButton.checked = false;
const strictButton = document.querySelector('#strict');
strictButton.checked = false;
strictButton.setAttribute('disabled', true);
const startButton = document.querySelector('#start');
startButton.setAttribute('disabled', true);

// strictButton action
strictButton.addEventListener('click', (e) => {
    // if (on) {
        if (strictButton.checked) {
            strict = true;
        } else {
            strict = false;
        }
        console.log(`Game mode: ${strict ? 'STRICT' : 'NORMAL'}`);
    // }
});

// onButton action
onButton.addEventListener('click', (e) => {
    if (onButton.checked) {
        on = true;
        turnCounter.innerHTML = 'Hi!';
        flashAllColors();
        startButton.removeAttribute('disabled');
        strictButton.removeAttribute('disabled');
        setTimeout(() => {
            turnCounter.innerHTML = '-';
            clearAllColors();
        }, 1000);
    } else {
        on = false;
        turnCounter.innerHTML = 'Bye!';
        startButton.setAttribute('disabled', true);
        strictButton.setAttribute('disabled', true);
        setTimeout(() => {
            turnCounter.innerHTML = '';
            clearAllColors();
        }, 1500);
    }
    console.log(`Power state: ${on ? 'On' : 'Off'}`);
    clearInterval(intervalId);
});

// startButton action
startButton.addEventListener('click', (e) => {
    if (on || win) {
        play();
    }
});

function play() {
    win = false;
    order = [];
    playerOrder = [];
    flash = 0;
    intervalId = 0;
    turn = 1;
    turnCounter.innerHTML = 1;
    good = true;
    // fill the game colors array
    for (let i = 0; i < MAX_COUNT; i++) {
        order.push(Math.floor(Math.random() * 4) + 1);
    }
    compTurn = true;
    console.log('Jugada', order);

    intervalId = setInterval(gameTurn, 800);
}

// check the flashes
function gameTurn() {
    on = false;
    if (flash === turn) {
        clearInterval(intervalId);
        compTurn = false;
        clearAllColors();
        on = true;
    }

    if (compTurn) {
        clearAllColors();
        setTimeout(() => {
            if (order[flash] === 1) flashOne();
            if (order[flash] === 2) flashTwo();
            if (order[flash] === 3) flashThree();
            if (order[flash] === 4) flashFour();
            flash++;
        }, 300);
    }
}

function flashOne() {
    if (noise) {
        let audio = document.getElementById('clip1');
        audio.play();
    }
    noise = true;
    topLeft.style.backgroundColor = 'lightgreen';
}

function flashTwo() {
    if (noise) {
        let audio = document.getElementById('clip2');
        audio.play();
    }
    noise = true;
    topRight.style.backgroundColor = 'tomato';
}

function flashThree() {
    if (noise) {
        let audio = document.getElementById('clip3');
        audio.play();
    }
    noise = true;
    bottomLeft.style.backgroundColor = 'yellow';
}

function flashFour() {
    if (noise) {
        let audio = document.getElementById('clip4');
        audio.play();
    }
    noise = true;
    bottomRight.style.backgroundColor = 'lightskyblue';
}

// clearAllColors... set all flashes Off
function clearAllColors() {
    topLeft.style.backgroundColor = 'darkgreen';
    topRight.style.backgroundColor = 'darkred';
    bottomLeft.style.backgroundColor = 'goldenrod';
    bottomRight.style.backgroundColor = 'darkblue';
}

// flashAllColors... set all flashes On
function flashAllColors() {
    topLeft.style.backgroundColor = 'lightgreen';
    topRight.style.backgroundColor = 'tomato';
    bottomLeft.style.backgroundColor = 'yellow';
    bottomRight.style.backgroundColor = 'lightskyblue';
}

// COLORS click control
topLeft.addEventListener('click', (e) => {
    if (on) {
        playerOrder.push(1);
        checkPushed();
        flashOne();
        if (!win) {
            setTimeout(() => {
                clearAllColors();
            }, 300);
        }
    }
});

topRight.addEventListener('click', (e) => {
    if (on) {
        playerOrder.push(2);
        checkPushed();
        flashTwo();
        if (!win) {
            setTimeout(() => {
                clearAllColors();
            }, 300);
        }
    }
});

bottomLeft.addEventListener('click', (e) => {
    if (on) {
        playerOrder.push(3);
        checkPushed();
        flashThree();
        if (!win) {
            setTimeout(() => {
                clearAllColors();
            }, 300);
        }
    }
});

bottomRight.addEventListener('click', (e) => {
    if (on) {
        playerOrder.push(4);
        checkPushed();
        flashFour();
        if (!win) {
            setTimeout(() => {
                clearAllColors();
            }, 300);
        }
    }
});

function checkPushed() {
    console.log('*** Turno: ', turn);
    console.log('Expected: ', order[playerOrder.length - 1]);
    console.log('Pressed : ', playerOrder[playerOrder.length - 1]);
    // Check the correct order
    good = true;
    if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1]) {
        good = false;
    }

    // Win the game... all colors in order
    if (playerOrder.length === order.length && good) winGame();

    // Error playing
    if (!good) {
        flashAllColors();
        turnCounter.innerHTML = 'NO!';
        setTimeout(() => {
            // if strict mode.... reset the counter & generate a new combination
            if (strict) {
                console.log('Error in STRICT MODE, generate a new combination');
                play();
            } else {
                console.log(`Error selecting color, start the turn ${turn} again!`);
                turnCounter.innerHTML = turn;
                clearAllColors();
                compTurn = true;
                playerOrder = [];
                flash = 0;
                clearInterval(intervalId);
                intervalId = setInterval(gameTurn, 800);
            }
        }, 800);
        // noise = false;
    }

    // Good pressed
    if (turn === playerOrder.length && good && !win) {
        turn++;
        playerOrder = [];
        compTurn = true;
        flash = 0;
        turnCounter.innerHTML = turn;
        clearInterval(intervalId);
        intervalId = setInterval(gameTurn, 800);
    }
}

/// WIN the game!!!
function winGame() {
    flashAllColors();
    setTimeout(() => {
        clearAllColors();
    }, 1500);

    turnCounter.innerHTML = 'WIN!';
    on = false;
    win = true;
}
