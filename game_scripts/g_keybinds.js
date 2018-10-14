// ==========
// KEYBINDS
// ==========
// stores keybinds (as well as some helper functions) for easy changing 

// returns a character froom keycode
function charFromCode(c) {
    return String.fromCharCode(c);
}
// gets kecode from caracter
function keyCode(keyChar) {
    //console.log(keyChar);
    return keyChar.charCodeAt(0);
}

// quit key
var KEY_QUIT = keyCode('Q');
// Mainloop-level debug-rendering
var TOGGLE_TIMER_SHOW = keyCode('T');

// render keybinds
var TOGGLE_CLEAR = keyCode('C');
var TOGGLE_BOX = keyCode('B');
var TOGGLE_UNDO_BOX = keyCode('U');
var TOGGLE_FLIPFLOP = keyCode('F');
var TOGGLE_RENDER = keyCode('R');

// Togglable Pause Mode
var KEY_PAUSE = keyCode('P');
var KEY_STEP = keyCode('O');

// PADDLE 1 keybinds

var KEY_W = keyCode('W');
var KEY_S = keyCode('S');
var KEY_A = keyCode('A');
var KEY_D = keyCode('D');

// PADDLE 2 keybinds

var KEY_I = keyCode('I');
var KEY_K = keyCode('K');
var KEY_J = keyCode('J');
var KEY_L = keyCode('L');

var KEY_UP = 38; //up arrow
var KEY_DOWN = 40; //down arrow
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
//console.log(charFromCode(KEY_K));

var GO_UP = [];
GO_UP[0] = KEY_W;
GO_UP[1] = KEY_I;
GO_UP[2] = KEY_UP;

var GO_DOWN = [];
GO_DOWN[0] = KEY_S;
GO_DOWN[1] = KEY_K;
GO_DOWN[2] = KEY_DOWN;

var GO_LEFT = [];
GO_LEFT[0] = KEY_A;
GO_LEFT[1] = KEY_J;
GO_LEFT[2] = KEY_LEFT;

var GO_RIGHT = [];
GO_RIGHT[0] = KEY_D;
GO_RIGHT[1] = KEY_L;
GO_RIGHT[2] = KEY_RIGHT;