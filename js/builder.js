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

function toggleBuilderMode() {

    if (builderMode === "solution") {
        builderMode = "initial";
    }
    else {
        builderMode = "solution";
    }

    const button =
        document.getElementById("builderModeButton");

    if (button) {
        button.textContent =
            builderMode === "solution"
                ? "Solution"
                : "Initial State";
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
    activeBoard = getBuilderBoard(); 

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

    const board = getBuilderBoard();

    const clearValue =
        builderMode === "solution"
            ? WATER
            : EMPTY;

    for (let row = 0; row < builderHeight; row++) {
        for (let col = 0; col < builderWidth; col++) {
            board[row][col] = clearValue;
        }
    }

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

    renderBuilder();
}