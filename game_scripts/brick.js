var cc = 0;

function Brick(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }

    console.log("brick made " + cc);
    cc++;
    this.fill = randGradient(g_ctx, 0, this.cy - this.height, 1600, this.cy + this.height);
}


Brick.render = function (ctx) {

}