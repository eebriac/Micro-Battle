const EMPTY = ".";
const WATER = "W";
const SHIP = "S";

let playerBoard = [];
let undoStack = [];
let redoStack = [];

function createPlayerBoard(puzzle) {

    playerBoard = [];

    for (let row = 0; row < puzzle.height; row++) {

        const initialRow = puzzle.initialState[row];

        const newRow = [];

        for (let col = 0; col < puzzle.width; col++) {

            newRow.push(
                initialRow[col] ?? EMPTY
            );
        }

        playerBoard.push(newRow);
    }

    undoStack = [];
    redoStack = [];

    gameWon = false;

    createInventory(puzzle);
    updateInventory(puzzle);
}

function isInitialTile(puzzle, row, col) {
	return puzzle.initialState[row][col] !== EMPTY;
}

function getTile(row, col) {
	if (!playerBoard[row]) {
		return EMPTY;
	}

	return playerBoard[row][col] ?? EMPTY;
}

function setTile(row, col, tile) {
	playerBoard[row][col] = tile;
}

function makeMove(row, col) {
	undoStack.push(copyBoard(playerBoard));

	redoStack = [];

	cycleTile(row, col);

	updateInventory(puzzle);
}

function cycleTile(row, col) {
	const currentTile = getTile(row, col);

	if (currentTile === EMPTY) {
		setTile(row, col, WATER);
	} else if (currentTile === WATER) {
		setTile(row, col, SHIP);
	} else {
		setTile(row, col, EMPTY);
	}
}

function canUndo() {
	return undoStack.length > 0;
}

function canRedo() {
	return redoStack.length > 0;
}

function undoMove() {
	if (undoStack.length === 0) {
		return false;
	}

	redoStack.push(copyBoard(playerBoard));

	playerBoard = undoStack.pop();

	updateInventory(puzzle);

	return true;
}

function redoMove() {
	if (redoStack.length === 0) {
		return false;
	}

	undoStack.push(copyBoard(playerBoard));

	playerBoard = redoStack.pop();

	updateInventory(puzzle);

	return true;
}

function copyBoard(board) {
	return board.map((row) => [...row]);
}

function resetPlayerBoard(puzzle) {
	createPlayerBoard(puzzle);
}

function completePuzzle(puzzle) {
	for (let row = 0; row < puzzle.height; row++) {
		for (let col = 0; col < puzzle.width; col++) {
			if (playerBoard[row][col] === EMPTY) {
				playerBoard[row][col] = WATER;
			}
		}
	}
    updateInventory(puzzle);

	gameWon = true;
}
