let currentPuzzleIndex = 0;
let gameWon = false;
let inventorySatisfied = false;

function setupGameControls() {
	document.getElementById("resetButton").onclick = handleReset;

	document.getElementById("undoButton").onclick = handleUndo;

	document.getElementById("redoButton").onclick = handleRedo;
}

function handleReset() {
	if (!confirm("Are you sure you want to reset this puzzle?")) {
		return;
	}

	resetPlayerBoard();

	updateGame();
}

function handleUndo() {
	if (undoMove()) {
		updateGame();
	}
}

function handleRedo() {
	if (redoMove()) {
		updateGame();
	}
}

async function nextPuzzle() {
	currentPuzzleIndex++;

	if (currentPuzzleIndex >= puzzleIndex.length) {
		currentPuzzleIndex = 0;
	}

	await loadPuzzle(currentPuzzleIndex);

	showGameScreen();
}

function updateGame() {
	if (!gameWon && isPuzzleSolved()) {
		completePuzzle();
	}

	renderBoard();

	updateHistoryButtons();

	if (gameWon) {
		showWinScreen();
	}
}

function updateHistoryButtons() {
	const undoButton = document.getElementById("undoButton");
	const redoButton = document.getElementById("redoButton");

	if (!undoButton || !redoButton) {
		return;
	}

	undoButton.disabled = gameWon || !canUndo();
	redoButton.disabled = gameWon || !canRedo();
}

function isPuzzleSolved() {

	for (let row = 0; row < puzzle.height; row++) {
		for (let col = 0; col < puzzle.width; col++) {

			const solutionTile = puzzle.solution[row][col];
			const playerTile = getTile(row, col);

			const solutionOccupied =
				solutionTile !== EMPTY;

			const playerOccupied =
				playerTile !== EMPTY &&
				playerTile !== WATER;

			if (solutionOccupied !== playerOccupied) {
				return false;
			}
		}
	}

	return true;
}
