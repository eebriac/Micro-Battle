let puzzleIndex = [];
let puzzle = null;

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
	return puzzle;
}

async function startGame() {

    await loadPuzzleIndex();

    await loadPuzzle(currentPuzzleIndex);

    showTitleScreen();
}

startGame();
