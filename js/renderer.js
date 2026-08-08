function renderBoard(puzzle) {

    const board = document.getElementById("board");

    const canvas = document.createElement("canvas");

    canvas.width = 400;
    canvas.height = 400;

    board.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, 400, 400);

    ctx.fillStyle = "black";
    ctx.font = "24px sans-serif";
    ctx.fillText("Canvas works!", 100, 200);
}