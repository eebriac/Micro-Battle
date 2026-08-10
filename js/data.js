let puzzleIndex = [];
let entityDefinitions = {};

async function loadPuzzleIndex() {
	const response = await fetch("data/puzzle-index.json");

	if (!response.ok) {
		throw new Error("Unable to load puzzle index");
	}

	const data = await response.json();

	puzzleIndex = data.puzzles;
}

async function loadPuzzle(index) {
	const entry = puzzleIndex[index];

	if (!entry) {
		throw new Error("Puzzle index out of range: " + index);
	}

	const response = await fetch("data/" + entry.file);

	if (!response.ok) {
		throw new Error("Unable to load puzzle: " + entry.id);
	}

	puzzle = await response.json();

	for (const item of puzzle.inventory) {
		item.definition = await loadEntity(item.entity, puzzle.type);
	}

	// validatePuzzle(puzzle);

	return puzzle;
}

async function loadEntity(entityId, puzzleType) {
	if (entityDefinitions[entityId]) {
		return entityDefinitions[entityId];
	}

	const response = await fetch(
		"data/entities/" + puzzleType + "/" + entityId + ".json"
	);

	if (!response.ok) {
		throw new Error("Unable to load entity: " + entityId);
	}

	const entity = await response.json();

	entityDefinitions[entityId] = entity;

	return entity;
}
