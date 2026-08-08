function showTitleScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `
        <div class="titleScreen">

            <h1>Fleet Logic</h1>

            <button id="startButton">
                Start Puzzle
            </button>

        </div>
    `;

    document
        .getElementById("startButton")
        .onclick = showGameScreen;
}

function showGameScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `
        <div id="gameScreen">
            <div id="board"></div>
        </div>
    `;

    renderBoard(puzzle);
}
