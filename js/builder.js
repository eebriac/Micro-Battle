let builderMode = "solution";
const builderWidth = 8;
const builderHeight = 10;

function getBuilderBoard() {
	return builderMode === "solution" ? puzzle.solution : puzzle.initialState;
}

function toggleBuilderMode() {
	if (builderMode === "solution") {
		builderMode = "initial";
	} else {
		builderMode = "solution";
	}

	activeBoard = getBuilderBoard();
	recognizeShips();

	const button = document.getElementById("builderModeButton");

	if (button) {
		button.textContent =
			builderMode === "solution" ? "Solution" : "Initial State";
	}

	renderBuilder();
}

function initPuzzleBuilder() {
	puzzle = createEmptyPuzzle(builderWidth, builderHeight);

	builderMode = "solution";
	activeBoard = getBuilderBoard();

	updateBuilderClues();

	renderBuilder();
}

function setupBuilderControls() {
	document.getElementById("builderModeButton").onclick = toggleBuilderMode;

	document.getElementById("builderBackButton").onclick = showTitleScreen;

	document.getElementById("builderClearButton").onclick = clearBuilder;
}

function clearBuilder() {
	const board = getBuilderBoard();

	const clearValue = builderMode === "solution" ? WATER : EMPTY;

	for (let row = 0; row < builderHeight; row++) {
		for (let col = 0; col < builderWidth; col++) {
			board[row][col] = clearValue;
		}
	}

	activeBoard = board;
	recognizeShips();
	updateBuilderClues();

	renderBuilder();
}

function setupBuilderInput() {
	const canvas = document.getElementById("builderCanvas");

	canvas.addEventListener("pointerdown", function (event) {
		const rect = canvas.getBoundingClientRect();

		const clueSize = 40;

		const cellSize = (canvas.width - clueSize) / builderWidth;

		const x = event.clientX - rect.left - clueSize;

		const y = event.clientY - rect.top - clueSize;

		const col = Math.floor(x / cellSize);

		const row = Math.floor(y / cellSize);

		// Ignore taps outside grid.

		if (row < 0 || row >= builderHeight || col < 0 || col >= builderWidth) {
			return;
		}

		cycleBuilderTile(row, col);
	});
}

function cycleBuilderTile(row, col) {
	const board = getBuilderBoard();

	const current = board[row][col];

	if (builderMode === "solution") {
		if (current === WATER) {
			board[row][col] = SHIP;
		} else {
			board[row][col] = WATER;
		}
	} else {
		if (current === EMPTY) {
			board[row][col] = WATER;
		} else if (current === SHIP) {
			board[row][col] = EMPTY;
		} else {
			board[row][col] = SHIP;
		}
	}

	activeBoard = board;
	recognizeShips();
	updateBuilderClues();

	renderBuilder();
}

let builderRowClues = [];
let builderColClues = [];

function updateBuilderClues() {
	// Clues always come from the solution board.
	builderRowClues = [];

	for (let row = 0; row < builderHeight; row++) {
		let count = 0;

		for (let col = 0; col < builderWidth; col++) {
			if (puzzle.solution[row][col] === SHIP) {
				count++;
			}
		}

		builderRowClues.push(count);
	}

	builderColClues = [];

	for (let col = 0; col < builderWidth; col++) {
		let count = 0;

		for (let row = 0; row < builderHeight; row++) {
			if (puzzle.solution[row][col] === SHIP) {
				count++;
			}
		}

		builderColClues.push(count);
	}
}
