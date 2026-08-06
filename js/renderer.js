function renderBoard() {

    const board = document.getElementById("gameBoard");

    let html = "";

    html += "<table class='board'>";

    // Top clues
    html += "<tr>";
    html += "<th></th>";

    for (let c = 0; c < 10; c++) {
        html += "<th>" + ((c + 1) % 5) + "</th>";
    }

    html += "</tr>";

    // Rows
    for (let r = 0; r < 10; r++) {

        html += "<tr>";

        html += "<th>" + ((r + 2) % 5) + "</th>";

        for (let c = 0; c < 10; c++) {

            html += "<td></td>";

        }

        html += "</tr>";

    }

    html += "</table>";

    board.innerHTML = html;
}