const secretMessage = "bitch".toUpperCase();
const NUMBER_OF_GUESSES = 6;

const secretWord = secretMessage.replaceAll(" ", ""); // the secret message without spaces
const NUMBER_OF_TILES = secretWord.length;
const NUMBER_OF_BALLOONS = 8;
const FLIP_ANNIMATION_DELAY = 400;
const FLIP_ANNIMATION_DURATION = 500; // defined in css as well (must match)
const JUMP_ANNIMATION_DELAY = 100;
const SHAKE_ANNIMATION_DURATION = 500; // defined in css as well (must match)
const BALLOON_ANNITMATION_DURATION = 2000;

setUpNavbar();
setUpGameBoard();
setUpKeyBoard();
var currentRow = 0;
var currentTile = 0;
var gameOver = false;

const characters = new Set(["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]);

document.addEventListener("keydown", function(e) {
    if (!e.metaKey) {
        if (characters.has(e.key.toUpperCase())) {
            handleLetter(e.key);
        } else if (e.key === "Backspace") {
            handleBackspace();
        } else if (e.key === "Enter") {
            handleEnter();
        }
    }
});

// sets up the gameboard with NUMBER_OF_GUESSES rows and NUMBER_OF_TILES + the number of blank tiles tiles
function setUpGameBoard() {
    let gameboard = document.querySelector(".gameboard");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        row.id = "row" + i;
        gameboard.appendChild(row);

        let tileNum = 0;
        for (let j = 0; j < secretMessage.length; j++) {
            let tile = document.createElement("div");
            tile.classList.add("tile");
            if (secretMessage.charAt(j) === " ") {
                tile.classList.add("space");
            } else {
                tile.id = "tile" + tileNum;
                tileNum++;
            }
            row.appendChild(tile);
        }
    }
}

function setUpKeyBoard() {
    let keyboardLayout = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        [" ", "A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"]
    ];

    let backspaceIcon = "<svg xmlns='http://www.w3.org/2000/svg' height='20' viewBox='0 0 24 24' width='20'><path fill='let(--color-tone-1)' d='M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z'></path></svg>"

    let keyboard = document.querySelector(".keyboard");

    for (let i = 0; i < keyboardLayout.length; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        keyboard.appendChild(row);

        for (let j = 0; j < keyboardLayout[i].length; j++) {
            let element = document.createElement("button");
            element.classList.add("key");
            element.id = "key-" + keyboardLayout[i][j];
            element.innerText = keyboardLayout[i][j].toUpperCase();

            element.addEventListener("click", function(evt) {
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    'key': element.id.split("-")[1]
                }));
            });

            if (keyboardLayout[i][j] === "Backspace") {
                element.innerText = "";
                element.innerHTML = backspaceIcon;
            }

            if (keyboardLayout[i][j] === " ") {
                element = document.createElement("div");
                element.classList.add("spacer");
            }

            row.appendChild(element);
        }
    }
}

function setUpNavbar() {
    let navbar = document.querySelector(".navbar");

    let navElements = new Array("left", "center", "right");

    for (let i = 0; i < navElements.length; i++) {
        let element = document.createElement("div");
        element.classList.add("navbar-" + navElements[i]);
        navbar.appendChild(element);
    }

    let center = document.querySelector(".navbar-center");
    let logo = document.createElement("img");
    logo.src = "https://cdn.jsdelivr.net/gh/arjunsingla/armandle-birthday@main/logo.png";
    center.appendChild(logo);

    let right = document.querySelector(".navbar-right");

    let helpIconHTML =
        `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="4 4 24 24" width="24" class="game-icon" data-testid="icon-help">
            <path fill="var(--color-tone-1)" d="M14.8333 23H17.1666V20.6667H14.8333V23ZM15.9999 4.33334C9.55992 4.33334 4.33325 9.56001 4.33325 16C4.33325 22.44 9.55992 27.6667 15.9999 27.6667C22.4399 27.6667 27.6666 22.44 27.6666 16C27.6666 9.56001 22.4399 4.33334 15.9999 4.33334ZM15.9999 25.3333C10.8549 25.3333 6.66659 21.145 6.66659 16C6.66659 10.855 10.8549 6.66668 15.9999 6.66668C21.1449 6.66668 25.3333 10.855 25.3333 16C25.3333 21.145 21.1449 25.3333 15.9999 25.3333ZM15.9999 9.00001C13.4216 9.00001 11.3333 11.0883 11.3333 13.6667H13.6666C13.6666 12.3833 14.7166 11.3333 15.9999 11.3333C17.2833 11.3333 18.3333 12.3833 18.3333 13.6667C18.3333 16 14.8333 15.7083 14.8333 19.5H17.1666C17.1666 16.875 20.6666 16.5833 20.6666 13.6667C20.6666 11.0883 18.5783 9.00001 15.9999 9.00001Z"></path>
        </svg>`;

    let statsIconHTML =
        `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="4 4 24 24" width="24" class="game-icon" data-testid="icon-statistics"><path fill="var(--color-tone-1)" d="M20.6666 14.8333V5.5H11.3333V12.5H4.33325V26.5H27.6666V14.8333H20.6666ZM13.6666 7.83333H18.3333V24.1667H13.6666V7.83333ZM6.66659 14.8333H11.3333V24.1667H6.66659V14.8333ZM25.3333 24.1667H20.6666V17.1667H25.3333V24.1667Z"></path></svg>
                <path fill="var(--color-tone-1)" d="M20.6666 14.8333V5.5H11.3333V12.5H4.33325V26.5H27.6666V14.8333H20.6666ZM13.6666 7.83333H18.3333V24.1667H13.6666V7.83333ZM6.66659 14.8333H11.3333V24.1667H6.66659V14.8333ZM25.3333 24.1667H20.6666V17.1667H25.3333V24.1667Z"></path>
            </svg>`;

    let settingsIconHTML =
        `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="4 4 24 24" width="24" class="game-icon" data-testid="icon-settings">
            <path fill="var(--color-tone-1)" d="M25.52 17.2534C25.5733 16.8534 25.6 16.44 25.6 16C25.6 15.5734 25.5733 15.1467 25.5067 14.7467L28.2133 12.64C28.4533 12.4534 28.52 12.0934 28.3733 11.8267L25.8133 7.40004C25.6533 7.10671 25.32 7.01338 25.0267 7.10671L21.84 8.38671C21.1733 7.88004 20.4667 7.45338 19.68 7.13338L19.2 3.74671C19.1467 3.42671 18.88 3.20004 18.56 3.20004H13.44C13.12 3.20004 12.8666 3.42671 12.8133 3.74671L12.3333 7.13338C11.5467 7.45338 10.8267 7.89338 10.1733 8.38671L6.98665 7.10671C6.69332 7.00004 6.35998 7.10671 6.19998 7.40004L3.65332 11.8267C3.49332 12.1067 3.54665 12.4534 3.81332 12.64L6.51998 14.7467C6.45332 15.1467 6.39998 15.5867 6.39998 16C6.39998 16.4134 6.42665 16.8534 6.49332 17.2534L3.78665 19.36C3.54665 19.5467 3.47998 19.9067 3.62665 20.1734L6.18665 24.6C6.34665 24.8934 6.67998 24.9867 6.97332 24.8934L10.16 23.6134C10.8267 24.12 11.5333 24.5467 12.32 24.8667L12.8 28.2534C12.8667 28.5734 13.12 28.8 13.44 28.8H18.56C18.88 28.8 19.1467 28.5734 19.1867 28.2534L19.6667 24.8667C20.4533 24.5467 21.1733 24.12 21.8267 23.6134L25.0133 24.8934C25.3067 25 25.64 24.8934 25.8 24.6L28.36 20.1734C28.52 19.88 28.4533 19.5467 28.2 19.36L25.52 17.2534ZM16 20.8C13.36 20.8 11.2 18.64 11.2 16C11.2 13.36 13.36 11.2 16 11.2C18.64 11.2 20.8 13.36 20.8 16C20.8 18.64 18.64 20.8 16 20.8Z"></path>
        </svg>`;

    let subscribeButtonHTML = `<button type="button" class="subscribe">Subscribe to Games</button>`;

    right.innerHTML = helpIconHTML + statsIconHTML + settingsIconHTML + subscribeButtonHTML;
}

/* Annimations */

function wrongAnnimation() {
    let currentRowElement = document.querySelector("#row" + currentRow);
    currentRowElement.classList.add("shake");
    setTimeout(function() {
        currentRowElement.classList.remove("shake"); // removing so we can shake again on the next invalid guess
    }, SHAKE_ANNIMATION_DURATION);
}

function guessAnnimation(colors) {
    for (let i = 0; i < colors.length; i++) {
        let tile = getTileElement(currentRow, i);

        setTimeout(function(tile, color) {
            tile.classList.add(color);
        }.bind(this, tile, colors[i]), `${i * FLIP_ANNIMATION_DELAY + FLIP_ANNIMATION_DURATION/2}`);

        tile.classList.add("flip");
        tile.style.animationDelay = `${i * FLIP_ANNIMATION_DELAY}ms`;
    }
}

function correctAnnimation() {
    setTimeout(function() {
        for (let i = 0; i < NUMBER_OF_TILES; i++) {
            let tile = getTileElement(currentRow, i);
            tile.classList.add("jump");
            tile.style.animationDelay = `${i * JUMP_ANNIMATION_DELAY}ms`;
        }
    }, `${NUMBER_OF_TILES * FLIP_ANNIMATION_DELAY}`); // wait after flips are done before jumping!
}

function birthdayExtras() {
    let navbar = document.querySelector(".navbar");

    let balloons = new Array();

    // make balloons
    for (let i = 0; i < NUMBER_OF_BALLOONS; i++) {
        let b = document.createElement("div");
        b.classList.add("balloon");
        balloons.push(b);
    }

    setTimeout(function(correctRow) {

        // add balloons
        for (let i = 0; i < balloons.length; i++) {
            navbar.after(balloons[i]);
        }

        // change remaining tiles to have a lavender border
        for (let i = correctRow + 1; i < NUMBER_OF_GUESSES; i++) {
            for (let j = 0; j < NUMBER_OF_TILES; j++) {
                getTileElement(i, j).classList.add("lavender-border");
            }
        }

        document.querySelector("body").classList.add("lavender"); // make background lavender

        // set navbar text
        navbar.innerHTML = "<h1>BIRTHDAY</h1>";

        // play the song!
        let audio = new Audio('https://cdn.jsdelivr.net/gh/arjunsingla/armandle-birthday@main/birthdaybitch.mp3');
        audio.play();

    }.bind(this, currentRow), `${(NUMBER_OF_TILES * (FLIP_ANNIMATION_DELAY + JUMP_ANNIMATION_DELAY))}`);

    // Delete balloons
    setTimeout(function() {
        for (let i = 0; i < balloons.length; i++) {
            balloons[i].remove();
        }
    }, `${(NUMBER_OF_TILES * (FLIP_ANNIMATION_DELAY + JUMP_ANNIMATION_DELAY)) + BALLOON_ANNITMATION_DURATION}`);
}

function changeKeyboardColors(guessedWord) {
    setTimeout(function() {
        for (let i = 0; i < guessedWord.length; i++) {
            let key = document.querySelector("#key-" + guessedWord.charAt(i));

            if (secretWord.charAt(i) === guessedWord.charAt(i)) {
                key.classList.remove("yellow");
                key.classList.add("green");
            } else if (secretWord.includes(guessedWord.charAt(i)) && !key.classList.contains("green")) {
                key.classList.add("yellow");
            } else if (!secretWord.includes(guessedWord.charAt(i))) {
                key.classList.add("gray");
            }
        }
    }, `${NUMBER_OF_TILES * FLIP_ANNIMATION_DELAY}`); // wait until after flips are done to reveal keyboard colors
}

/* Input handlers */

function handleBackspace() {
    if (!gameOver) {
        currentTile = Math.max(currentTile - 1, 0);
        modify(currentRow, currentTile, "");
    }
}

function handleLetter(letter) {
    if (!gameOver) {
        modify(currentRow, currentTile, letter.toUpperCase());
        currentTile = Math.min(currentTile + 1, NUMBER_OF_TILES);
    }
}

function handleEnter() {
    if (gameOver) {
        return;
    }

    if (currentTile !== NUMBER_OF_TILES) {
        wrongAnnimation();
        return;
    }

    let guessedWords = getGuessedWords();
    let guessedWord = guessedWords.join("");

    if (!allInDictionary(guessedWords)) {
        wrongAnnimation();
        return;
    }

    let colors = getColors(guessedWord);
    guessAnnimation(colors);
    changeKeyboardColors(guessedWord);

    if (guessedWord === secretWord) {
        gameOver = true; // you guessed the word!
        correctAnnimation();
        birthdayExtras();
        return;
    }

    currentRow++;
    currentTile = 0;

    if (currentRow >= NUMBER_OF_GUESSES) {
        gameOver = true; // you lost the game :(
    }
}


/* Utils */

// gets an array of the guessed word(s)
// (can be multiple guessed words if secretMessage is multiple words in length)
function getGuessedWords() {
    let guessedWords = new Array();

    let tileNum = 0;
    let currentGuessedWord = "";

    for (let i = 0; i < secretMessage.length; i++) {
        if (secretMessage.charAt(i) === " ") {
            guessedWords.push(currentGuessedWord);
            currentGuessedWord = "";
        } else {
            currentGuessedWord += getTileElement(currentRow, tileNum).innerText;
            tileNum++;
        }
    }

    guessedWords.push(currentGuessedWord);
    return guessedWords;
}

// gets an array of strings, where each string represents the 
// color of the tile at that index after a guess. Takes in
// the guesedWord (without spaces in the case of a secret message with multiple words)
function getColors(guessedWord) {
    let colors = new Array(NUMBER_OF_TILES);
    let wordMap = createWordMap();

    for (let i = 0; i < NUMBER_OF_TILES; i++) {
        let g = guessedWord.charAt(i);

        if (secretWord.charAt(i) === g) {
            colors[i] = "green";
            wordMap.set(g, wordMap.get(g) - 1);
        }
    }

    for (let i = 0; i < NUMBER_OF_TILES; i++) {
        let g = guessedWord.charAt(i);

        if (secretWord.charAt(i) !== g) {
            if (wordMap.has(g) && wordMap.get(g) > 0) {
                colors[i] = "yellow";
                wordMap.set(g, wordMap.get(g) - 1);
            } else {
                colors[i] = "gray";
            }
        }
    }
    return colors;
}

// creates a map of letter => count for each letter in the secret word
function createWordMap() {
    let wordMap = new Map();

    for (let i = 0; i < NUMBER_OF_TILES; i++) {
        let c = secretWord.charAt(i);
        if (!wordMap.has(c)) {
            wordMap.set(c, 0);
        }
        wordMap.set(c, wordMap.get(c) + 1);
    }
    return wordMap;
}

// modifies the text of the tile at (row, tile) to be the given value
function modify(row, tile, value) {
    let tileElement = getTileElement(row, tile);

    if (tileElement === null) {
        return;
    }

    if (value === "") {
        tileElement.classList.remove("inputted");
    } else {
        tileElement.classList.add("inputted");
    }

    tileElement.innerText = value;
}

// returns the HTML element of the tile at position (row, tile)
function getTileElement(row, tile) {
    if (row >= 0 && row < NUMBER_OF_GUESSES && tile >= 0 && tile < NUMBER_OF_TILES) {
        let rowElement = document.querySelector("#row" + row);
        let tileElement = rowElement.querySelector("#tile" + tile);
        return tileElement;
    }
    return null;
}

// returns true if all words in words are in the dictionary and false otherwise
function allInDictionary(words) {
    for (let i = 0; i < words.length; i++) {
        if (!inDictionary(words[i])) {
            return false;
        }
    }
    return true;
}

// returns true if word is in the dictionary and false otherwise
function inDictionary(word) {
    return dictionary.has(word.toLowerCase());
}