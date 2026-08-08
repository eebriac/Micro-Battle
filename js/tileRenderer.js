function drawTile(ctx, tile, x, y, size, row, col) {

    if (tile === EMPTY) {
        drawEmptyTile(ctx, x, y, size);
    }

    else if (tile === WATER) {
        drawWaterTile(ctx, x, y, size);
    }

    else if (tile === SHIP) {
        drawShipTile(ctx, x, y, size, row, col);
    }
}


function drawEmptyTile(ctx, x, y, size) {

    // Empty cells don't need anything drawn.
}


function drawWaterTile(ctx, x, y, size) {

    ctx.fillStyle = "#dceeff";

    ctx.fillRect(
        x + 1,
        y + 1,
        size - 2,
        size - 2
    );

    ctx.strokeStyle = "#7bb7e8";
    ctx.lineWidth = 1;

    ctx.beginPath();

    ctx.moveTo(
        x + size * 0.2,
        y + size * 0.55
    );

    ctx.quadraticCurveTo(
        x + size * 0.35,
        y + size * 0.4,
        x + size * 0.5,
        y + size * 0.55
    );

    ctx.quadraticCurveTo(
        x + size * 0.65,
        y + size * 0.7,
        x + size * 0.8,
        y + size * 0.55
    );

    ctx.stroke();
}


function drawShipTile(ctx, x, y, size, row, col) {

    const roundTop =
        row === 0 || isWater(row - 1, col);

    const roundRight =
        col === playerBoard[0].length - 1 ||
        isWater(row, col + 1);

    const roundBottom =
        row === playerBoard.length - 1 ||
        isWater(row + 1, col);

    const roundLeft =
        col === 0 || isWater(row, col - 1);

    // Larger radius for a more obvious rounded ship end.
    const radius = size * 0.50;

    drawRoundedShip(
        ctx,
        x,
        y,
        size,
        radius,
        roundTop,
        roundRight,
        roundBottom,
        roundLeft
    );
}

function isWater(row, col) {

    if (
        row < 0 ||
        row >= playerBoard.length ||
        col < 0 ||
        col >= playerBoard[0].length
    ) {
        return false;
    }

    return getTile(row, col) === WATER;
}

function drawRoundedShip(
    ctx,
    x,
    y,
    size,
    radius,
    roundTop,
    roundRight,
    roundBottom,
    roundLeft
) {

    ctx.fillStyle = "#555555";

    const tl = roundTop && roundLeft ? radius : 0;
    const tr = roundTop && roundRight ? radius : 0;
    const br = roundBottom && roundRight ? radius : 0;
    const bl = roundBottom && roundLeft ? radius : 0;

    ctx.beginPath();

    ctx.moveTo(x + tl, y);

    ctx.lineTo(x + size - tr, y);

    if (tr) {
        ctx.quadraticCurveTo(
            x + size,
            y,
            x + size,
            y + tr
        );
    }

    ctx.lineTo(x + size, y + size - br);

    if (br) {
        ctx.quadraticCurveTo(
            x + size,
            y + size,
            x + size - br,
            y + size
        );
    }

    ctx.lineTo(x + bl, y + size);

    if (bl) {
        ctx.quadraticCurveTo(
            x,
            y + size,
            x,
            y + size - bl
        );
    }

    ctx.lineTo(x, y + tl);

    if (tl) {
        ctx.quadraticCurveTo(
            x,
            y,
            x + tl,
            y
        );
    }

    ctx.closePath();
    ctx.fill();
}