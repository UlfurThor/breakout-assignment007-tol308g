function preloadStuff_thenCall(completionCallback) {
    var g_shipImage = new Image();

    g_shipImage.onload = function () {
        g_shipSprite = new Sprite(g_shipImage);
        completionCallback();
    };

    g_shipImage.src = "https://notendur.hi.is/~pk/308G/images/ship.png";
    //g_shipImage.src = "https://notendur.hi.is/~uth16/games_design/rocketshiptothestarsdotjeypeg.png";
}