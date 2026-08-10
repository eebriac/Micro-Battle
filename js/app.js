async function startGame() {
    await loadPuzzleIndex();
    await loadPuzzle(currentPuzzleIndex);
    showTitleScreen();
}

startGame();
