const spriteImages = {
	ship_1_s: new Image(),
	ship_2_s: new Image(),
	ship_3_s: new Image(),
	ship_4_s: new Image()
};

const inventorySprites = {
	scout: spriteImages.ship_1_s,
	cruiser: spriteImages.ship_2_s,
	frigate: spriteImages.ship_3_s,
	battleship: spriteImages.ship_4_s
};

function loadSprite(image, src) {
	image.onload = () => {
		if (puzzle) {
			renderBoard(puzzle);
		}
	};

	image.onerror = () => {
		console.error(`Failed to load sprite: ${src}`);
	};

	image.src = src;
}

loadSprite(
	spriteImages.ship_1_s,
	"assets/sprites/microbes/ship/ship_1_s.png"
);

loadSprite(
	spriteImages.ship_2_s,
	"assets/sprites/microbes/ship/ship_2_s.png"
);

loadSprite(
	spriteImages.ship_3_s,
	"assets/sprites/microbes/ship/ship_3_s.png"
);

loadSprite(
	spriteImages.ship_4_s,
	"assets/sprites/microbes/ship/ship_4_s.png"
);

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

	const sprite = inventorySprites[item.entity];

	if (!sprite) {
		console.warn(`No inventory sprite found for ${item.entity}`);
		return;
	}

	// Height of the sprite within the inventory row
	const spriteHeight = 30;

	// Preserve the original image aspect ratio
	const spriteWidth =
		sprite.naturalWidth > 0
			? sprite.naturalWidth * (spriteHeight / sprite.naturalHeight)
			: spriteHeight;

	const spriteX = x + 10;
	const spriteY = y + (45 - spriteHeight) / 2;

	// Draw the gray silhouette
	if (sprite.complete && sprite.naturalWidth > 0) {
		ctx.drawImage(
			sprite,
			spriteX,
			spriteY,
			spriteWidth,
			spriteHeight
		);
	}

	// Checkboxes appear immediately after the silhouette
	const checkStartX = spriteX + spriteWidth + 12;

	for (let i = 0; i < item.count; i++) {
		const checked = i < state.completed;

		const checkX = checkStartX + i * 28;

		drawInventoryCheck(
			ctx,
			checkX,
			y + 20,
			checked
		);
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
