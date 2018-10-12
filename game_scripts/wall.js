function Wall(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.briks = [];

    var h = this.bottom - this.top;
    var w = g_canvas.width;
    var c = this.columns;
    var r = this.rows;
    this.briks = new Array(c);
    for (let i = 0; i < c; i++) {
        this.briks[i] = new Array(r);
        for (let j = 0; j < r; j++) {


            this.briks[i][j] = new Brick({
                height: h / r,
                width: w / c,

                broken: false
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
            var cy = this.top + (hh * j);
            ctx.fillRect(
                //ctx.strokeRect(
                cx + marginSide,
                cy + marginToppBottom,
                ww - marginSide * 2,
                hh - marginToppBottom * 2);


            //fillCircle(ctx, cx, cy, 2);

        }

    }
}