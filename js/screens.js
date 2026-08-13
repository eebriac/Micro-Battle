function showTitleScreen() {
	const app = document.getElementById("app");

	app.innerHTML = titleScreenHTML();

	document.getElementById("startButton").onclick = showGameScreen;

	document.getElementById("builderButton").onclick = showBuilderScreen;
}

function showGameScreen() {
	const app = document.getElementById("app");

	app.innerHTML = gameScreenHTML();

	createPlayerBoard(puzzle);

	setupGameControls();

	updateGame(puzzle);
}

function showWinScreen() {
	const gameScreen = document.getElementById("gameScreen");

	const overlay = document.createElement("div");

	overlay.id = "winOverlay";

	overlay.innerHTML = winScreenHTML();

	gameScreen.appendChild(overlay);

	const nextButton = document.getElementById("nextPuzzleButton");

	if (currentPuzzleIndex >= puzzleIndex.length - 1) {
		nextButton.style.display = "none";
	} else {
		nextButton.onclick = nextPuzzle;
	}
}

function showBuilderScreen() {
	const app = document.getElementById("app");

	app.innerHTML = builderScreenHTML();

	initPuzzleBuilder();

	setupBuilderControls();
}
