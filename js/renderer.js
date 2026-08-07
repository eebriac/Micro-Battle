function renderBoard(puzzle) {

    const board = document.getElementById("board");

    board.innerHTML = `
        <h2>MicroBattleships</h2>
        <p>Board size: ${puzzle.width} × ${puzzle.height}</p>
    `;
}