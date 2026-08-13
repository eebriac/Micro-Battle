const modeButton =
    document.getElementById("builderModeButton");

if (modeButton) {
    modeButton.textContent =
        builderMode === "solution"
            ? "Solution"
            : "Initial State";
}

function renderBuilder() {

	const container =
		document.getElementById("builderBoard");

	container.innerHTML = "";

	const canvas =
		document.createElement("canvas");

	canvas.id = "builderCanvas";

	canvas.style.touchAction = "none";

	const clueSize = 40;

	const availableWidth =
		window.innerWidth;

	const cellSize =
		Math.floor(
			(availableWidth - clueSize) /
			builderWidth
		);

	canvas.width =
		clueSize +
		builderWidth * cellSize;

	canvas.height =
		clueSize +
		builderHeight * cellSize;

	container.appendChild(canvas);

	const ctx =
		canvas.getContext("2d");


	// Background

	ctx.fillStyle = "#ffffff";

	ctx.fillRect(
		0,
		0,
		canvas.width,
		canvas.height
	);


	// Draw tiles

	for (
		let row = 0;
		row < builderHeight;
		row++
	) {

		for (
			let col = 0;
			col < builderWidth;
			col++
		) {

			const x =
				clueSize +
				col * cellSize;

			const y =
				clueSize +
				row * cellSize;

			drawBuilderTile(
				ctx,
				builderBoard[row][col],
				x,
				y,
				cellSize
			);
		}
	}


	// Grid goes on top of everything.

	drawBuilderGrid(
		ctx,
		canvas,
		cellSize,
		clueSize
	);
	
	setupBuilderInput();
}


function drawBuilderTile(
	ctx,
	tile,
	x,
	y,
	size
) {

	if (tile === WATER) {

		drawWaterTile(
			ctx,
			x,
			y,
			size
		);

		return;
	}


	if (tile !== EMPTY) {

		drawBuilderShip(
			ctx,
			x,
			y,
			size
		);
	}
}


function drawBuilderShip(
	ctx,
	x,
	y,
	size
) {

	ctx.fillStyle = "#555555";

	ctx.fillRect(
		x + 2,
		y + 2,
		size - 4,
		size - 4
	);
}


function drawBuilderGrid(
	ctx,
	canvas,
	cellSize,
	clueSize
) {

	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;


	// Horizontal lines

	for (
		let row = 0;
		row <= builderHeight;
		row++
	) {

		const y =
			clueSize +
			row * cellSize;

		ctx.beginPath();

		ctx.moveTo(
			clueSize,
			y
		);

		ctx.lineTo(
			canvas.width,
			y
		);

		ctx.stroke();
	}


	// Vertical lines

	for (
		let col = 0;
		col <= builderWidth;
		col++
	) {

		const x =
			clueSize +
			col * cellSize;

		ctx.beginPath();

		ctx.moveTo(
			x,
			clueSize
		);

		ctx.lineTo(
			x,
			canvas.height
		);

		ctx.stroke();
	}
}