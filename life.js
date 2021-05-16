var canvas = document.getElementById('life');

const fieldParams = {
    w: 80,
    h: 50,
};
let dot_size = 10;
var canvasParams = {
    dot_size: dot_size,
    w: fieldParams.w * dot_size,
    h: fieldParams.h * dot_size,
    r: 100,
    g: 200,
    b: 200,

    random: false,
    // random: true,
    clear: true,
    opacity: 0.01,
    // clear: false,
};
canvas.width = canvas.width = canvasParams.w;
canvas.height = canvas.height = canvasParams.h;
var render_speed = 100;

var ctx = canvas.getContext('2d');

var stack = {};
var stop = true;
var stackX = [];
var stackY = [];
var neighbors_matrix = [
    {x: -1, y: -1},
    {x: 0, y: -1},
    {x: 1, y: -1},

    {x: -1, y: 0},
    // {x: 0, y: 0}, // current cell
    {x: 1, y: 0},

    {x: -1, y: 1},
    {x: 0, y: 1},
    {x: 1, y: 1},

];

class Cell {
    constructor(coords = {x: 0, y: 0}) {
        this.state = 0;
        this.old_state = this.state;
        this.coords = coords;
        this.neighbors = [];
        this.has_changed = false;
        if (canvasParams.random === true) {
            this.set_rand_state();
        }
    }

    set_neighbors(neighbors) {
        this.neighbors = neighbors;
    }

    set_rand_state() {
        this.state = 0;
        if (get_random_int(0, 1) === 1) {
            if (get_random_int(0, 1) === 1) {
                this.state = 1;
            }
        }
    }

    set_state(state) {
        this.old_state = this.state;
        this.state = state;
    }

}


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

    // return `rgba(${red}, ${blue}, ${green}, 0.3)`;
    return `rgba(200, 100, 200, 0.7)`;
}

function sumOfCoords(coords1, coords2) {
    return {x: coords1.x + coords2.x, y: coords1.y + coords2.y,}
}

function inCoorsBorder(coords) {
    if (((coords.x >= 0) && (coords.x <= (fieldParams.w - 1))) &&
        (coords.y >= 0) && (coords.y <= (fieldParams.h - 1))) {
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
        if (cellObj.neighbors[neighborKey].old_state === 1) {
            alive_count++;
        }
    }
    return alive_count;
}

// var new_stack = {};
// new_stack = set_new_stack(new_stack);

function init_iteraton(stack) {

    for (let cell_key in stack) {
        let cell = stack[cell_key];
        // let new_cell = new_stack[cell_key];
        let alive_count = get_count_alive_neighbors(cell);

        if (cell.state === 0) {
            if (alive_count === 3) {
                cell.set_state(1);
            }
        } else if (cell.state === 1) {
            if ((alive_count === 2) || (alive_count === 3)) {
                cell.set_state(1);
            } else {
                cell.set_state(0);
            }
        }
    }
    for (let cell_key in stack) {
        let cell = stack[cell_key];
        cell.set_state(cell.state);
    }

}

function get_random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function set_new_stack(target_stack) {
    target_stack = {};
    for (let i = 0; i < fieldParams.w; i++) {
        for (let j = 0; j < fieldParams.h; j++) {
            let new_cell = new Cell({x: i, y: j});
            let temp_string = `${i}+${j}`;
            target_stack[temp_string] = new_cell;
        }
    }

    for (cellKey in target_stack) {
        let cell = target_stack[cellKey];
        // var cellCoords = coords;
        let cellCoords = cell.coords;
        let neighbors_result = {};
        // console.log(cell);
        for (neighborKey in neighbors_matrix) {
            let definedNeightbor = null;
            neighbor_finded = false;
            var neighborPos = sumOfCoords(neighbors_matrix[neighborKey], cellCoords);
            if (inCoorsBorder(neighborPos)) {
                var neighbor = search_in_stack_by_coords(target_stack, neighborPos);
                neighbors_result[neighborKey] = neighbor;
            }
        }
        cell.set_neighbors(neighbors_result);
        // break;
    }

    return target_stack;

}

stack = set_new_stack(stack);
var iter_count = 0;
var color = get_rand_color();
let drawer = function () {
    if (canvasParams.clear) {
        ctx.clearRect(0, 0, canvasParams.w, canvasParams.h);
    } else {
        //rgba(200,100,200,1)
        ctx.fillStyle = `rgba(${canvasParams.r}, ${canvasParams.g}, ${canvasParams.b}, ${canvasParams.opacity})`;
        ctx.fillRect(0, 0, canvasParams.w, canvasParams.h);
    }
    for (var celly in stack) {
        var celly = stack[celly];
        if (celly.state == 1) {
            // ctx.fillStyle = "rgba(0,0,0,0.4)";
            if (iter_count === 10) {
                color = get_rand_color();
                ctx.fillStyle = color;
                iter_count = 0;
            } else {
                iter_count++;
            }
            let rect_coords = {
                x: celly.coords.x * canvasParams.dot_size,
                y: celly.coords.y * canvasParams.dot_size
            };
            ctx.fillRect(rect_coords.x, rect_coords.y, canvasParams.dot_size, canvasParams.dot_size);
        }
    }
    if (stop === false) {
        init_iteraton(stack);
    } else {
        // stop = false;
    }
    setTimeout(function () {
        drawer();
    }, 1000 / render_speed);
}
drawer();
// setTimeout(function () {
//     drawer();
// }, render_speed);
// }, 500);
var isDrawing = false;


function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    // context.strokeStyle = 'rgba(200, 100, 200, 1)';

    context.strokeStyle = 'white';
    context.lineWidth = 2;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}

let x = 0;
let y = 0;

canvas.addEventListener('mousedown', e => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
});


canvas.addEventListener('mouseup', e => {
    if (isDrawing === true) {
        drawLine(ctx, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
    }

});

canvas.addEventListener("mousemove", function (e) {
    let boundingRect = e.target.getBoundingClientRect();
    let realX = e.clientX - boundingRect.x;
    let realY = e.clientY - boundingRect.y;
    if (isDrawing) {
        drawLine(ctx, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;

        let cell = search_in_stack_by_coords(stack, {
            x: Math.floor(realX / canvasParams.dot_size),
            y: Math.floor(realY / canvasParams.dot_size),
        });
        if (typeof (cell) !== "undefined") {
            cell.set_state(1);
        }
    }

});

let fps_label = document.getElementById("fps_label");
let render_speed_input = document.getElementById("render_speed");
fps_label.innerText = render_speed_input.value + " IPS";

render_speed_input.addEventListener("input", function (e) {
    render_speed = parseInt(e.currentTarget.value);
    if (render_speed === 61) {
        render_speed = 0;
        fps_label.innerText = `MAX IPS(no frame time limit)`;
    } else {
        fps_label.innerText = `${render_speed} IPS`;
    }
});

let plume_length_input = document.getElementById("plume_length");
let plume_label = document.getElementById("plume_label");
plume_label.innerText = render_speed_input.value + " opacity coeff.";
plume_length_input.addEventListener("input", function (e) {
    plume_length = parseInt(e.currentTarget.value);
    // if (plume_length === 61) {
        canvasParams.opacity = plume_length * 0.01;
        plume_label.innerText = canvasParams.opacity;
    // }
});

document.getElementById("controll_btn").addEventListener("click", function (e) {
    let currentElement = e.target;
    console.log(currentElement);
    if (stop === true) {
        stop = false;
        // drawer();
        currentElement.innerText = "Stop";
    } else {
        currentElement.innerText = "Start";
        stop = true;
    }
});

document.getElementById("rand_btn").addEventListener("click", function (e) {
    let old_random_state = canvasParams.random;
    canvasParams.random = true;
    stack = set_new_stack(stack);
    canvasParams.random = old_random_state;
});

document.getElementById("plume_btn").addEventListener("click", function (e) {
    canvasParams.clear = (canvasParams.clear) ? false : true;
});


document.getElementById("reset_btn").addEventListener("click", function () {
    stack = set_new_stack(stack);
});
