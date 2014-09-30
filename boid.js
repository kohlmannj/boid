//////// Boid Class ////////
function Boid(canvas, bArray, theCorrals, player, States) {
    // For Inheritance - this inherits from Object
    var that = {};
    
    // Instance Variables
    var sprite = null; // we'll set this later with that.setStateGraphic()
    
    // Class Variables
    context = canvas.getContext("2d");
    boidArray = bArray;
    
    // Public, Inherited Stuff!
    that.identifier = "Boid"; // This is a cheesy workaround for "instanceof" not working.
    that.state = null;
    
    that.position = new Vector(Math.random()*(canvas.width - 2) + 1, Math.random() * (canvas.height - 2) + 1);
    that.velocity = new Vector (Math.floor(Math.random() * 7) - 3, Math.floor(Math.random() * 7) - 3);

    // console.log(theCorrals);
    
    // Initialize the settings.
    var corral = theCorrals.getFirstCorral();
    var corralBounds = corral.getBounds();
    var settings = corral.settings;

    that.velocityAngle = function() {
        return Math.atan2(that.velocity.y,that.velocity.x);
    }


    // Draw has to be public.
    that.draw = function() {
        // Do updates...
        // Finally do the draw
        sprite.draw(context, that.position.x, that.position.y, that.velocityAngle());
    };

        // The update function
    that.update = function() {
        // Update the corral that we're in (and its settings) iff we're attracted!
        if (that.state == States.attracted) {
            corral = theCorrals.getCorralForPosition(that.position);
            settings = corral.settings;
            corralBounds = corral.getBounds(); 
        }

        //Updates regarding their specific state
        switch (that.state) {
            case States.attracted:
                if (getDistance(that, player.position) > charmDist){
                    that.state = States.neutral;
                    that.setStateGraphic();
                }
                break;
            case States.angry:
                if ((getDistance(that, player.position) < 15) && !player.invulnerable){
                    player.gotHit();

                    //Check if this was the end and handle it  
                    //Aka losing condition
                    if (player.gameOver){
		    	var score = 0;
                        var firstCorral = theCorrals.getFirstCorral();
                        for (var i = 0; i < boidArray.length; i++) {
		 	    var currentBoid = boidArray[i];
		 	    var thisCorral = theCorrals.getCorralForPosition(currentBoid.position) ;
		 	    if (thisCorral != firstCorral){
			    	score++;
			    }
			}
				$("#gameOver .finalScore").text(score);
      	        $("#gameOver").fadeIn(500);
		    }
                }
                break;
            default:
                break;
        }

        // Now update their positions
        // Modify velocity first
        var v1 = cohesion(that);
        var v2 = separation(that);
        var v3 = alignment(that);
        var v4 = that.stateVelocity();
        that.velocity = addVectors(addVectors(that.velocity, addVectors(addVectors(v1,v2), v3)), v4);
        that.velocity = truncate(that.velocity, settings.maxSpeed);
        // Set new position
        that.position = addVectors(that.position, that.velocity);
        
        // Bounce if hitting left or right edges of canvas
        if (that.position.x <= corralBounds.left) {
            that.position.x = corralBounds.left * 2 - that.position.x;
            that.velocity.x = - that.velocity.x;
        }
        else if (that.position.x > corralBounds.right){
            that.position.x = corralBounds.right - (that.position.x % corralBounds.right);
            that.velocity.x = - that.velocity.x;
        }
        
        // Bounce if hitting top or bottom of canvas
        if (that.position.y <= corralBounds.top){
            that.position.y = corralBounds.top * 2 - that.position.y;
            that.velocity.y = - that.velocity.y;
        }
        else if (that.position.y > corralBounds.bottom){
            that.position.y = corralBounds.bottom - (that.position.y % corralBounds.bottom);
            that.velocity.y = - that.velocity.y;
        }
    }

    // Adjust your velocity based on your current state
    // stateVelocity requires access to player, so it's an instance function
    that.stateVelocity = function() {
        switch (that.state){
            case States.attracted:
                var returnValue = divideVectorByScalar(subtractVectors(player.position, that.position), charmSteps);
                return returnValue;
                break;
            case States.angry:
                var returnValue = divideVectorByScalar(subtractVectors(player.position, that.position), angrySteps);
                return returnValue;
                break;
            default:
                return new Vector(0,0);
                break;
        }
    }
    
    // This didn't get pretty when separated, so it's an instance function
    that.setStateGraphic = function() {
        switch(that.state) {
            case States.attracted:
                sprite = Sprite("_img/attractedBoid.png");
                break;
            case States.neutral:
                sprite = Sprite("_img/neutralBoid.png");
                break;
            case States.angry:
                sprite = Sprite("_img/angryBoid.png");
                break;
            default:
                sprite = Sprite("_img/neutralBoid.png");
                that.state = States.neutral;
                break;
        }   
    };
    
    // Call the above to set the sprite
    that.setStateGraphic();
    
    // The part that makes inheritance work.
    return that;
}

//////// Boid Utilities! ////////
// Move towards the Center of Mass of closeby boids
cohesion = function(that) {
    com = findCOM(that);
    if (com.x == -1 && com.y == -1){
        return new Vector(0,0);
    }
    else {
        var returnValue = divideVectorByScalar(subtractVectors(com, that.position), settings.amtStepsCoh);
        return returnValue;
    }
};

// Move away from boids that are too close
separation = function(that) {
    c = new Vector(0,0);
    for (var i = 0; i < boidArray.length; i++) {
        var iPosition = boidArray[i].position;
        if (boidArray[i] != that) {
            var distanceS = getDistance(that, iPosition);
            if (distanceS < settings.closeDistSep){
                var posDiff = subtractVectors(iPosition, that.position);
                c = divideVectorByScalar( subtractVectors( c, posDiff ), distanceS );
            }                       
        }
    }           
    return c;
};

// Adjust your velocity to match the average of closeby boids
alignment = function(that) {
    pv = findPV(that);
    if (pv.x == -1 && pv.y == -1){
        return new Vector(0,0);
    }
    else{
        var returnValue = divideVectorByScalar(subtractVectors(pv, that.velocity), settings.amtStepsAlign);
        return returnValue;
    }
};

// Find the Center of Mass of closeby boids (helper function for cohesion)
findCOM = function(that) {
    var com = new Vector(0,0);
    var count = 0;
    for (var i = 0; i < boidArray.length; i++) {
         if (boidArray[i] != that){             
            var iPosition = boidArray[i].position;
            var distanceS = getDistance(that, iPosition);
            if (distanceS < settings.closeDistCoh){
                com = addVectors(com, iPosition);
                count++;
            }   
         }
    }
    
    if (count != 0){
        com = divideVectorByScalar(com, count);             
        return com;
    }
    else {
        return new Vector(-1,-1);
    }
};

// Find the average velocity for closeby boids (helper function for alignment)
findPV = function(that) {
    var pv = new Vector(0,0);
    var count = 0;
    for (var i = 0; i < boidArray.length; i++) {
        if (boidArray[i] != that){
            var iPosition = boidArray[i].position;
            var distanceS = getDistance(that, iPosition);
            if (distanceS < settings.closeDistAlign){
                pv = addVectors(pv, boidArray[i].velocity);
                count++;
            }   
        }
    }
    
    if (count != 0){
        pv = divideVectorByScalar(pv, count);               
        return pv;
    }
    else {
        return new Vector(-1,-1);
    }
};

getDistance = function(that, a) {
    var distanceV = subtractVectors(a, that.position);
    var distanceS = distanceV.getMagnitude();
    return distanceS;
}