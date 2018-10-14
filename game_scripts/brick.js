var cc = 0;
function Brick(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }

    //console.log("brick made "+cc);
    //cc++;
}


Brick.render = function(ctx){
    
}