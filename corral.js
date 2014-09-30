function Corral(params) {
    // Magical inheritance incantation
    var that = {};
    
    if (! params.hasOwnProperty("canvas")) {
        throw "Improperly instantiated Corral object.";
    }
    
    context = params.canvas.getContext("2d");
    // Center the Corral on the canvas by default
    that.position = new Vector(params.canvas.width / 2, params.canvas.height / 2);
    if (params.hasOwnProperty("x") && params.hasOwnProperty("y")) {
        that.position = new Vector(params.x, params.y);
    }
    
    var width = params.canvas.width;
    if (params.hasOwnProperty("width")) {
        width = params.width;
    }
    
    var height = params.canvas.height;
    if (params.hasOwnProperty("height")) {
        height = params.height;
    }
    
    // console.log("placing a " + width + " x " + height + " Corral, centered at (" + that.position.x + "," + that.position.y + ")");
    
    var sprite = null;
    if (params.hasOwnProperty("image")) {
        sprite = new Sprite(params.image);
    }
    
    that.draw = function() {
        // Draw the sprite if we created this object with one
        if (sprite != null) {
            sprite.draw(context, that.position.x, that.position.y, 0);
        }
    };
    
    var bounds = {
        left:   that.position.x - (width / 2),
        right:  that.position.x + (width / 2),
        top:    that.position.y - (height / 2),
        bottom: that.position.y + (height / 2)
    };
    
    that.getBounds = function() {
        return bounds;
    };
    
    that.containsPosition = function(testPos) {
        // console.log("Testing for point (" + testPos.x + "," + testPos.y + ")");
        // console.log(bounds);
        var theResult = (testPos.x >= bounds.left) && (testPos.x <= bounds.right) && 
               (testPos.y >= bounds.top) && (testPos.y <= bounds.bottom);
        // console.log(theResult);
        return theResult;
    };
    
    that.contains = function(otherCorral) {
        var otherBounds = otherCorral.getBounds();
        return (bounds.left < otherBounds.left) && (bounds.right > otherBounds.right) &&
               (bounds.top > otherBounds.top) && (bounds.bottom > otherBounds.bottom);
    }
    
    that.getWidth = function() {
        return width;
    };
    
    that.getHeight = function() {
        return height;
    };
    
    // Default settings
    defaultSettings = {
        amtStepsCoh: 200,   
        closeDistCoh: 50,       
        closeDistSep: 20,   
        amtStepsAlign: 30,
        closeDistAlign: 30,
        maxSpeed: 5
    };
    
    // Use default settings to begin with.
    that.settings = defaultSettings;
    
    // Use settings from constructor if provided.
    if (params.hasOwnProperty("settings")) {
        that.settings = params.settings;
    }
    
    // console.log("Instantiated new Corral");
    // console.log(that.getBounds());
    return that;
}
