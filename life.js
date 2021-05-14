var canvas = document.getElementById('life');
const canvasParams = {
    w: 100,
    h: 100,
};
canvas.width = canvas.width = canvasParams.w;
canvas.height = canvas.height = canvasParams.h;

var ctx = canvas.getContext('2d');

var stack = {};
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

function get_rand_color_num() {
    return get_random_int(0, 255);
    // return 0;
}

function get_rand_color() {
    let red = get_rand_color_num();
    let blue = get_rand_color_num();
    let green = get_rand_color_num();

    let value = get_random_int(0, 2);

    switch (value) {
        case 0:
            red = 255;
            blue = 0;
            green = 0;
            break;
        case 1:
            blue = 255;
            red = 0;
            green = 0;
            break;
        case 2:
            green = 255;
            blue = 0;
            red = 0;
            break;
    }

    return `rgba(${red}, ${blue}, ${green}, 1)`;
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


function search_in_stack_by_coords(stack, coords) {
    return stack[`${coords.x}+${coords.y}`];
}

function get_count_alive_neighbors(cellObj) {
    let alive_count = 0;
    for (neighborKey in cellObj.neighbors) {
        if (cellObj.neighbors[neighborKey].state == 1) {
            alive_count++;
        }
    }
    return alive_count;
}

function init_iteraton(stack) {
    for (let cell_key in stack) {
        let cell = stack[cell_key];
        let alive_count = get_count_alive_neighbors(cell);

        if (cell.state == 0) {
            if (alive_count == 3) {
                cell.set_state(1);
            }
        } else if (cell.state == 1) {
            if ((alive_count == 2) || (alive_count == 3)) {
                cell.set_state(1);
            } else {
                cell.set_state(0);
            }
        }
    }
}

function get_random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Cell {
    constructor(coords = {x: 0, y: 0}) {
        this.state = 0;
        this.coords = coords;
        this.neighbors = [];
        // this.set_rand_state();
    }

    set_neighbors(neighbors) {
        this.neighbors = neighbors;
    }

    set_rand_state() {
        this.state = 0;
        if (get_random_int(0, 1) == 1) {
            if (get_random_int(0, 1) == 1) {
                this.state = 1;
            }
        }
    }

    set_state(state) {
        this.state = state;
    }
}

for (let i = 0; i < canvasParams.w; i++) {
    for (let j = 0; j < canvasParams.h; j++) {
        let new_cell = new Cell({x: i, y: j});
        let temp_string = `${i}+${j}`;
        stack[temp_string] = new_cell;
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
        if (inCoorsBorder(neighborPos)) {
            var neighbor = search_in_stack_by_coords(stack, neighborPos);
            neighbors_result[neighborKey] = neighbor;
        }
    }
    cell.set_neighbors(neighbors_result);
    // break;
}


var states = [3, 8, 5];
var statesKey = 0;

// for (let i = 0; i < 100; i++){
//     init_iteraton(stack);
// }


setInterval(function () {
    ctx.clearRect(0, 0, canvasParams.w, canvasParams.h);
    for (var celly in stack) {
        var celly = stack[celly];
        if (celly.state == 1) {
            ctx.fillStyle = "rgba(0,0,0,1)";
            // ctx.fillStyle = get_rand_color();
            ctx.fillRect(celly.coords.x, celly.coords.y, 1, 1);
        }
    }
    init_iteraton(stack);
}, 1000 / 60);
// }, 500);

canvas.addEventListener("mousemove", function (e) {
    let boundingRect = e.target.getBoundingClientRect();
    // console.log(`x: ${e.clientX}, y: ${e.clientY}`);
    // console.log(e.target.getBoundingClientRect());
    // console.log(`x: ${e.clientX - boundingRect.x}, y: ${e.clientY - boundingRect.y}`);
    let realX = e.clientX - boundingRect.x;
    let realY = e.clientY - boundingRect.y;
    let cell = search_in_stack_by_coords(stack, {x: realX, y: realY});
    // console.log(cell);
    if (typeof (cell) !== "undefined") {
        cell.set_state(1);
        for (const cellKey in cell.neighbors) {
            cell.neighbors[cellKey].set_state(1);
        }
    }

});