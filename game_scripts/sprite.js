
// ============
// SPRITE STUFF
// ============

// Construct a "sprite" from the given `image`
//
function Sprite(image) {

    this.image = image;
    this.imgHeight = image.height;
    this.imgWidth = image.width;

}

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation, scale) {

    // This is how to implement default parameters...
    if (rotation === undefined) rotation = 0;
    if (scale === undefined) scale = 1;


    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.drawImage(this.image, -(this.imgWidth * scale) / 2, -(this.imgHeight * scale) / 2,
        this.imgWidth * scale,
        this.imgHeight * scale
    );
    ctx.rotate(-rotation);
    ctx.translate(-cx, -cy);

};

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, rotation, scale) {

    if (rotation === undefined) rotation = 0;
    if (scale === undefined) scale = 1;
    var w = g_canvas.width;
    var h = g_canvas.height;

    var x;
    var y;
    for (x = -w; x <= w; x = x + w) {
        for (y = -h; y <= h; y = y + h) {

            this.drawCentredAt(ctx, cx + x, cy + y, rotation, scale);
        }
    }
    if (u_useMarker) {
        this.drawWrappedCentredAt_TEST(ctx, cx, cy, rotation);
    }
};

Sprite.prototype.drawWrappedCentredAt_TEST = function (ctx, cx, cy, rotation, scale) {
    // used to see the postition of the main ship when dealing with wraped ships
    if (rotation === undefined) rotation = 0;
    if (scale === undefined) scale = 1;
    var w = g_canvas.width / 10;
    var h = g_canvas.height / 10;

    var x;
    var y;
    for (x = -w; x <= w; x = x + w) {
        for (y = -h; y <= h; y = y + h) {
            if (x === 0 && y === 0) {} else {
                this.drawCentredAt(ctx, cx + x, cy + y, -rotation, 0.3);
            }
        }
    }


};