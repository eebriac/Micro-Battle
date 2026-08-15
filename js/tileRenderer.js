function getRecognizedShipAt(row, col) {
	for (const ship of recognizedShips) {
		for (const cell of ship.cells) {
			if (cell.row === row && cell.col === col) {
				return ship;
			}
		}
	}
	return null;
}

function getRecognizedShipSegment(ship, row, col) {
	if (ship.cells.length === 1) {
		return "single";
	}

	if (ship.direction === "vertical") {
		const sorted = [...ship.cells].sort((a, b) => a.row - b.row);

		if (row === sorted[0].row) {
			return "top";
		}

		if (row === sorted[sorted.length - 1].row) {
			return "end";
		}

		return "mid";
	}

	// Horizontal:
	// "top" means the left-most segment.
	const sorted = [...ship.cells].sort((a, b) => a.col - b.col);

	if (col === sorted[0].col) {
		return "top";
	}

	if (col === sorted[sorted.length - 1].col) {
		return "end";
	}

	return "mid";
}

function drawTile(ctx, tile, x, y, size, row, col) {
	const initial =
		puzzle &&
		puzzle.initialState &&
		puzzle.initialState[row][col] !== EMPTY;

	if (tile === EMPTY) {
		drawEmptyTile(ctx, x, y, size);
	} else if (tile === WATER) {
		drawWaterTile(ctx, x, y, size);
	} else {
		drawShipTile(ctx, x, y, size, row, col);
	}

	if (initial) {
		drawInitialTileBorder(ctx, x, y, size);
	}
}

function drawInitialTileBorder(ctx, x, y, size) {
	ctx.save();

	ctx.strokeStyle = "#cccccc";
	ctx.lineWidth = 5;

	ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);

	ctx.restore();
}

function drawEmptyTile(ctx, x, y, size) {
	// Empty cells don't need anything drawn.
}

function drawWaterTile(ctx, x, y, size) {
	ctx.fillStyle = "#dceeff";

	ctx.fillRect(x + 1, y + 1, size - 2, size - 2);

	ctx.strokeStyle = "#7bb7e8";
	ctx.lineWidth = 1;

	ctx.beginPath();

	ctx.moveTo(x + size * 0.2, y + size * 0.55);

	ctx.quadraticCurveTo(
		x + size * 0.35,
		y + size * 0.4,
		x + size * 0.5,
		y + size * 0.55
	);

	ctx.quadraticCurveTo(
		x + size * 0.65,
		y + size * 0.7,
		x + size * 0.8,
		y + size * 0.55
	);

	ctx.stroke();
}

function drawShipTile(ctx, x, y, size, row, col) {
	const tile = activeBoard[row][col];

	const recognizedShip = getRecognizedShipAt(row, col);

	if (recognizedShip) {
		const segment = getRecognizedShipSegment(recognizedShip, row, col);

		let sprite;

		if (segment === "single") {
			sprite = spriteImages.ship_1;
		} else if (segment === "top") {
			sprite = spriteImages.ship_top;
		} else if (segment === "mid") {
			sprite = spriteImages.ship_mid;
		} else if (segment === "end") {
			sprite = spriteImages.ship_end;
		} else {
			sprite = spriteImages.ship_unk_s;
		}

		drawShipSprite(ctx, sprite, x, y, size, recognizedShip.direction);

		return;
	}

	// Not recognized as complete yet.
	const cells = getConnectedShipCells(row, col, tile);
	if (cells.length === 1) {
		if (scoutIsComplete(row, col)) {
			drawShipSprite(ctx, spriteImages.ship_1_s, x, y, size, "vertical");
		} else {
			drawShipSprite(
				ctx,
				spriteImages.ship_unk_s,
				x,
				y,
				size,
				"vertical"
			);
		}

		return;
	}

	const orientation = determineShipOrientation(cells);

	if (orientation === "unknown") {
		drawShipSprite(ctx, spriteImages.ship_unk_s, x, y, size, "vertical");

		return;
	}

	const segment = determineShipSegment(cells, row, col, orientation);

	let sprite;

	if (segment === "top") {
		sprite = spriteImages.ship_top_s;
	} else if (segment === "mid") {
		sprite = spriteImages.ship_mid_s;
	} else if (segment === "end") {
		sprite = spriteImages.ship_end_s;
	} else {
		sprite = spriteImages.ship_unk_s;
	}

	drawShipSprite(ctx, sprite, x, y, size, orientation);
}

function determineShipOrientation(cells) {
	if (cells.length <= 1) {
		return "vertical";
	}

	const sameColumn = cells.every((cell) => cell.col === cells[0].col);

	const sameRow = cells.every((cell) => cell.row === cells[0].row);

	if (sameColumn) {
		return "vertical";
	}

	if (sameRow) {
		return "horizontal";
	}

	return "unknown";
}

function getConnectedShipCells(startRow, startCol, entity) {
	const cells = [];
	const visited = new Set();

	function visit(row, col) {
		if (
			row < 0 ||
			row >= activeBoard.length ||
			col < 0 ||
			col >= activeBoard[0].length
		) {
			return;
		}

		const key = `${row},${col}`;

		if (visited.has(key)) {
			return;
		}

		if (activeBoard[row][col] !== entity) {
			return;
		}

		visited.add(key);

		cells.push({ row, col });

		visit(row - 1, col);
		visit(row + 1, col);
		visit(row, col - 1);
		visit(row, col + 1);
	}

	visit(startRow, startCol);

	return cells;
}

function determineShipSegment(cells, row, col, orientation) {
	if (cells.length === 1) {
		return "single";
	}

	if (orientation === "horizontal") {
		const sorted = [...cells].sort((a, b) => a.col - b.col);

		const first = sorted[0];
		const last = sorted[sorted.length - 1];

		const leftEndKnown = isWaterOrEdge(first.row, first.col - 1);

		const rightEndKnown = isWaterOrEdge(last.row, last.col + 1);

		// Neither end is known.
		if (!leftEndKnown && !rightEndKnown) {
			return "mid";
		}

		// This is the left-most cell.
		if (row === first.row && col === first.col) {
			// Only call it TOP when the left end
			// is actually proven.
			if (leftEndKnown) {
				return "top";
			}

			return "mid";
		}

		// This is the right-most cell.
		if (row === last.row && col === last.col) {
			// Only call it END when the right end
			// is actually proven.
			if (rightEndKnown) {
				return "end";
			}

			return "mid";
		}

		return "mid";
	}

	if (orientation === "vertical") {
		const sorted = [...cells].sort((a, b) => a.row - b.row);

		const first = sorted[0];
		const last = sorted[sorted.length - 1];

		const topEndKnown = isWaterOrEdge(first.row - 1, first.col);

		const bottomEndKnown = isWaterOrEdge(last.row + 1, last.col);

		// Neither end is known.
		if (!topEndKnown && !bottomEndKnown) {
			return "mid";
		}

		// Top-most cell.
		if (row === first.row && col === first.col) {
			if (topEndKnown) {
				return "top";
			}

			return "mid";
		}

		// Bottom-most cell.
		if (row === last.row && col === last.col) {
			if (bottomEndKnown) {
				return "end";
			}

			return "mid";
		}

		return "mid";
	}

	return "unknown";
}

function drawShipSprite(ctx, sprite, x, y, size, orientation) {
	if (!sprite || !sprite.complete || sprite.naturalWidth === 0) {
		return;
	}

	ctx.save();

	ctx.translate(x + size / 2, y + size / 2);

	// Horizontal = 90° counterclockwise.
	if (orientation === "horizontal") {
		ctx.rotate(-Math.PI / 2);
	}

	const scale = Math.min(
		size / sprite.naturalWidth,
		size / sprite.naturalHeight
	);

	const width = sprite.naturalWidth * scale;
	const height = sprite.naturalHeight * scale;

	ctx.drawImage(sprite, -width / 2, -height / 2, width, height);

	ctx.restore();
}

function isWaterOrEdge(row, col) {
	if (
		row < 0 ||
		row >= activeBoard.length ||
		col < 0 ||
		col >= activeBoard[0].length
	) {
		return true;
	}

	return activeBoard[row][col] === WATER;
}

function isWater(row, col) {
	if (
		row < 0 ||
		row >= activeBoard.length ||
		col < 0 ||
		col >= activeBoard[0].length
	) {
		return false;
	}

	return activeBoard[row][col] === WATER;
}
