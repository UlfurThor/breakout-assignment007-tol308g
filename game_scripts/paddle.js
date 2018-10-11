    var PADDLE_WIDTH = 100;
    var PADDLE_HEIGHT = 20;

    // A generic contructor which accepts an arbitrary descriptor object
    function Paddle(descr) {
        for (var property in descr) {
            this[property] = descr[property];
        }
    }

    // Add these properties to the prototype, where they will serve as
    // shared defaults, in the absence of an instance-specific overrides.

    Paddle.prototype.halfWidth = PADDLE_WIDTH / 2;
    Paddle.prototype.halfHeight = PADDLE_HEIGHT / 2;
    Paddle.prototype.score = 0;


    Paddle.prototype.update = function () {
        //This is set to leave a 5 px gap between the edge and paddle
        //     Looks better that way
        var edgeOfset = 20;
        var screenMaxOfset = g_canvas.height - edgeOfset;
        /*
                if (g_keys[this.GO_UP]) {
                    this.cy -= 5;
                    if (this.cy - this.halfHeight < edgeOfset)
                        this.cy = edgeOfset + this.halfHeight;
                } else if (g_keys[this.GO_DOWN]) {
                    this.cy += 5;
                    if (this.cy + this.halfHeight > screenMaxOfset)
                        this.cy = (screenMaxOfset) - this.halfHeight;
                }
        */
        if (g_keys[this.GO_LEFT]) {
            this.cx -= 5;
            if (this.cx - this.halfWidth < edgeOfset)
                this.cx = this.halfWidth + edgeOfset;
        } else if (g_keys[this.GO_RIGHT]) {
            this.cx += 5;
            if (this.cx + this.halfWidth > screenMaxOfset)
                this.cx = screenMaxOfset - this.halfWidth;
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