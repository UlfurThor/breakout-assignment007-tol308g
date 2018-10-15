function Wall(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.bricks = [];


    this.height = this.bottom - this.top;
    this.width = g_canvas.width;
    this.brickHeight = this.height / this.rows;
    this.brickWidth = this.width / this.columns;
    this.bricks = new Array(this.columns);

    for (let i = 0; i < this.columns; i++) {
        this.bricks[i] = new Array(this.rows);
        for (let j = 0; j < this.rows; j++) {


            this.bricks[i][j] = new Brick({
                cx: this.brickWidth * i + this.brickWidth / 2,
                cy: this.top + this.brickHeight * j + this.brickHeight / 2,
                height: this.brickHeight,
                width: this.brickWidth,
                row: this.rows,
                column: this.columns,
                exists: true,
                debris: 0
            });
        }

    }
}

var BRICK_MARGIN_SIDES = 2;
var BRICK_MARGIN_TB = 2;

Wall.prototype.render = function (ctx) {
    var B = this.bricks;
    this.height = this.bottom - this.top;
    this.width = g_canvas.width;
    this.brickHeight = this.height / this.rows;
    this.brickWidth = this.width / this.columns;

    for (let i = 0; i < this.columns; i++) {
        var cx = this.brickWidth * i + this.brickWidth / 2;
        for (let j = 0; j < this.rows; j++) {
            if (B[i][j].exists) {
                var cy = this.top + (this.brickHeight * j) - this.brickHeight / 2;
                var oldFill = ctx.fillStyle;
                //ctx.fillStyle = randGradient(g_ctx);
                ctx.fillStyle = B[i][j].fill;
                //ctx.fillStyle = B[1][1].fill;
                ctx.fillRect(
                    //ctx.strokeRect(
                    cx - this.brickWidth / 2 + BRICK_MARGIN_SIDES,
                    cy + this.brickHeight / 2 + BRICK_MARGIN_TB,
                    this.brickWidth - BRICK_MARGIN_SIDES * 2,
                    this.brickHeight - BRICK_MARGIN_TB * 2);
            }
            ctx.fillStyle = oldFill;
            fillCircle(ctx, cx,
                cy + this.brickHeight,
                2);

        }

    }


}
var ff;
Wall.prototype.update = function (du) {

}

Wall.prototype.collidesWith = function (prevX, prevY, nextX, nextY, radius) {

    var B = this.bricks;
    this.height = this.bottom - this.top;
    this.width = g_canvas.width;
    this.brickHeight = this.height / this.rows;
    this.brickWidth = this.width / this.columns;
    var wallEmpty = true;
    var r = radius
    if (nextY + radius > this.top && nextY - radius < this.bottom) {

        for (let i = 0; i < this.columns; i++) {
            var cx = this.brickWidth * i + this.brickWidth / 2;
            halfHeight = this.brickHeight / 2;
            for (let j = 0; j < this.rows; j++) {
                if (B[i][j].exists) {
                    var wallEmpty = false;
                    var cy = this.top + (this.brickHeight * j) - this.brickHeight / 2;
                    var halfWidth = this.brickWidth / 2;

                    //console.log(cx +" "+cy);
                    if ((nextY - r < cy + halfHeight && prevY - r >= cy + halfHeight)) {
                        // Check Y coords
                        if (nextX + r >= cx - halfWidth &&
                            nextX - r <= cx + halfWidth) {
                            // It's a hit!
                            B[i][j].exists = false;
                            return 1;
                        }
                    } else if ((nextY + r > cy - halfHeight && prevY + r <= cy - halfHeight)) {
                        if (nextX + r >= cx - halfWidth &&
                            nextX - r <= cx + halfWidth) {
                            // It's a hit!
                            B[i][j].exists = false;
                            return 2;
                        }
                    } else if ((nextX - r < cx + halfWidth && prevX - r >= cy + halfWidth)) {
                        // Check X coords
                        if (nextY + r >= cy - halfHeight &&
                            nextY - r <= cy + halfHeight) {
                            // It's a hit!
                            B[i][j].exists = false;
                            return -1;
                        }
                    } else if ((nextX + r > cx - halfWidth && prevX + r <= cy - halfWidth)) {
                        if (nextY + r >= cy - halfHeight &&
                            nextY - r <= cy + halfHeight) {
                            // It's a hit!
                            B[i][j].exists = false;
                            return -2;
                        }
                    }

                    // It's a miss!

                }

                //fillCircle(ctx, cx, cy, 2);

            }

        }
        if (wallEmpty) {
            g_main.gameOver();
        }
    }

    return 0;

}



var g_wall;