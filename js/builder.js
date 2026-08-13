let builderBoard = [];
let solutionBoard = [];
let initialStateBoard = [];

let builderMode = "solution";

function getBuilderBoard() {
    return builderMode === "solution"
        ? solutionBoard
        : initialStateBoard;
}

const builderWidth = 8;
const builderHeight = 10;

const modeButton = document.getElementById("builderModeButton");

if (modeButton) {
    modeButton.textContent =
        builderMode === "solution"
            ? "Solution"
            : "Initial State";
}

function toggleBuilderMode() {

    if (builderMode === "solution") {
        builderMode = "initial";
        builderBoard = initialStateBoard;
    }
    else {
        builderMode = "solution";
        builderBoard = solutionBoard;
    }

    renderBuilder();
}


function initPuzzleBuilder() {

    solutionBoard = Array.from(
        { length: builderHeight },
        () => Array(builderWidth).fill(WATER)
    );

    initialStateBoard = Array.from(
        { length: builderHeight },
        () => Array(builderWidth).fill(EMPTY)
    );

    builderMode = "solution";
    
    builderBoard = solutionBoard;

    renderBuilder();
}

function setupBuilderControls() {
    document
        .getElementById("builderModeButton")
        .onclick = toggleBuilderMode;

    document
        .getElementById("builderBackButton")
        .onclick = showTitleScreen;

    document
        .getElementById("builderClearButton")
        .onclick = clearBuilder;
}

function clearBuilder() {

    builderBoard = Array.from(
        { length: builderHeight },
        () => Array(builderWidth).fill(EMPTY)
    );

    renderBuilder();
}


function setupBuilderInput() {

	const canvas =
		document.getElementById("builderCanvas");

	canvas.addEventListener(
		"pointerdown",
		function (event) {

			const rect =
				canvas.getBoundingClientRect();

			const clueSize = 40;

			const cellSize =
				(canvas.width - clueSize) /
				builderWidth;

			const x =
				event.clientX -
				rect.left -
				clueSize;

			const y =
				event.clientY -
				rect.top -
				clueSize;

			const col =
				Math.floor(x / cellSize);

			const row =
				Math.floor(y / cellSize);


			// Ignore taps outside grid.

			if (
				row < 0 ||
				row >= builderHeight ||
				col < 0 ||
				col >= builderWidth
			) {
				return;
			}


			cycleBuilderTile(row, col);
		}
	);
}


function cycleBuilderTile(row, col) {

    const board = getBuilderBoard();

    const current = board[row][col];

    if (current === EMPTY) {
        board[row][col] = WATER;
    }
    if (current === SHIP) {
        if (builderMode === "solution"){
            board[row][col] = WATER;
        } else {
            board[row][col] = EMPTY;
        }
    }
    else {
        board[row][col] = SHIP;
    }

    renderBuilder();
}