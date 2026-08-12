function getInvalidCells(puzzle) {
	const invalid = new Set();

	for (let row = 0; row < playerBoard.length; row++) {
		for (let col = 0; col < playerBoard[row].length; col++) {

			if (!isShipCellSafe(row, col)) {
				continue;
			}

			// Check the four diagonal neighbors.
			const diagonals = [
				[row - 1, col - 1],
				[row - 1, col + 1],
				[row + 1, col - 1],
				[row + 1, col + 1]
			];

			for (const [dr, dc] of diagonals) {

				if (!isShipCellSafe(dr, dc)) {
					continue;
				}

				// These two cells are diagonally adjacent.
				// Mark the complete connected ship containing
				// each cell as invalid.
				markConnectedShipInvalid(
					row,
					col,
					invalid
				);

				markConnectedShipInvalid(
					dr,
					dc,
					invalid
				);
			}
		}
	}
	
	// Inventory overages
	checkInventoryOverages(
		puzzle,
		invalid
	);

	return invalid;
}

function isInventoryItemOverLimit(item) {
	const count = recognizedShips.filter(
		ship => ship.entity === item.entity
	).length;

	return count > item.count;
}

function checkInventoryOverages(puzzle, invalid) {

	for (const item of puzzle.inventory) {

		const recognized = recognizedShips.filter(
			ship => ship.entity === item.entity
		);

		if (recognized.length <= item.count) {
			continue;
		}

		// Too many recognized ships of this type.
		for (const ship of recognized) {

			for (const cell of ship.cells) {
				markInvalidCell(
					invalid,
					cell.row,
					cell.col
				);
			}
		}
	}
}

function isShipCellSafe(row, col) {

	if (
		row < 0 ||
		row >= playerBoard.length ||
		col < 0 ||
		col >= playerBoard[0].length
	) {
		return false;
	}

	return isShipCell(row, col);
}


function markConnectedShipInvalid(row, col, invalid) {

	const cells = getConnectedShipCellsAnyType(
		row,
		col
	);

	for (const cell of cells) {
		markInvalidCell(
			invalid,
			cell.row,
			cell.col
		);
	}
}


function getConnectedShipCellsAnyType(startRow, startCol) {

	const cells = [];
	const visited = new Set();

	function visit(row, col) {

		if (
			row < 0 ||
			row >= playerBoard.length ||
			col < 0 ||
			col >= playerBoard[0].length
		) {
			return;
		}

		const key = `${row},${col}`;

		if (visited.has(key)) {
			return;
		}

		if (!isShipCell(row, col)) {
			return;
		}

		visited.add(key);

		cells.push({
			row: row,
			col: col
		});

		visit(row - 1, col);
		visit(row + 1, col);
		visit(row, col - 1);
		visit(row, col + 1);
	}

	visit(startRow, startCol);

	return cells;
}


function markInvalidCell(invalid, row, col) {
	invalid.add(`${row},${col}`);
}

function drawInvalidX(ctx, x, y, size) {
	ctx.save();

	ctx.strokeStyle = "#ff0000";
	ctx.lineWidth = Math.max(3, size * 0.08);
	ctx.lineCap = "round";

	const padding = size * 0.18;

	ctx.beginPath();

	ctx.moveTo(
		x + padding,
		y + padding
	);

	ctx.lineTo(
		x + size - padding,
		y + size - padding
	);

	ctx.moveTo(
		x + size - padding,
		y + padding
	);

	ctx.lineTo(
		x + padding,
		y + size - padding
	);

	ctx.stroke();

	ctx.restore();
}