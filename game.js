var g_paddles = [];
var g_main;
var g_ctx;

var g_shipSprite;
var g_ship;

var g_extraShip1;
var g_extraShip2;

function startGame(g_canvas) {
/*
Good job! Unfortunately there are some errors.

-2 points
Mouse handling doesn't work correctly. The main ship should be draggable and should move the mouse when the mouse is clicked.

- 1 point
The ships don't bounce at the correct place. They do not bounce at the end of the screen but a litle under it so because of the wrapping they appear at the opposite side of the canvas before bouncing.

-1 point
Not enough commentes

-.1 point
applyAccel() doesn't calculate the average velocity, resulting in the ship getting out of sync

-1 point
The extra ships are not in sync with the main ship while moving

You lose 6 points and each point is worth 3%

Grade : 8,2
*/

// Space Ship Sprites
//
// A simple version of an inertial, thrusty, 
// rotateable space ship a la "Asteroids"
/*

==================================
Part 1: Implement a "Sprite" type.
==================================

OVERVIEW:

Provide a constructor that takes an Image object defining the sprite,
and add a drawCentredAt(ctx, cx, cy, rotation) member function which
renders the sprite via the specified context, at the given centre-coords,
and at the desired angle of rotation (in radians).

The framework will call the constructor for you, as part of the supplied 
preload routine...

`g_shipSprite` is the global variable containing the resulting sprite.


Use this sprite to render a simple "spaceship" object, and implement a
mouse-handler which sets its position to that of the most recent mouse-click.

`g_ship` is the global variable containing the primary ship object.


Implement a drawWrappedCentredAt method which handles wrap-around
rendering of the sprite at the edges of the playfield, and modify
the Ship renderer to use that method.


==================================================
Part 2: Implement a thrust-driven Space-ship type.
==================================================

OVERVIEW:

The ship is controlled by forward and retro thrusters.
The ship can rotate freely in space (by, erm, "magic").

You can halt the ship at any time by pressing a "H".
You can also reset the ship to its original coords (and halt it) with "R".

Provide a toggle for gravity, and implement bouncing collision with the 
top and bottom of the playfield when gravity is active, otherwise implement 
standard wrap-around positional behaviour.

The framework also provides two "extra" ships, which imitate the primary one, 
but use update-deltas of half and quarter the size. This illustrates the
(subtle, but sometimes significant) effects of time-step size on behaviour.

The "extra" ships should be on by default, but can be toggled off/on with "E".

NB: More details, including the exact key-mappings to use, are included in
this Framework code. Read it carefully. Stick to the names you have been
given. They have been chosen for a reason. Marking will be strict on this.

Look for the "// YOUR STUFF HERE" markers and add your code in those places.

Create additional helper-functions as and when you need them.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

//var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");



/*
0        1         2         3         4         5         6         7         8         9
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// =================
// KEYBOARD HANDLING
// =================

var g_keys = [];

function handleKeydown(evt) {
    g_keys[evt.keyCode] = true;
}

function handleKeyup(evt) {
    g_keys[evt.keyCode] = false;
}

// Inspects, and then clears, a key's state
//
// This allows a keypress to be "one-shot" e.g. for toggles
// ..until the auto-repeat kicks in, that is.
//
function eatKey(keyCode) { //- base
    var isDown = g_keys[keyCode];
    g_keys[keyCode] = false;
    return isDown;
}

window.addEventListener("keydown", handleKeydown); //- base
window.addEventListener("keyup", handleKeyup); //- base

// ==============
// MOUSE HANDLING
// ==============

// used for testing 
var xx = 0;
var yy = 0;
var rr = 0;

function handleMouse(evt) { //- edit

    // If no button is being pressed, then ignore
    if (!evt.which) return;

    var x = evt.clientX - g_canvas.offsetLeft;
    var y = evt.clientY - g_canvas.offsetTop;

    // moves ship to mouse, rotates ship as mouse is moved
    xx = x;
    yy = y;
    rr += 0.1;
}

// Handle "down" and "move" events the same way.
window.addEventListener("mousedown", handleMouse);
window.addEventListener("mousemove", handleMouse);

// ============
// SPRITE STUFF
// ============

// Construct a "sprite" from the given `image`
//
function Sprite(image) {

    this.image = image;
    this.imgHeight = 100;
    this.imgWidth = 100;
/*
    this.imgHeight = image.height;
    this.imgWidth = image.width;
*/
}

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation, scale) {

    // This is how to implement default parameters...
    if (rotation === undefined) rotation = 0;
    if (scale === undefined) scale = 1;


    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.drawImage(this.image, -(this.imgWidth * scale) / 2, -(this.imgHeight * scale) / 2,
        this.imgWidth * scale,
        this.imgHeight * scale
    );
    ctx.rotate(-rotation);
    ctx.translate(-cx, -cy);

};

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, rotation, scale) {

    if (rotation === undefined) rotation = 0;
    if (scale === undefined) scale = 1;
    var w = g_canvas.width;
    var h = g_canvas.height;

    var x;
    var y;
    for (x = -w; x <= w; x = x + w) {
        for (y = -h; y <= h; y = y + h) {

            this.drawCentredAt(ctx, cx + x, cy + y, rotation, scale);
        }
    }
    if (u_useMarker) {
        this.drawWrappedCentredAt_TEST(ctx, cx, cy, rotation);
    }
};

Sprite.prototype.drawWrappedCentredAt_TEST = function (ctx, cx, cy, rotation, scale) {
    // used to see the postition of the main ship when dealing with wraped ships
    if (rotation === undefined) rotation = 0;
    if (scale === undefined) scale = 1;
    var w = g_canvas.width / 10;
    var h = g_canvas.height / 10;

    var x;
    var y;
    for (x = -w; x <= w; x = x + w) {
        for (y = -h; y <= h; y = y + h) {
            if (x === 0 && y === 0) {} else {
                this.drawCentredAt(ctx, cx + x, cy + y, -rotation, 0.3);
            }
        }
    }


};

// ==========
// SHIP STUFF
// ==========

// A generic contructor which accepts an arbitrary descriptor object
function Ship(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }

    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
}

Ship.prototype.KEY_THRUST = KEY_SHIP_THRUST;
Ship.prototype.KEY_RETRO = KEY_SHIP_RETRO;
Ship.prototype.KEY_LEFT = KEY_SHIP_LEFT;
Ship.prototype.KEY_RIGHT = KEY_SHIP_RIGHT;

// Initial inheritable default values
Ship.prototype.velX = 0;
Ship.prototype.velY = 0;
Ship.prototype.rotation = 0;

Ship.prototype.update = function (du) {

    var thrust = this.computeThrustMag();

    // Apply thrust directionally, based on our rotation
    var accelX = +Math.sin(this.rotation) * thrust;
    var accelY = -Math.cos(this.rotation) * thrust;

    accelY += this.computeGravity();

    this.applyAccel(accelX, accelY, du);

    this.wrapPosition();

    if (thrust === 0 || g_allowMixedActions) {
        this.updateRotation(du);
    }
};

var NOMINAL_GRAVITY = 0.12;

Ship.prototype.computeGravity = function () {

    // If gravity is enabled, return the NOMINAL_GRAVITY value
    // See the "GAME-SPECIFIC DIAGNOSTICS" section for details.

    if (g_useGravity) {

        return NOMINAL_GRAVITY;
    }

    return 0;
};

var NOMINAL_THRUST = +0.2;
var NOMINAL_RETRO = -0.1;

Ship.prototype.computeThrustMag = function () {

    // If thrusters are on, they provide NOMINAL_THRUST
    // If retros are on, they provide NOMINAL_RETRO (a negative force)
    //
    // (NB: Both may be on simultaneously, in which case they combine.)

    var t = 0;

    if (g_keys[this.KEY_THRUST]) {
        t += NOMINAL_THRUST;
    }
    if (g_keys[this.KEY_RETRO]) {
        t += NOMINAL_RETRO;
    }
    return t;
};

Ship.prototype.applyAccel = function (accelX, accelY, du) {

    // Apply the given acceleration, over the specified period,
    // and compute the resulting velocity and displacement.
    //
    // Remember, if gravity is enabled, you must also implement
    // some "bounce functionality" for top and bottom collisions.
    //
    // The effect of the bounce should be to reverse the
    // y-component of the velocity, and then reduce it by 10%

    this.velX += accelX * du;
    this.velY += accelY * du;

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    //  hndles gravity bounce
    if (g_useGravity) {
        if (this.cy > g_canvas.height) {
            this.velY *= -1;
            this.velY *= 0.9;
        } else if (this.cy < 0) {
            this.velY *= -1;
            this.velY *= 0.9;
        }

    }






};

Ship.prototype.reset = function () {
    this.cx = this.reset_cx;
    this.cy = this.reset_cy;
    this.rotation = this.reset_rotation;

    this.halt();
};

Ship.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

var NOMINAL_ROTATE_RATE = 0.1;

Ship.prototype.updateRotation = function (du) {

    if (g_keys[this.KEY_LEFT]) {
        this.rotation -= NOMINAL_ROTATE_RATE * du;
    }
    if (g_keys[this.KEY_RIGHT]) {
        this.rotation += NOMINAL_ROTATE_RATE * du;
    }
};

Ship.prototype.wrapPosition = function () {

    // Don't let the ship's centre-coordinates fall outside
    // the bounds of the playfield.
    //
    var w = g_canvas.width;
    var h = g_canvas.height;

    if (this.cx < 0) {
        this.cx = w;
    } else if (this.cx > w) {
        this.cx = 0;
    }

    if (this.cy < 0) {
        if (g_useGravity) this.cy = 0;
        else this.cy = w;
    } else if (this.cy > w) {
        if (g_useGravity) this.cy = w;
        else this.cy = 0;
    }

};

Ship.prototype.render = function (ctx) {

    g_shipSprite.drawWrappedCentredAt(ctx, this.cx, this.cy, this.rotation);

};

// -------------------
// CONSTRUCT THE SHIPS
// -------------------

g_ship = new Ship({
    cx: 140,
    cy: 200
});

g_extraShip1 = new Ship({
    cx: 200,
    cy: 200
});

g_extraShip2 = new Ship({
    cx: 260,
    cy: 200
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

// --------------------------
// GAME-SPECIFIC UPDATE LOGIC
// --------------------------






function processDiagnostics() {

    // Handle these simple diagnostic options,
    // as defined by the KEY identifiers above.
    //
    // The first three are toggles; the last two are not.
    //
    // NB: The HALT and RESET behaviours should apply to
    // all three ships simulaneously.

    if (eatKey(KEY_EXTRAS)) {
        g_useExtras = !g_useExtras;
    }

    if (eatKey(KEY_GRAVITY)) {
        g_useGravity = !g_useGravity;
    }

    if (eatKey(KEY_MIXED)) {
        g_allowMixedActions = !g_allowMixedActions;
    }

    if (eatKey(KEY_HALT)) {
        g_ship.halt();
        g_extraShip1.halt();
        g_extraShip2.halt();
    }
    if (eatKey(KEY_RESET)) {
        g_ship.reset();
        g_extraShip1.reset();
        g_extraShip2.reset();
    }


    if (eatKey(KEY_TARGET)) {
        u_useMarker = !u_useMarker;
    }

    if (eatKey(KEY_MOUSE)) {
        u_useMouse = !u_useMouse;
    }


    processDiagnostics_message();
}

function processDiagnostics_message() {
    message_Update("mess_extra", "E: Extra ships   - " + g_useExtras);
    message_Update("mess_grav", "G: Gravity - " + g_useGravity);
    message_Update("mess_mixed", "M: Mixed inputs - " + g_allowMixedActions);
    message_Update("mess_target", "T: main ship markers - " + u_useMarker);
    message_Update("mess_Mouse", "I: ship at mouse - " + u_useMouse);
}

function message_Update(id, message) {
    document.getElementById(id).innerHTML = message;
}

// --------------------
// GENERIC UPDATE LOGIC
// --------------------

// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
var NOMINAL_UPDATE_INTERVAL = 16.6666;

// Dt means "delta time" and is in units of the timer-system (i.e. milliseconds)
//
var g_prevUpdateDt = null;

// Du means "delta u", where u represents time in multiples of our nominal interval
//
var g_prevUpdateDu = null;

// Track odds and evens for diagnostic / illustrative purposes
//
var g_isUpdateOdd = false;


function update(dt) {

    // Get out if skipping (e.g. due to pause-mode)
    //
    if (shouldSkipUpdate()) return;

    // Remember this for later
    //
    var original_dt = dt;

    // Warn about very large dt values -- they may lead to error
    //
    if (dt > 200) {
        console.log("Big dt =", dt, ": CLAMPING TO NOMINAL");
        dt = NOMINAL_UPDATE_INTERVAL;
    }

    // If using variable time, divide the actual delta by the "nominal" rate,
    // giving us a conveniently scaled "du" to work with.
    //
    var du = (dt / NOMINAL_UPDATE_INTERVAL);

    updateSimulation(du);

    g_prevUpdateDt = original_dt;
    g_prevUpdateDu = du;

    g_isUpdateOdd = !g_isUpdateOdd;
}

// Togglable Pause Mode
//
var g_isUpdatePaused = false;

function shouldSkipUpdate() {
    if (eatKey(KEY_PAUSE)) {
        g_isUpdatePaused = !g_isUpdatePaused;
    }
    return g_isUpdatePaused && !eatKey(KEY_STEP);
}







// =============
// PRELOAD STUFF
// =============



function preloadStuff_thenCall(completionCallback) {
    var g_shipImage = new Image();
    //g_shipImage.src = "img.jpg";//---
    g_shipImage.src = "ship.png";
    g_shipImage.onload = function () {
        g_shipSprite = new Sprite(g_shipImage);
        completionCallback();
    };

    //g_shipImage.src = "https://notendur.hi.is/~pk/308G/images/ship.png";
    //g_shipImage.src = "https://notendur.hi.is/~uth16/games_design/rocketshiptothestarsdotjeypeg.png";
}

// ========
// MAINLOOP
// ========

// The mainloop is one big object with a fairly small public interface
// (e.g. init, iter, gameOver), and a bunch of private internal helper methods.
//
// The "private" members are identified as such purely by the naming convention
// of having them begin with a leading underscore. A more robust form of privacy,
// with genuine name-hiding *is* possible in JavaScript (via closures), but I 
// haven't adopted it here.
//
var g_main = {

    // "Frame Time" is a (potentially high-precision) frame-clock for animations
    _frameTime_ms: null,
    _frameTimeDelta_ms: null

};

// Perform one iteration of the mainloop
g_main.iter = function (frameTime) {

    // Use the given frameTime to update all of our game-clocks
    this._updateClocks(frameTime);

    // Perform the iteration core to do all the "real" work
    this._iterCore(this._frameTimeDelta_ms);

    // Diagnostics, such as showing current timer values etc.
    this._debugRender(g_ctx);

    // Request the next iteration if needed
    if (!this._isGameOver) this._requestNextIteration();
};

g_main._updateClocks = function (frameTime) {

    // First-time initialisation
    if (this._frameTime_ms === null) this._frameTime_ms = frameTime;

    // Track frameTime and its delta
    this._frameTimeDelta_ms = frameTime - this._frameTime_ms;
    this._frameTime_ms = frameTime;
};

g_main._iterCore = function (dt) {

    // Handle QUIT
    if (requestedQuit()) {
        this.gameOver();
        return;
    }

    gatherInputs();
    update(dt);
    render(g_ctx);
};

g_main._isGameOver = false;

g_main.gameOver = function () {
    this._isGameOver = true;
    console.log("gameOver: quitting...");
};

// Simple voluntary quit mechanism
//
var KEY_QUIT = 'Q'.charCodeAt(0);

function requestedQuit() {
    return g_keys[KEY_QUIT];
}

// Annoying shim for Firefox and Safari
window.requestAnimationFrame =
    window.requestAnimationFrame || // Chrome
    window.mozRequestAnimationFrame || // Firefox
    window.webkitRequestAnimationFrame; // Safari

// This needs to be a "global" function, for the "window" APIs to callback to
function mainIterFrame(frameTime) {
    g_main.iter(frameTime);
}

g_main._requestNextIteration = function () {
    window.requestAnimationFrame(mainIterFrame);
};

// Mainloop-level debug-rendering

var TOGGLE_TIMER_SHOW = 'T'.charCodeAt(0);

g_main._doTimerShow = false;

g_main._debugRender = function (ctx) {

    if (eatKey(TOGGLE_TIMER_SHOW)) this._doTimerShow = !this._doTimerShow;

    if (!this._doTimerShow) return;

    var y = 350;
    ctx.fillText('FT ' + this._frameTime_ms, 50, y + 10);
    ctx.fillText('FD ' + this._frameTimeDelta_ms, 50, y + 20);
    ctx.fillText('UU ' + g_prevUpdateDu, 50, y + 30);
    ctx.fillText('FrameSync ON', 50, y + 40);
};

g_main.init = function () {

    // Grabbing focus is good, but it sometimes screws up jsfiddle,
    // so it's a risky option during "development"
    //
    //window.focus(true);

    // We'll be working on a black background here,
    // so let's use a fillStyle which works against that...
    //
    g_ctx.fillStyle = "white";

    this._requestNextIteration();
};

function mainInit() {
    g_main.init();
}




preloadStuff_thenCall(mainInit);
}

function updateSimulation(du) {

    processDiagnostics();

    g_ship.update(du);

    if (!g_useExtras) return;

    g_extraShip1.update(du / 2);
    g_extraShip1.update(du / 2);

    g_extraShip2.update(du / 4);
    g_extraShip2.update(du / 4);
    g_extraShip2.update(du / 4);
    g_extraShip2.update(du / 4);
}