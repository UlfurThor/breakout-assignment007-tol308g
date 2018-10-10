    // BALL STUFF
    console.log("ball");

    function Ball(descr) {
        for (var property in descr) {
            this[property] = descr[property];
        }
    }

    Ball.prototype.update = function (paddles) {
        // Remember my previous position
        var prevX = this.cx;
        var prevY = this.cy;

        // Compute my provisional new position (barring collisions)
        var nextX = prevX + this.xVel;
        var nextY = prevY + this.yVel;

        // Bounce off the paddles
        
        for (let i = 0; i < paddles.length; i++) {
            if (paddles[i].collidesWith(prevX, prevY, nextX, nextY, this.radius)) {
                this.xVel *= -1;
            }
            
        }

        // Bounce off top and bottom edges
        if (nextY < 0 || // top edge
            nextY > g_canvas.height) { // bottom edge
            this.yVel *= -1;
        }

        // Reset if we fall off the left or right edges
        // ...by more than some arbitrary `margin`
        //
        /*
        var margin = 4 * this.radius;
        if (nextX < -margin || 
            nextX > g_canvas.width + margin) {
            this.reset();
        }
        */

        if (nextX < 0 ||
            nextX > g_canvas.width) {
            this.score(paddles);
            //this.reset();
            this.xVel *= -1;
        }

        // *Actually* update my position 
        // ...using whatever velocity I've ended up with
        //
        this.cx += this.xVel;
        this.cy += this.yVel;
    };

    Ball.prototype.reset = function () {


        this.cx = this.startX;
        this.cy = this.startY;
        this.xVel = this.startVelX;
        this.yVel = this.startVelY;
    };

    Ball.prototype.render = function (ctx) {
        fillCircle(ctx, this.cx, this.cy, this.radius);
    };

    Ball.prototype.score = function (paddles) {


        if (this.cx < 200) {
            paddles[0].score++;
        } else {
            paddles[1].score++;
        }

    }