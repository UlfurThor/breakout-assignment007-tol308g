// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// =====
// UTILS
// =====
var g_bgColor = "black";
function clearCanvas(ctx) {
    var prevfillStyle = ctx.fillStyle;
    ctx.fillStyle = g_bgColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevfillStyle;
}

function fillCircle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function fillBox(ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
}

// -----------------
// GENERIC RENDERING
// -----------------


var g_doClear = true;
var g_doBox = false;
var g_undoBox = false;
var g_doFlipFlop = false;
var g_doRender = true;

var g_frameCounter = 1;



function render(ctx) {

    // Process various option toggles
    //
    if (eatKey(TOGGLE_CLEAR)) g_doClear = !g_doClear;
    if (eatKey(TOGGLE_BOX)) g_doBox = !g_doBox;
    if (eatKey(TOGGLE_UNDO_BOX)) g_undoBox = !g_undoBox;
    if (eatKey(TOGGLE_FLIPFLOP)) g_doFlipFlop = !g_doFlipFlop;

    // Don't toggle rendering in this exercise,
    // because we're going to "steal" that key to implement "reset" instead.
    if (eatKey(TOGGLE_RENDER)) g_doRender = !g_doRender;

    // I've pulled the clear out of `renderSimulation()` and into
    // here, so that it becomes part of our "diagnostic" wrappers
    //
    if (g_doClear) clearCanvas(ctx);

    // The main purpose of the box is to demonstrate that it is
    // always deleted by the subsequent "undo" before you get to
    // see it...
    //
    // i.e. double-buffering prevents flicker!
    //
    if (g_doBox) fillBox(ctx, 200, 200, 50, 50, "red");


    // The core rendering of the actual game / simulation
    //
    if (g_doRender) renderSimulation(ctx);


    // This flip-flip mechanism illustrates the pattern of alternation
    // between frames, which provides a crude illustration of whether
    // we are running "in sync" with the display refresh rate.
    //
    // e.g. in pathological cases, we might only see the "even" frames.
    //
    if (g_doFlipFlop) {
        var boxX = 250,
            boxY = g_isUpdateOdd ? 100 : 200;

        // Draw flip-flop box
        fillBox(ctx, boxX, boxY, 50, 50, "green");

        // Display the current frame-counter in the box...
        ctx.fillText(g_frameCounter % 1000, boxX + 10, boxY + 20);
        // ..and its odd/even status too
        var text = g_frameCounter % 2 ? "odd" : "even";
        ctx.fillText(text, boxX + 10, boxY + 40);
    }

    // Optional erasure of diagnostic "box",
    // to illustrate flicker-proof double-buffering
    //
    if (g_undoBox) ctx.clearRect(200, 200, 50, 50);

    ++g_frameCounter;
}



// -----------------------
// GAME-SPECIFIC RENDERING
// -----------------------

function renderSimulation(ctx) {

    g_ship.render(ctx);
    if (u_useMouse)
        g_shipSprite.drawWrappedCentredAt(ctx, xx, yy, rr);

    if (!g_useExtras) return;

    g_extraShip1.render(ctx);
    g_extraShip2.render(ctx);
}