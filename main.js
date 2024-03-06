const secretMessage = "bitch".toUpperCase();
const NUMBER_OF_GUESSES = 6;

const secretWord = secretMessage.replaceAll(" ", ""); // the secret message without spaces
const NUMBER_OF_TILES = secretWord.length;
const FLIP_ANNIMATION_DELAY = 400;
const FLIP_ANNIMATION_DURATION = 500; // defined in css as well (must match)
const JUMP_ANNIMATION_DELAY = 100;
const SHAKE_ANNIMATION_DURATION = 500; // defined in css as well (must match)

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

function balloons() {
    let balloons = new Array();

    for (let i = 0; i < 8; i++) {
        let b = document.createElement("div");
        b.classList.add("balloon");
        balloons.push(b);
    }
    let title = document.querySelector(".title");

    setTimeout(function(correctRow) {
        for (let i = 0; i < balloons.length; i++) {
            title.after(balloons[i]);
        }
        title.innerHTML = "<h1>BIRTHDAY</h1>";

        for (let i = correctRow + 1; i < NUMBER_OF_GUESSES; i++) {
            for (let j = 0; j < NUMBER_OF_TILES; j++) {
                getTileElement(i, j).classList.add("lavender-border");
            }
        }

        document.querySelector("body").classList.add("lavender");
    }.bind(this, currentRow), `${(NUMBER_OF_TILES * (FLIP_ANNIMATION_DELAY + JUMP_ANNIMATION_DELAY))}`);

     setTimeout(function() {
        for (let i = 0; i < balloons.length; i++) {
            balloons[i].remove();
        }
    }, `${(NUMBER_OF_TILES * (FLIP_ANNIMATION_DELAY + JUMP_ANNIMATION_DELAY)) + 2000}`);

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
        balloons();
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