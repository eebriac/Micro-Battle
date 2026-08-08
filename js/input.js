function setupInput(canvas, puzzle) {
	canvas.addEventListener("pointerdown", function (event) {
		const rect = canvas.getBoundingClientRect();

		const clueSize = 40;

		const cellSize = (canvas.width - clueSize) / puzzle.width;

		const x = event.clientX - rect.left - clueSize;
		const y = event.clientY - rect.top - clueSize;

		const col = Math.floor(x / cellSize);
		const row = Math.floor(y / cellSize);

		// Ignore taps outside the puzzle grid.
		if (row < 0 || row >= puzzle.height || col < 0 || col >= puzzle.width) {
			return;
		}

		if (isInitialTile(puzzle, row, col)) {
			return;
		}

		makeMove(row, col);

		renderBoard(puzzle);
	});
}
