let builderBoard = [];

const builderWidth = 8;
const builderHeight = 10;


function initPuzzleBuilder() {

	builderBoard = Array.from(
		{ length: builderHeight },
		() => Array(builderWidth).fill(EMPTY)
	);

	renderBuilder();

	setupBuilderInput();
}

function setupBuilderControls() {

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

	const current =
		builderBoard[row][col];


	if (current === EMPTY) {

		builderBoard[row][col] = "S";

	}
	else if (current === "S") {

		builderBoard[row][col] = WATER;

	}
	else {

		builderBoard[row][col] = EMPTY;
	}


	renderBuilder();
}