const EMPTY = ".";
const WATER = "W";
const SHIP = "S";

let playerBoard = [];

function createPlayerBoard(puzzle) {

    playerBoard = [];

    for (let row = 0; row < puzzle.height; row++) {

        const newRow = [];

        for (let col = 0; col < puzzle.width; col++) {
            newRow.push(EMPTY);
        }

        playerBoard.push(newRow);
    }
}

function getTile(row, col) {

    return playerBoard[row][col];
}

function setTile(row, col, tile) {

    playerBoard[row][col] = tile;
}

function cycleTile(row, col) {

    const currentTile = getTile(row, col);

    if (currentTile === EMPTY) {
        setTile(row, col, WATER);
    }
    else if (currentTile === WATER) {
        setTile(row, col, SHIP);
    }
    else {
        setTile(row, col, EMPTY);
    }
}