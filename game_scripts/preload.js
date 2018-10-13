

var g_sprites = [];
var g_shipImage = "";
//g_shipImage.src = "https://notendur.hi.is/~uth16/games_design/rocketshiptothestarsdotjeypeg.png";
var shipPath = "https://notendur.hi.is/~pk/308G/images/ship.png";
function preloadStuff_thenCall(completionCallback) {
    var g_shipImage = new Image();
    g_shipImage.src = shipPath;

    g_shipImage.onload = function () {
        g_shipSprite = new Sprite(g_shipImage);
        completionCallback();
    };

}