var canvas = document.getElementById('life');
const canvasParams = {
    w: 40,
    h: 40,
};
canvas.width = canvas.width = canvasParams.w;
canvas.height = canvas.height = canvasParams.h;

var ctx = canvas.getContext('2d');

var stack = [];
var stackX = [];
var stackY = [];
var neighbors_matrix = [
    {x: -1, y: -1},
    {x: 0, y: -1},
    {x: 1, y: -1},

    {x: -1, y: 0},
    //{x: 0, y: 0}, // current cell
    {x: 1, y: 0},

    {x: -1, y: 1},
    {x: 0, y: 1},
    {x: 1, y: 1},

];

function isIdentyWeak(obj1, obj2) {
    if ((obj1.x == obj2.x) && (obj1.y == obj2.y)) {
        return true;
    }
    return false;
}

function get_count_living_neighbors(cellObj) {

}

function sumOfCoords(coords1, coords2) {
    return {x: coords1.x + coords2.x, y: coords1.y + coords2.y,}
}

function inCoorsBorder(coords) {
    if (((coords.x >= 0) && (coords.x <= (canvasParams.w - 1))) &&
        (coords.y >= 0) && (coords.y <= (canvasParams.h - 1))) {
        return true;
    }
    return false;
}

function gen_neighbors(coords) {
    neighbors_result = [];
    // for (cellKey in stack) {
    //     let cell = stack[cellKey];
    //     let cellCoords = cell.coords;
    let cellCoords = coords;

    for (let neighborKey in neighbors_matrix) {
        let definedNeightbor = null;
        neighbor_finded = false;
        let neighborPos = sumOfCoords(neighbors_matrix[neighborKey], cellCoords);
        if (inCoorsBorder(neighborPos)) {
            for (neighborKey in stack) {
                let neighbor = stack[neighborKey];

                if (isIdentyWeak(neighborPos, neighbor.coords)) {
                    neighbors_result[neighborKey] = neighbor;
                    neighbor_finded = true;
                }
            }
            if (neighbor_finded == false) {
                neighbors_result[neighborKey] = new Cell(neighborPos);
            }
        }
    }
}

class Cell {
    constructor(coords = {x: 0, y: 0}) {
        this.state = 0;
        this.coords = coords;
        this.neighbors = [];
    }

    set_neighbors(neighbors) {
        this.neighbors = neighbors;
    }
}

for (let i = 0; i < canvasParams.w; i++) {
    for (let j = 0; j < canvasParams.h; j++) {
        let new_cell = new Cell({x: i, y: j});
        stack.push(new_cell);
    }
}


for (cellKey in stack) {
    var cell = stack[cellKey];
    // var cellCoords = coords;
    var cellCoords = cell.coords;
    var neighbors_result = {};
    // console.log(cell);
    for (neighborKey in neighbors_matrix) {
        var definedNeightbor = null;
        neighbor_finded = false;
        var neighborPos = sumOfCoords(neighbors_matrix[neighborKey], cellCoords);
        // console.log(neighborPos);
        // break;
        if (inCoorsBorder(neighborPos)) {
            for (stackKey in stack) {
                var neighbor = stack[stackKey];
                if (isIdentyWeak(neighborPos, neighbor.coords)) {
                    neighbors_result[neighborKey] = neighbor;
                    neighbor_finded = true;
                    if (neighbor_finded) {
                    }
                    // break;
                }
            }
            if (neighbor_finded == false) {
                // neighbors_result[neighborKey] = new Cell(neighborPos);
            }
        }
    }
    cell.set_neighbors(neighbors_result);
    // break;
}

for (var celly in stack) {

    var celly = stack[celly];
    if (Object.keys(celly.neighbors).length == 3) {
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(celly.coords.x, celly.coords.y, 1, 1);
    }
}