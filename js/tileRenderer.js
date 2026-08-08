function drawTile(ctx, tile, x, y, size) {

    if (tile === EMPTY) {
        drawEmptyTile(ctx, x, y, size);
    }

    else if (tile === WATER) {
        drawWaterTile(ctx, x, y, size);
    }

    else if (tile === SHIP) {
        drawShipTile(ctx, x, y, size);
    }
}


function drawEmptyTile(ctx, x, y, size) {

    // Empty cells don't need anything drawn.
}


function drawWaterTile(ctx, x, y, size) {

    ctx.fillStyle = "#cccccc";

    ctx.fillRect(
        x + 2,
        y + 2,
        size - 4,
        size - 4
    );
}


function drawShipTile(ctx, x, y, size) {

    ctx.fillStyle = "#555555";

    ctx.fillRect(
        x + 2,
        y + 2,
        size - 4,
        size - 4
    );
}