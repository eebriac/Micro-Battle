function validatePuzzle(puzzle) {
	validateStructure(puzzle);

	if (puzzle.type === "microbattle") {
		validateMicrobattle(puzzle);
	}
}

function validateStructure(puzzle) {
	if (!puzzle.id) {
		throw new Error("Puzzle is missing an ID");
	}

	if (!puzzle.type) {
		throw new Error("Puzzle " + puzzle.id + " is missing a type");
	}

	if (!Number.isInteger(puzzle.width) || !Number.isInteger(puzzle.height)) {
		throw new Error("Puzzle " + puzzle.id + " has invalid dimensions");
	}

	if (
		!Array.isArray(puzzle.initialState) ||
		puzzle.initialState.length !== puzzle.height
	) {
		throw new Error(
			"Puzzle " + puzzle.id + " has an invalid initialState height"
		);
	}

	if (
		!Array.isArray(puzzle.solution) ||
		puzzle.solution.length !== puzzle.height
	) {
		throw new Error(
			"Puzzle " + puzzle.id + " has an invalid solution height"
		);
	}

	for (let row = 0; row < puzzle.height; row++) {
		if (puzzle.initialState[row].length !== puzzle.width) {
			throw new Error(
				"Puzzle " + puzzle.id + " has an invalid initialState row"
			);
		}

		if (puzzle.solution[row].length !== puzzle.width) {
			throw new Error(
				"Puzzle " + puzzle.id + " has an invalid solution row"
			);
		}
	}
}

function validateMicrobattle(puzzle) {
	validateClues(puzzle);

	validateInitialState(puzzle);

	validateSolution(puzzle);
}

function validateClues(puzzle) {
	if (
		!Array.isArray(puzzle.rowClues) ||
		puzzle.rowClues.length !== puzzle.height
	) {
		throw new Error("Puzzle " + puzzle.id + " has invalid row clues");
	}

	if (
		!Array.isArray(puzzle.colClues) ||
		puzzle.colClues.length !== puzzle.width
	) {
		throw new Error("Puzzle " + puzzle.id + " has invalid column clues");
	}
}

function validateInitialState(puzzle) {
	for (let row = 0; row < puzzle.height; row++) {
		for (let col = 0; col < puzzle.width; col++) {
			const initialTile = puzzle.initialState[row][col];

			const solutionTile = puzzle.solution[row][col];

			// An initial ship must actually be a ship
			// in the solution.

			if (initialTile === SHIP && solutionTile !== SHIP) {
				throw new Error(
					"Puzzle " +
						puzzle.id +
						" has an initial ship that is not in the solution"
				);
			}

			// Initial water cannot contain a ship
			// in the solution.

			if (initialTile === WATER && solutionTile === SHIP) {
				throw new Error(
					"Puzzle " +
						puzzle.id +
						" has water placed on a solution ship"
				);
			}
		}
	}
}

function validateSolution(puzzle) {
	// Check rows

	for (let row = 0; row < puzzle.height; row++) {
		let shipCount = 0;

		for (let col = 0; col < puzzle.width; col++) {
			if (puzzle.solution[row][col] === SHIP) {
				shipCount++;
			}
		}

		if (shipCount !== puzzle.rowClues[row]) {
			throw new Error(
				"Puzzle " +
					puzzle.id +
					" solution does not match row clue " +
					row
			);
		}
	}

	// Check columns

	for (let col = 0; col < puzzle.width; col++) {
		let shipCount = 0;

		for (let row = 0; row < puzzle.height; row++) {
			if (puzzle.solution[row][col] === SHIP) {
				shipCount++;
			}
		}

		if (shipCount !== puzzle.colClues[col]) {
			throw new Error(
				"Puzzle " +
					puzzle.id +
					" solution does not match column clue " +
					col
			);
		}
	}
}
