
function charFromCode(c){
    return String.fromCharCode(KEY_PADDLE_1_DOWN); 
}
function keyCode(keyChar) {
    return keyChar.charCodeAt(0);
}

var KEY_PADDLE_1_UP = 'W'.charCodeAt(0);
var KEY_PADDLE_1_DOWN = 'S'.charCodeAt(0);
var KEY_PADDLE_1_LEFT = 'A'.charCodeAt(0);
var KEY_PADDLE_1_RIGHT = 'D'.charCodeAt(0);


var KEY_PADDLE_2_UP = 'I'.charCodeAt(0);
var KEY_PADDLE_2_DOWN = 'K'.charCodeAt(0);
var KEY_PADDLE_2_LEFT = 'J'.charCodeAt(0);
var KEY_PADDLE_2_RIGHT = 'L'.charCodeAt(0);


var KEY_W = 'W'.charCodeAt(0);
var KEY_S = 'S'.charCodeAt(0);
var KEY_A = 'A'.charCodeAt(0);
var KEY_D = 'D'.charCodeAt(0);

var KEY_QUIT = 'Q'.charCodeAt(0);

var KEY_PAUSE = 'P'.charCodeAt(0);
var KEY_STEP = 'O'.charCodeAt(0);


// game controles
var KEY_HALT = keyCode('H');
var KEY_RESET = keyCode('R');

// game debug controles
var KEY_EXTRAS = keyCode('E');
var KEY_GRAVITY = keyCode('G');
var KEY_MIXED = keyCode('M');

var KEY_TARGET = keyCode('T');
var KEY_MOUSE = keyCode('I');


// ship controles
var KEY_SHIP_THRUST = 'W'.charCodeAt(0);
var KEY_SHIP_RETRO = 'S'.charCodeAt(0);
var KEY_SHIP_LEFT = 'A'.charCodeAt(0);
var KEY_SHIP_RIGHT = 'D'.charCodeAt(0);


// render controles
var TOGGLE_CLEAR = 'C'.charCodeAt(0);
var TOGGLE_BOX = 'B'.charCodeAt(0);
var TOGGLE_UNDO_BOX = 'U'.charCodeAt(0);
var TOGGLE_FLIPFLOP = 'F'.charCodeAt(0);
var TOGGLE_RENDER = 'M'.charCodeAt(0);