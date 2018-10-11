g_paddles = [];

function startGame(g_canvas) {
    //g_canvas = document.getElementById("myCanvas");
    var g_ctx = g_canvas.getContext("2d");


    // =================
    // KEYBOARD HANDLING
    // =================

    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);

    // ============
    // PADDLE STUFF
    // ============

    // COMMON PADDLE STUFF



    // PADDLE 1

    var KEY_W = 'W'.charCodeAt(0);
    var KEY_S = 'S'.charCodeAt(0);
    var KEY_A = 'A'.charCodeAt(0);
    var KEY_D = 'D'.charCodeAt(0);

    var g_paddle1 = new Paddle({
        cx: g_canvas.width / 2,
        cy: g_canvas.height - 30,

        GO_UP: KEY_W,
        GO_DOWN: KEY_S,
        GO_LEFT: KEY_A,
        GO_RIGHT: KEY_D,
        EDGE_LEFT: 5,
        EDGE_RIGHT: 100
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



    var g_wall = new Wall({
        rows: 5,
        columns: 10,

        top: 50,
        bottom: 150
    });

    // =================
    // UPDATE SIMULATION
    // =================

    function updateSimulation() {
        if (shouldSkipUpdate()) return;

        g_ball1.update([g_paddle1]);
        g_ball2.update([g_paddle1]);

        g_paddle1.update();
        //g_paddle2.update();
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
        //g_paddle2.render(ctx);
        g_wall.render(ctx);
        ctx.font = "bold 40px Arial";
        ctx.textAlign = "center";
        ctx.fillText(roundToTen(g_paddle1.score), 50, 35);
        //ctx.fillText(roundToTen(g_paddle2.score), 350, 35);
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

    window.focus();
}