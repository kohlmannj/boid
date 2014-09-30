//////// Drama Queen!!! ////////
// When a drama queen get's charmed, all other charmed boids return to neutral.
function DramaQueenBoid() {
    // For Inheritance - this inherits from Boid and passes this class's constructor arugments to it.
    var that = Boid.apply(this, arguments);
    that.identifier = "DramaQueenBoid"; // This is a cheesy workaround for "instanceof" not working.
    that.setStateGraphic();
    
    var extraSprite = Sprite("_img/dramaQueen.png");
    
    // Example of overriding a method: grab a reference to the super method...
    that.superDraw = that.draw;
    // ...then override it (and include a call to the super function)
    // There are better ways, but this is simple enough, I think.
    // Plus, a subclass now has opt-in overrides rather than opt-in inheritance.
    that.draw = function() {
        that.superDraw();
        extraSprite.draw(context, that.position.x, that.position.y, 0);
    }
    
    // The part that makes inheritance work.
    return that;
}

////////// Couple /////////
// When a couple-members significant other gets charmed, (s)he gets angry.
function CoupleBoid() {
    var that = Boid.apply(this, arguments);
    that.identifier = "CoupleBoid";
    that.setStateGraphic();

    that.significantOther;
    var stepsToOther = 500;

    that.superUpdate = that.update;

    that.update = function() {
        var toAddVelocity = divideVectorByScalar(subtractVectors(that.significantOther.position, that.position), stepsToOther);
        that.velocity = addVectors(that.velocity, toAddVelocity);
        that.superUpdate();
    }
    
    var extraSprite = Sprite("_img/couple.png");
    
    that.superDraw = that.draw;
    
    that.draw = function() {
        that.superDraw();
        extraSprite.draw(context, that.position.x, that.position.y, 0);
    }
    
    return that;
}

//////// Peacemaker ////////
// When the peacemaker gets charmed, all other boids that got charmed are not angry.
function PeaceMakerBoid() {
    var that = Boid.apply(this, arguments);
    that.identifier = "PeaceMakerBoid";
    that.setStateGraphic();

    that.superUpdate = that.update;

    that.update = function() {
        that.superUpdate();
    }

    var extraSprite = Sprite("_img/peacemaker.png");
    
    that.superDraw = that.draw;
    
    that.draw = function() {
        that.superDraw();
        extraSprite.draw(context, that.position.x, that.position.y, 0);
    }
    
    return that;
}
