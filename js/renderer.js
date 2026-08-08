function renderBoard(puzzle) {

    const board = document.getElementById("board");

    board.innerHTML = "";
    
    const canvas = document.createElement("canvas");

canvas.id = "gameCanvas";
canvas.style.touchAction = "none";



    board.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    
    

    const clueSize = 40;

    // Use the available screen width.
    const availableWidth = window.innerWidth;

    // Leave room for the row clues.
    const cellSize = Math.floor(
        (availableWidth - clueSize) / puzzle.width
    );

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
    
    // Draw player tiles
for (let row = 0; row < puzzle.height; row++) {

    for (let col = 0; col < puzzle.width; col++) {

        const tile = getTile(row, col);

const x = clueSize + col * cellSize;
const y = clueSize + row * cellSize;

drawTile(
    ctx,
    tile,
    x,
    y,
    cellSize,
    row,
    col
);
    }
}
    
     


    // Clues
    ctx.fillStyle = "#000000";
    ctx.font = `${Math.floor(cellSize * 0.45)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Row clues
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
    
    setupInput(canvas, puzzle);
}