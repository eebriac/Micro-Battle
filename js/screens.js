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

    document
        .getElementById("startButton")
        .onclick = showGameScreen;
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

    document
        .getElementById("resetButton")
        .onclick = function() {

            if (confirm("Are you sure you want to reset this puzzle?")) {
                resetPlayerBoard(puzzle);
                renderBoard(puzzle);
            }
        };

    document
        .getElementById("undoButton")
        .onclick = function() {

            if (undoMove()) {
                renderBoard(puzzle);
            }
        };

    document
        .getElementById("redoButton")
        .onclick = function() {

            if (redoMove()) {
                renderBoard(puzzle);
            }
        };

    renderBoard(puzzle);
}