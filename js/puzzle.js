let puzzle = null;

function createEmptyPuzzle(width, height) {

    return {
        width: width,
        height: height,

        solution: Array.from(
            { length: height },
            () => Array(width).fill(WATER)
        ),

        initialState: Array.from(
            { length: height },
            () => Array(width).fill(EMPTY)
        ),

        rowClues: Array(height).fill(0),
        colClues: Array(width).fill(0),

        inventory: []
    };
}