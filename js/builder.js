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
	updateBuilderInventory();

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

	if (builderMode === "initial") {

		// Toggle whether this solution cell is revealed.
		if (puzzle.initialState[row][col] === EMPTY) {

			puzzle.initialState[row][col] =
				puzzle.solution[row][col];

		} else {

			puzzle.initialState[row][col] = EMPTY;
		}

		activeBoard = puzzle.initialState;

		recognizeShips();

		renderBuilder();

		return;
	}

	// Solution mode
	const current = board[row][col];

	if (current === WATER) {
		board[row][col] = SHIP;
	} else {
		board[row][col] = WATER;
	}

	activeBoard = board;

	recognizeShips();
	updateBuilderClues();
	updateBuilderInventory();

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

function updateBuilderInventory() {

	puzzle.inventory = [];
	const result = detectMicroBattleShips();	

	for (const entity in result.counts) {

		const count = result.counts[entity];

		if (count > 0) {
			puzzle.inventory.push({
				entity: entity,
				count: count
			});
		}
	}
}
