let inventoryState = [];
let recognizedShips = [];

function createInventory(puzzle) {
	inventoryState = [];

	for (const item of puzzle.inventory) {
		inventoryState.push({
			entity: item.entity,
			required: item.count,
			completed: 0,
		});
	}

	inventorySatisfied = false;
}

function updateInventory(puzzle) {
	const result = detectMicroBattleShips();

for (const item of inventoryState) {
	item.completed = result.counts[item.entity] || 0;
}

recognizedShips = result.recognizedShips;

inventorySatisfied = isInventorySatisfied(puzzle);

	inventorySatisfied = isInventorySatisfied(puzzle);
}

function detectMicroBattleShips() {
	const used = Array.from({ length: playerBoard.length }, () =>
		Array(playerBoard[0].length).fill(false)
	);

	const ships = {
		battleship: 0,
		frigate: 0,
		cruiser: 0,
		scout: 0,
	};

	const recognizedShips = [];

	const sizes = [
		{ entity: "battleship", size: 4 },
		{ entity: "frigate", size: 3 },
		{ entity: "cruiser", size: 2 },
	];

	for (const ship of sizes) {
		for (let row = 0; row < playerBoard.length; row++) {
			for (let col = 0; col < playerBoard[row].length; col++) {
				if (canPlaceShip(row, col, ship.size, "horizontal", used)) {
					const cells = getShipCells(
						row,
						col,
						ship.size,
						"horizontal"
					);

					markShip(row, col, ship.size, "horizontal", used);

					ships[ship.entity]++;

					recognizedShips.push({
						entity: ship.entity,
						cells: cells,
						direction: "horizontal",
					});
				} else if (
					canPlaceShip(row, col, ship.size, "vertical", used)
				) {
					const cells = getShipCells(row, col, ship.size, "vertical");

					markShip(row, col, ship.size, "vertical", used);

					ships[ship.entity]++;

					recognizedShips.push({
						entity: ship.entity,
						cells: cells,
						direction: "vertical",
					});
				}
			}
		}
	}

	// Remaining isolated cells are Scouts.
	for (let row = 0; row < playerBoard.length; row++) {
		for (let col = 0; col < playerBoard[row].length; col++) {
			if (
				isShipCell(row, col) &&
				!used[row][col] &&
				scoutIsComplete(row, col)
			) {
				ships.scout++;

				recognizedShips.push({
					entity: "scout",
					cells: [{ row: row, col: col }],
					direction: "vertical",
				});
			}
		}
	}

	return {
		counts: ships,
		recognizedShips: recognizedShips,
	};
}

function getShipCells(row, col, size, direction) {
	const cells = [];

	for (let i = 0; i < size; i++) {
		cells.push({
			row: direction === "vertical" ? row + i : row,
			col: direction === "horizontal" ? col + i : col,
		});
	}

	return cells;
}

function canPlaceShip(row, col, size, direction, used) {
	const cells = [];
	for (let i = 0; i < size; i++) {
		const r = direction === "vertical" ? row + i : row;
		const c = direction === "horizontal" ? col + i : col;
		// Outside board.
		if (
			r < 0 ||
			r >= playerBoard.length ||
			c < 0 ||
			c >= playerBoard[0].length
		) {
			return false;
		}
		// Must be a player's ship.
		if (!isShipCell(r, c)) {
			return false;
		}
		// Already consumed by a larger ship.
		if (used[r][c]) {
			return false;
		}
		cells.push([r, c]);
	}
	// A ship must be complete:
	// its two ends must be water or board edge.
	return isShipComplete(cells);
}

function markShip(row, col, size, direction, used) {
	for (let i = 0; i < size; i++) {
		const r = direction === "vertical" ? row + i : row;

		const c = direction === "horizontal" ? col + i : col;

		used[r][c] = true;
	}
}

function isShipComplete(cells) {
	if (cells.length === 1) {
		return scoutIsComplete(cells[0][0], cells[0][1]);
	}

	const first = cells[0];
	const last = cells[cells.length - 1];

	const horizontal = first[0] === last[0];

	if (horizontal) {
		return (
			isWaterOrEdge(first[0], first[1] - 1) &&
			isWaterOrEdge(last[0], last[1] + 1)
		);
	} else {
		return (
			isWaterOrEdge(first[0] - 1, first[1]) &&
			isWaterOrEdge(last[0] + 1, last[1])
		);
	}
}

function scoutIsComplete(row, col) {
	return (
		isWaterOrEdge(row - 1, col) &&
		isWaterOrEdge(row + 1, col) &&
		isWaterOrEdge(row, col - 1) &&
		isWaterOrEdge(row, col + 1)
	);
}

function isWaterOrEdge(row, col) {
	if (
		row < 0 ||
		row >= playerBoard.length ||
		col < 0 ||
		col >= playerBoard[0].length
	) {
		return true;
	}

	return playerBoard[row][col] === WATER;
}

function isShipCell(row, col) {
	const tile = playerBoard[row][col];

	return tile !== EMPTY && tile !== WATER;
}

function isInventorySatisfied(puzzle) {
	for (const item of inventoryState) {
		if (item.completed !== item.required) {
			return false;
		}
	}

	return true;
}
