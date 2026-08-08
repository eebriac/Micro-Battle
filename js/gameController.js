let currentPuzzleIndex = 0;

function setupGameControls() {

    document
        .getElementById("resetButton")
        .onclick = handleReset;

    document
        .getElementById("undoButton")
        .onclick = handleUndo;

    document
        .getElementById("redoButton")
        .onclick = handleRedo;
        
}


function handleReset() {

    if (!confirm("Are you sure you want to reset this puzzle?")) {
        return;
    }

    resetPlayerBoard(puzzle);

    updateGame(puzzle);
}


function handleUndo() {

    if (undoMove()) {
        updateGame(puzzle);
    }
}


function handleRedo() {

    if (redoMove()) {
        updateGame(puzzle);
    }
}

async function nextPuzzle() {

    currentPuzzleIndex++;

    if (currentPuzzleIndex >= puzzleIndex.length) {
        currentPuzzleIndex = 0;
    }

    await loadPuzzle(currentPuzzleIndex);

    showGameScreen();
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


function updateHistoryButtons() {

    const undoButton = document.getElementById("undoButton");
    const redoButton = document.getElementById("redoButton");

    if (!undoButton || !redoButton) {
        return;
    }

    undoButton.disabled = gameWon || !canUndo();
    redoButton.disabled = gameWon || !canRedo();
}