"use strict";

/* jshint browser: true, devel: true, globalstrict: true */
function startGame(g_canvas) {
    //g_canvas = document.getElementById("myCanvas");
    var g_ctx = g_canvas.getContext("2d");

    /*
    0        1         2         3         4         5         6         7         8         9
    123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
    */

    // =================
    // KEYBOARD HANDLING
    // =================

    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);

    // ============
    // PADDLE STUFF
    // ============

    // COMMON PADDLE STUFF

    // A generic contructor which accepts an arbitrary descriptor object
    function Paddle(descr) {
        for (var property in descr) {
            this[property] = descr[property];
        }
    }

    // Add these properties to the prototype, where they will serve as
    // shared defaults, in the absence of an instance-specific overrides.

    Paddle.prototype.halfWidth = 10;
    Paddle.prototype.halfHeight = 50;
    Paddle.prototype.score = 0;


    Paddle.prototype.update = function () {
        //This is set to leave a 5 px gap between the edge and paddle
        //     Looks better that way
        if (g_keys[this.GO_UP]) {
            this.cy -= 5;
            if (this.cy - this.halfHeight < 5)
                this.cy = 5 + this.halfHeight;
        } else if (g_keys[this.GO_DOWN]) {
            this.cy += 5;
            if (this.cy + this.halfHeight > 395)
                this.cy = 395 - this.halfHeight;
        }

        if (g_keys[this.GO_LEFT]) {
            this.cx -= 5;
            if (this.cx - this.halfWidth < this.EDGE_LEFT)
                this.cx = this.EDGE_LEFT + this.halfWidth;
        } else if (g_keys[this.GO_RIGHT]) {
            this.cx += 5;
            if (this.cx + this.halfWidth > this.EDGE_RIGHT)
                this.cx = this.EDGE_RIGHT - this.halfWidth;
        }


    };

    Paddle.prototype.render = function (ctx) {
        // (cx, cy) is the centre; must offset it for drawing
        ctx.fillRect(this.cx - this.halfWidth,
            this.cy - this.halfHeight,
            this.halfWidth * 2,
            this.halfHeight * 2);
    };

    Paddle.prototype.collidesWith = function (prevX, prevY,
        nextX, nextY,
        r) {
        var paddleEdge = this.cx;
        // Check X coords
        if ((nextX - r < paddleEdge && prevX - r >= paddleEdge) ||
            (nextX + r > paddleEdge && prevX + r <= paddleEdge)) {
            // Check Y coords
            if (nextY + r >= this.cy - this.halfHeight &&
                nextY - r <= this.cy + this.halfHeight) {
                // It's a hit!
                return true;
            }
        }
        // It's a miss!
        return false;
    };

    // PADDLE 1

    var KEY_W = 'W'.charCodeAt(0);
    var KEY_S = 'S'.charCodeAt(0);
    var KEY_A = 'A'.charCodeAt(0);
    var KEY_D = 'D'.charCodeAt(0);

    var g_paddle1 = new Paddle({
        cx: 30,
        cy: 100,

        GO_UP: KEY_W,
        GO_DOWN: KEY_S,
        GO_LEFT: KEY_A,
        GO_RIGHT: KEY_D,
        EDGE_LEFT: 5,
        EDGE_RIGHT: 100
    });

    // PADDLE 2

    var KEY_I = 'I'.charCodeAt(0);
    var KEY_K = 'K'.charCodeAt(0);
    var KEY_J = 'J'.charCodeAt(0);
    var KEY_L = 'L'.charCodeAt(0);

    var g_paddle2 = new Paddle({
        cx: 370,
        cy: 300,

        GO_UP: KEY_I,
        GO_DOWN: KEY_K,
        GO_LEFT: KEY_J,
        GO_RIGHT: KEY_L,
        EDGE_LEFT: 300,
        EDGE_RIGHT: 395
    });

    // ==========
    // BALL STUFF
    // ==========

    var g_ball1 = new Ball({

        cx: 51,
        cy: 200,
        radius: 10,

        xVel: 5,
        yVel: 4,

        startX: 51,
        startY: 200,
        startVelX: 5,
        startVelY: 4
    });

    var g_ball2 = new Ball({

        cx: 349,
        cy: 200,
        radius: 20,

        xVel: -2.5,
        yVel: -2,

        startX: 349,
        startY: 200,
        startVelX: -2.5,
        startVelY: -2
    });



 

    // =================
    // UPDATE SIMULATION
    // =================

    function updateSimulation() {
        if (shouldSkipUpdate()) return;

        g_ball1.update([g_paddle1,g_paddle2]);
        g_ball2.update([g_paddle1,g_paddle2]);

        g_paddle1.update();
        g_paddle2.update();
    }

    // Togglable Pause Mode
    //
    var KEY_PAUSE = 'P'.charCodeAt(0);
    var KEY_STEP = 'O'.charCodeAt(0);

    var g_isUpdatePaused = false;

    function shouldSkipUpdate() {
        if (eatKey(KEY_PAUSE)) {
            g_isUpdatePaused = !g_isUpdatePaused;
        }
        return g_isUpdatePaused && !eatKey(KEY_STEP);
    }

    // =================
    // RENDER SIMULATION
    // =================

    function renderSimulation(ctx) {
        clearCanvas(ctx);

        g_ball1.render(ctx);
        g_ball2.render(ctx);
        g_paddle1.render(ctx);
        g_paddle2.render(ctx);

        ctx.font = "bold 40px Arial";
        ctx.textAlign = "center";
        ctx.fillText(roundToTen(g_paddle1.score), 50, 35);
        ctx.fillText(roundToTen(g_paddle2.score), 350, 35);
    }

    function roundToTen(n) {
        if (n < 10) {
            return "00" + n;
        }
        if (n < 100) {
            return "0" + n;
        }
        return "" + n;
    }

    // =========
    // MAIN LOOP
    // =========

    function mainIter() {
        if (!requestedQuit()) {
            gatherInputs();
            updateSimulation();
            renderSimulation(g_ctx);
        } else {
            window.clearInterval(intervalID);
        }
    }

    // Simple voluntary quit mechanism
    //
    var KEY_QUIT = 'Q'.charCodeAt(0);

    function requestedQuit() {
        return g_keys[KEY_QUIT];
    }

    // ..and this is how we set it all up, by requesting a recurring periodic
    // "timer event" which we can use as a kind of "heartbeat" for our game.
    //
    var intervalID = window.setInterval(mainIter, 16.666);

    //window.focus();
}