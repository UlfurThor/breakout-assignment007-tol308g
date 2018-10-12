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
        var screenMaxOfset = g_canvas.width - edgeOfset;

        if (g_keys[this.GO_UP]) {
            this.cy -= 5;

            if (this.cy - this.halfHeight < edgeOfset)
                this.cy = edgeOfset + this.halfHeight;
            //else g_canvas.height -= 5;
        } else if (g_keys[this.GO_DOWN]) {
            this.cy += 5;
            if (this.cy + this.halfHeight > screenMaxOfset)
                this.cy = (screenMaxOfset) - this.halfHeight;
            //else g_canvas.height += 5;
        }

        if (g_keys[this.GO_LEFT]) {
            this.cx -= 5;
            if (this.cx - this.halfWidth < edgeOfset)
                this.cx = this.halfWidth + edgeOfset;
            //else g_canvas.width -= 5;


        } else if (g_keys[this.GO_RIGHT]) {
            this.cx += 5;
            if (this.cx + this.halfWidth > screenMaxOfset)
                this.cx = screenMaxOfset - this.halfWidth;
            //else g_canvas.width += 5;

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
        var paddleEdge = this.cy;
        // Check X coords
        if ((nextY - r < paddleEdge && prevY - r >= paddleEdge) ||
            (nextY + r > paddleEdge && prevY + r <= paddleEdge)) {
            // Check Y coords
            if (nextX + r >= this.cx - this.halfWidth &&
                nextX - r <= this.cx + this.halfWidth) {
                // It's a hit!
                return true;
            }
        }
        // It's a miss!
        return false;
    };