function showTitleScreen() {
	const app = document.getElementById("app");

	app.innerHTML = `
        <div class="titleScreen">
            <h1>Micro-battle🦠</h1>
            <button id="startButton">
                Start Puzzle
            </button>
        </div>
    `;

	document.getElementById("startButton").onclick = showGameScreen;
}

function showGameScreen() {
	const app = document.getElementById("app");

	app.innerHTML = `
        <div id="gameScreen">

            <div id="board"></div>

            <div id="gameControls">

                <button id="resetButton" aria-label="Reset puzzle">
                    ↻
                </button>

                <div id="historyControls">

                    <button id="undoButton" aria-label="Undo">
                        ↶
                    </button>

                    <button id="redoButton" aria-label="Redo">
                        ↷
                    </button>

                </div>

            </div>

        </div>
    `;

	createPlayerBoard(puzzle);

	document.getElementById("resetButton").onclick = function () {
		if (confirm("Are you sure you want to reset this puzzle?")) {
			resetPlayerBoard(puzzle);
			updateGame(puzzle);
		}
	};

	document.getElementById("undoButton").onclick = function () {
		if (undoMove()) {
			updateGame(puzzle);
		}
	};

	document.getElementById("redoButton").onclick = function () {
		if (redoMove()) {
			updateGame(puzzle);
		}
	};

	updateGame(puzzle);
}

function showWinScreen() {
	const gameScreen = document.getElementById("gameScreen");

	const overlay = document.createElement("div");

	overlay.id = "winOverlay";

	overlay.innerHTML = `
        <div id="winMessage">
            <h2>🦠Complete!🦠</h2>
            <button id="nextPuzzleButton">
                Next Puzzle
            </button>
        </div>
    `;

	gameScreen.appendChild(overlay);
}

function updateHistoryButtons() {
	const undoButton = document.getElementById("undoButton");
	const redoButton = document.getElementById("redoButton");

	if (!undoButton || !redoButton) {
		return;
	}

	undoButton.disabled = gameWon || !canUndo();
	redoButton.disabled = gameWon || !canRedo();
}

function updateGame(puzzle) {
	if (!gameWon && isPuzzleSolved(puzzle)) {
		completePuzzle(puzzle);
	}

	renderBoard(puzzle);

	updateHistoryButtons();

	if (gameWon) {
		showWinScreen();
	}
}
