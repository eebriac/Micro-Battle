function titleScreenHTML() {

    return `
        <div class="titleScreen">
            <h1>Micro-battle🦠</h1>

            <button id="startButton">
                Start Puzzle
            </button>
        </div>
    `;
}


function gameScreenHTML() {

    return `
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
}


function winScreenHTML() {

    return `
        <div id="winMessage">
            <h2>🦠Complete!🦠</h2>

            <button id="nextPuzzleButton">
                Next Puzzle
            </button>
        </div>
    `;
}