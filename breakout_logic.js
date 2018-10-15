// "Crappy PONG" -- step by step
//
// Step 13: Simplify
/*

Supporting timer-events (via setInterval) *and* frame-events (via requestAnimationFrame)
adds significant complexity to the the code.

I can simplify things a little by focusing on the latter case only (which is the
superior mechanism of the two), so let's try doing that...

The "MAINLOOP" code, inside g_main, is much simplified as a result.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

var CANVAS_WIDTH_MAX = 1000;
var CANVAS_WIDTH_MIN = 100;
var CANVAS_HEIGHT_MAX = 1000;
var CANVAS_HEIGHT_MIN = 100;
var score = 0;
/*
0        1         2         3         4         5         6         7         8         9
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// ============
// PADDLE STUFF
// ============

// PADDLE 1

//var g_paddles = [];

//var g_paddle1 = new Paddle({
g_paddles[0] = new Paddle({
    cx: 200,
    cy: 200,
    id: 0,
    bottomOffset : 50
    //GO_UP: KEY_W,
    //GO_DOWN: KEY_S
});
/*
// PADDLE 2

//var g_paddle2 = new Paddle({
g_paddles[1] = new Paddle({
    cx: 370,
    cy: 300,
    id: 1,
    //GO_UP: KEY_I,
    //GO_DOWN: KEY_K
});

//var g_paddle2 = new Paddle({
g_paddles[2] = new Paddle({
    cx: 200,
    cy: 200,
    id: 2,
    //GO_UP: KEY_I,
    //GO_DOWN: KEY_K
});

*/
g_wall = new Wall({
    rows: 5,
    columns: 10,

    top: 50,
    bottom: 150
});

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}

// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

    g_ball.update(du);

    g_paddles.update(du);
    
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    g_ball.render(ctx);

    g_paddles.render(ctx);
    //g_paddle1.render(ctx);
    //g_paddle2.render(ctx);
}

// Kick it off
g_main.init();