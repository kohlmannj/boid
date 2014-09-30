function Corrals(corralsArray) {
    var that = {};
    
    that.getFirstCorral = function(position) {
        // Super-tenuous. Better not get your order incorrect.
        return corralsArray[0];
    }
    
    that.getCorralForPosition = function(position) {
        var theCorral = null;
        // console.log("Checking position (" + position.x + "," + position.y + ")");
        for (var i = 0; i < corralsArray.length; i++) {
            // var theBounds = corralsArray[i].getBounds();
            // console.log("corralsArray[" + i + "] has bounds (" + theBounds.left + "," + theBounds.right + "," + theBounds.top + "," + theBounds.bottom + ")");
            // console.log(corralsArray[i].containsPosition(position));
            if (corralsArray[i].containsPosition(position)) {
                // This is the corral we're interested in if theCorral is null
                // or if the current theCorral contains corralsArray[i] (i.e.
                // corralsArray[i] covers a smaller area).
                // if (theCorral == null || theCorral.contains(corralsArray[i])) {
                theCorral = corralsArray[i];
                // }
            }
        }
        if (theCorral == null) {
            throw "No Corral contains the position (" + position.x + "," + position.y + ")!";
        }
        var theBounds = theCorral.getBounds();
        // console.log("Boid contained within these bounds: (" + theBounds.left + "," + theBounds.right + "," + theBounds.top + "," + theBounds.bottom + ")");
        return theCorral;
    };
    
    that.draw = function() {
        for (var i = 0; i < corralsArray.length; i++) {
            corralsArray[i].draw();
        }
    };
    
    return that;
}