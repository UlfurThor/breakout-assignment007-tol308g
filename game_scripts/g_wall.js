function Wall(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.briks = [];

    var h = this.bottom - this.top;
    var w = g_canvas.width;
    var c = this.columns;
    var r = this.rows;

    var h = this.bottom - this.top;
    var w = g_canvas.width;
    var c = this.columns;
    var r = this.rows;
    var hh = h / r;
    var ww = w / c;
    this.briks = new Array(c);
    for (let i = 0; i < c; i++) {
        this.briks[i] = new Array(r);
        for (let j = 0; j < r; j++) {


            this.briks[i][j] = new Brick({
                height: h / r,
                width: w / c,
                row : r,
                column : c,
                exists: true
            });
        }

    }
}

var marginSide = 2;
var marginToppBottom = 2;

Wall.prototype.render = function (ctx) {
    var B = this.briks;
    var h = this.bottom - this.top;
    var w = g_canvas.width;
    var c = this.columns;
    var r = this.rows;
    var hh = h / r;
    var ww = w / c;

    for (let i = 0; i < B.length; i++) {
        var cx = ww * i;
        for (let j = 0; j < B[i].length; j++) {
            if (B[i][j].exists) {
                var cy = this.top + (hh * j);
                ctx.fillRect(
                    //ctx.strokeRect(
                    cx + marginSide,
                    cy + marginToppBottom,
                    ww - marginSide * 2,
                    hh - marginToppBottom * 2);
            }
            //fillCircle(ctx, cx, cy, 2);

        }

    }
}

Wall.prototype.update = function (du) {
    /*
    var B = this.briks;
    var h = this.bottom - this.top;
    var w = g_canvas.width;
    var c = this.columns;
    var r = this.rows;
    var hh = h / r;
    var ww = w / c;

    for (let i = 0; i < B.length; i++) {
        var cx = ww * i;
        for (let j = 0; j < B[i].length; j++) {
            if (B[i][j].exists) {
                var cy = this.top + (hh * j);
                ctx.fillRect(
                    //ctx.strokeRect(
                    cx + marginSide,
                    cy + marginToppBottom,
                    ww - marginSide * 2,
                    hh - marginToppBottom * 2);
            }

            //fillCircle(ctx, cx, cy, 2);

        }

    }
    */
}

Wall.prototype.collidesWith = function (prevX, prevY, nextX, nextY, radius) {

    var B = this.briks;
    var h = this.bottom - this.top;
    var w = g_canvas.width;
    var c = this.columns;
    var r = this.rows;
    var hh = h / r;
    var ww = w / c;
    var wallEmpty = true;
    for (let i = 0; i < B.length; i++) {
        var cx = (ww * i);
        halfHeight = hh / 2;
        for (let j = 0; j < B[i].length; j++) {
            if (B[i][j].exists) {
                wallEmpty = false;
                var cy = this.top + (hh * j);
                halfWidth = ww / 2;

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
    return 0;

}



var g_wall;