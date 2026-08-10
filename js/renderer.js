function renderBoard(puzzle) {
	const inventoryRowHeight = 45;
	const inventoryPadding = 10;
	const inventoryColumns = 2;
	const clueSize = 40;

	const inventoryRows = Math.ceil(puzzle.inventory.length / inventoryColumns);

	const inventoryHeight =
		inventoryPadding * 2 + inventoryRows * inventoryRowHeight;

	const availableWidth = window.innerWidth;

	const cellSize = Math.floor((availableWidth - clueSize) / puzzle.width);

	//canvas setup
	const board = document.getElementById("board");

	board.innerHTML = "";

	const canvas = document.createElement("canvas");

	canvas.id = "gameCanvas";
	canvas.style.touchAction = "none";
	canvas.height = inventoryHeight + clueSize + puzzle.height * cellSize;
	canvas.width = clueSize + puzzle.width * cellSize;

	board.appendChild(canvas);

	const ctx = canvas.getContext("2d");

	// clear canvas
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//draw inventory
	drawInventory(ctx, puzzle, inventoryHeight);

	//draw board grid
	const boardTop = inventoryHeight;
	const boardBottom = boardTop + clueSize + puzzle.height * cellSize;

	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;

	for (let row = 0; row <= puzzle.height; row++) {
		const y = boardTop + clueSize + row * cellSize;

		ctx.beginPath();
		ctx.moveTo(clueSize, y);
		ctx.lineTo(canvas.width, y);
		ctx.stroke();
	}

	for (let col = 0; col <= puzzle.width; col++) {
		const x = clueSize + col * cellSize;

		ctx.beginPath();
		ctx.moveTo(x, boardTop + clueSize);
		ctx.lineTo(x, boardBottom);
		ctx.stroke();
	}

	// Draw player tiles
	for (let row = 0; row < puzzle.height; row++) {
		for (let col = 0; col < puzzle.width; col++) {
			const tile = getTile(row, col);

			const x = clueSize + col * cellSize;
			const y = boardTop + clueSize + row * cellSize;

			drawTile(ctx, tile, x, y, cellSize, row, col);
		}
	}

	//draw Clues
	ctx.fillStyle = "#000000";
	ctx.font = `${Math.floor(cellSize * 0.45)}px sans-serif`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	// Row clues
	for (let row = 0; row < puzzle.height; row++) {
		const y = boardTop + clueSize + row * cellSize + cellSize / 2;

		ctx.fillText(puzzle.rowClues[row], clueSize / 2, y);
	}

	// Column clues
	for (let col = 0; col < puzzle.width; col++) {
		const x = clueSize + col * cellSize + cellSize / 2;

		const y = boardTop + clueSize / 2;

		ctx.fillText(puzzle.colClues[col], x, y);
	}

	setupInput(canvas, puzzle, inventoryHeight);
}

function drawInventory(ctx, puzzle, inventoryHeight) {
	const columnWidth = ctx.canvas.width / 2;

	for (let i = 0; i < puzzle.inventory.length; i++) {
		const item = puzzle.inventory[i];

		const column = i % 2;
		const row = Math.floor(i / 2);

		const x = column * columnWidth;

		const y = 10 + row * 45;

		drawInventoryItem(ctx, puzzle, item, x, y, columnWidth, i);
	}
}

function drawInventoryItem(ctx, puzzle, item, x, y, width, index) {
	const state = inventoryState[index];

	const definition = item.definition;

	ctx.font = "20px sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#000000";

	ctx.fillText(definition.symbol, x + 10, y + 20);

	for (let i = 0; i < item.count; i++) {
		const checked = i < state.completed;

		const checkX = x + 45 + i * 28;

		drawInventoryCheck(ctx, checkX, y + 20, checked);
	}
}

function drawInventoryCheck(ctx, x, y, checked) {
	const size = 18;

	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 2;

	ctx.strokeRect(x - size / 2, y - size / 2, size, size);

	if (checked) {
		ctx.beginPath();

		ctx.moveTo(x - 5, y);
		ctx.lineTo(x - 1, y + 4);
		ctx.lineTo(x + 6, y - 5);

		ctx.stroke();
	}
}
