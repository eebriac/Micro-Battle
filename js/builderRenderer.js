function renderBuilder() {
	const container = document.getElementById("builderBoard");

	container.innerHTML = "";

	const canvas = document.createElement("canvas");

	canvas.id = "builderCanvas";

	canvas.style.touchAction = "none";

	const clueSize = 40;

	const availableWidth = window.innerWidth;

	const cellSize = Math.floor((availableWidth - clueSize) / builderWidth);

	canvas.width = clueSize + builderWidth * cellSize;

	canvas.height = clueSize + builderHeight * cellSize;

	container.appendChild(canvas);

	const ctx = canvas.getContext("2d");

	// Background
	ctx.fillStyle = "#ffffff";

	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Draw tiles using tileRenderer
	for (let row = 0; row < builderHeight; row++) {
		for (let col = 0; col < builderWidth; col++) {
			const x = clueSize + col * cellSize;

			const y = clueSize + row * cellSize;

			drawBuilderTile(ctx, row, col, x, y, cellSize);
		}
	}

	// Draw row and column clues
	drawBuilderClues(ctx, canvas, cellSize, clueSize);

	// Draw validation X overlays

	const invalidCells = getInvalidCells();

	for (const key of invalidCells) {
		const [row, col] = key.split(",").map(Number);

		const x = clueSize + col * cellSize;

		const y = clueSize + row * cellSize;

		drawInvalidX(ctx, x, y, cellSize);
	}

	// Grid goes on top of everything.
	drawBuilderGrid(ctx, canvas, cellSize, clueSize);

	setupBuilderInput();
}

function drawBuilderTile(ctx, row, col, x, y, cellSize) {
	const solutionTile = puzzle.solution[row][col];

	const initialTile = puzzle.initialState[row][col];

	// Solution mode uses normal rendering.
	if (builderMode === "solution") {
		drawTile(ctx, solutionTile, x, y, cellSize, row, col);

		return;
	}

	// Initial-state mode:
	// Always draw the solution underneath.
	ctx.save();

	if (initialTile === EMPTY) {
		ctx.globalAlpha = 0.25;
	}

	drawTile(ctx, solutionTile, x, y, cellSize, row, col);

	ctx.restore();
}

function drawBuilderGrid(ctx, canvas, cellSize, clueSize) {
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;

	// Horizontal lines

	for (let row = 0; row <= builderHeight; row++) {
		const y = clueSize + row * cellSize;

		ctx.beginPath();

		ctx.moveTo(clueSize, y);

		ctx.lineTo(canvas.width, y);

		ctx.stroke();
	}

	// Vertical lines

	for (let col = 0; col <= builderWidth; col++) {
		const x = clueSize + col * cellSize;

		ctx.beginPath();

		ctx.moveTo(x, clueSize);

		ctx.lineTo(x, canvas.height);

		ctx.stroke();
	}
}

function drawBuilderClues(ctx, canvas, cellSize, clueSize) {
	ctx.fillStyle = "#000000";

	ctx.font = `${Math.floor(cellSize * 0.45)}px sans-serif`;

	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	// Row clues
	for (let row = 0; row < builderHeight; row++) {
		const y = clueSize + row * cellSize + cellSize / 2;

		ctx.fillText(puzzle.rowClues[row], clueSize / 2, y);
	}

	// Column clues
	for (let col = 0; col < builderWidth; col++) {
		const x = clueSize + col * cellSize + cellSize / 2;

		ctx.fillText(puzzle.colClues[col], x, clueSize / 2); 
	}
}
