function renderBoard(puzzle) {

    const board = document.getElementById("board");

    board.innerHTML = "";

    const canvas = document.createElement("canvas");

    canvas.id = "gameCanvas";

    board.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const cellSize = 40;

    const clueSize = 30;

    canvas.width = clueSize + puzzle.width * cellSize;
    canvas.height = clueSize + puzzle.height * cellSize;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;

    for (let row = 0; row <= puzzle.height; row++) {

        const y = clueSize + row * cellSize;

        ctx.beginPath();
        ctx.moveTo(clueSize, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    for (let col = 0; col <= puzzle.width; col++) {

        const x = clueSize + col * cellSize;

        ctx.beginPath();
        ctx.moveTo(x, clueSize);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Row clues
    ctx.fillStyle = "#000000";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let row = 0; row < puzzle.height; row++) {

        const y = clueSize + row * cellSize + cellSize / 2;

        ctx.fillText(
            puzzle.rowClues[row],
            clueSize / 2,
            y
        );
    }

    // Column clues
    for (let col = 0; col < puzzle.width; col++) {

        const x = clueSize + col * cellSize + cellSize / 2;

        ctx.fillText(
            puzzle.colClues[col],
            x,
            clueSize / 2
        );
    }
}