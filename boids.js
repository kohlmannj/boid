var States = {"attracted":0, "neutral":1, "angry":2};

//Variables for flocking
var settings = {
    amtStepsCoh: 200,
    closeDistCoh: 50,
    closeDistSep: 20,
    amtStepsAlign: 30,
    closeDistAlign: 30,
    maxSpeed: 40
};

var settingLabels = {
    amtStepsCoh: {
        name: "Coherence Coefficient",
        min: 1,
        max: 300
    },
    closeDistCoh: {
        name: "Coherence Distance",
        min: 0,
        max: 500
    },
    closeDistSep: {
        name: "Separation Distance",
        min: 0,
        max: 200
    },
    amtStepsAlign: {
        name: "Alignment Coefficient",
        min: 1,
        max: 100
    },
    closeDistAlign: {
        name: "Alignment Distance",
        min: 0,
        max: 300
    },
    maxSpeed: {
        name: "Maximum Speed",
        min: 0,
        max: 15
    }
};

// variables for behaviour regarding state & special boids
var charmDist = 100;
var charmSteps = 80;
var angrySteps = 800;
var repelDist = 100;
var toBeRepelledVel = 10;
var toBeInsultedVel = 20;

function Boids(canvas, player) {
    // Private, *non-inherited* stuff.
    var that = {};
    // Private, *inherited* stuff.
    boidLoc = 10;
    boidArray = [];
    // Public, inherited stuff.

    var numBoids = 100;
    var numQueens = 5;
    var numCouples = 4;
    var numPeace = 1;
    
    // var numBoids = 3;
    // var numQueens = 0;
    // var numCouples = 0;
    // var numPeace = 0;
    // Create Corral objects!
    var corralsArray = [];

    // This first new Corral is the entire level area (Corral automatically sets it to the width and height of the canvas)
    corralsArray.push(new Corral({
        canvas: canvas
    }));

    // The Dance Floor!
    corralsArray.push(new Corral({
        canvas: canvas,
        width: 200,
        height: 149,
        image: "_img/dancefloor.png",
        // Lower values for the dance floor.
        settings: {
            amtStepsCoh: 20,
            closeDistCoh: 10,
            closeDistSep: 5,
            amtStepsAlign: 10,
            closeDistAlign: 5,
            maxSpeed: 80
        }
    }));
    
    // The Corrals object draws all the Corral objects and provides the getCorralForPosition() function.
    var theCorrals = new Corrals(corralsArray);

    // Add boids
    for (var i = 0; i < numBoids; i++){
        boidArray.push(new Boid(canvas, boidArray, theCorrals, player, States));
    }
    
    //Add dramaQueens
    for (var i = 0; i < numQueens; i++){
        theQueen = new DramaQueenBoid(canvas, boidArray, theCorrals, player, States);
        boidArray.push(theQueen);
    }

    //Add couples
    for (var i = 0; i < numCouples; i++){
        coupleA = new CoupleBoid(canvas, boidArray, theCorrals, player, States);
        coupleB = new CoupleBoid(canvas, boidArray, theCorrals, player, States);
        coupleA.significantOther = coupleB;
        coupleB.significantOther = coupleA;
        boidArray.push(coupleA);
        boidArray.push(coupleB);
    }

    //add PeaceMakers
    for (var i = 0; i < numPeace; i++){
        peaceMaker = new PeaceMakerBoid(canvas, boidArray, theCorrals, player, States);
        boidArray.push(peaceMaker);
    }

    that.draw = function() {
        for (var i = 0; i < boidArray.length; i++){
            boidArray[i].update();
        }

        theCorrals.draw();
		
        player.draw();
		
        for (var i = 0; i < boidArray.length; i++){
            boidArray[i].draw();
        }
        that.checkWin();
    }
    
    that.checkWin = function() {
    	 //Winning condition
	var won = true;
	var boidsLeft = boidArray.length - 1;
	var outerCorral = theCorrals.getFirstCorral();
	while (boidsLeft > -1 && won){
	    var currentBoid = boidArray[boidsLeft];
            var thisCorral = theCorrals.getCorralForPosition(currentBoid.position);
	       if (thisCorral == outerCorral){
	           won = false;
	       }
	    boidsLeft--;
	}
	if (won){
	    $("#gameWon .finalScore").text(boidArray.length);
		$("#gameWon").fadeIn(500);
	}
    }
    
    that.charm = function() {
        var playerPosition = player.position;
        var dramaQueenIncluded = 0;
        var totals = 0;
        for (var i = 0; i < boidArray.length; i++){
            var currentBoid = boidArray[i];
            var distance = getDistance(currentBoid, playerPosition);
            if (distance < charmDist){
	    	totals++;
                if (currentBoid.identifier == "DramaQueenBoid"){
                    //Set all boids un-attracted and her angry
                    if (dramaQueenIncluded > 0){
		    	that.setAllClosebyAngry();
		    }
		    else{
		    	console.log("First drama");
		    	if (totals == 1){
                            currentBoid.state = States.attracted;
                            currentBoid.setStateGraphic();
		        }
		        else{
                            currentBoid.state = States.angry;
                            currentBoid.setStateGraphic();
          		}
   		    }
		    dramaQueenIncluded++;
                }
                else if (currentBoid.identifier == "CoupleBoid"){
		    if (dramaQueenIncluded < 2){
                        currentBoid.state = States.attracted;
                        currentBoid.setStateGraphic();
                        currentBoid.significantOther.state = States.angry;
                        currentBoid.significantOther.setStateGraphic();
      		    }
                }
                else if (currentBoid.identifier == "PeaceMakerBoid"){
		    if (dramaQueenIncluded < 2){
                        that.removeAllClosebyAngry();
                        currentBoid.state = States.attracted;
                        currentBoid.setStateGraphic();
      		    }
                }
                else if (currentBoid.state == States.neutral) {
                    currentBoid.state = States.attracted;
                    currentBoid.setStateGraphic();
                }
            }
        }

        if (dramaQueenIncluded > 0 && totals > 1){
            that.removeAllAttraction();
        }
    }

    that.removeAllAttraction = function() {
            for (var i = 0; i < boidArray.length; i++){
            var currentBoid = boidArray[i];
            if (currentBoid.state == States.attracted) {
                currentBoid.state = States.neutral;
                currentBoid.setStateGraphic();
            }
        }
    }
    
    that.removeAllClosebyAngry = function() {
        for (var i = 0; i < boidArray.length; i++){
            var currentBoid = boidArray[i];
            if (currentBoid.state == States.angry && (getDistance(currentBoid, player.position) < charmDist)) {
                currentBoid.state = States.neutral;
                currentBoid.setStateGraphic();
            }
        }
    }
    
    that.setAllClosebyAngry = function() {
    	for (var i = 0; i < boidArray.length; i++){
            var currentBoid = boidArray[i];
            if (currentBoid.state != States.angry && (getDistance(currentBoid, player.position) < charmDist)) {
                currentBoid.state = States.angry;
                currentBoid.setStateGraphic();
            }
        }
    }

    that.repel = function() {
        var playerPosition = player.position;
        for (var i = 0; i < boidArray.length; i++){
            var currentBoid = boidArray[i];
            var distance = getDistance(currentBoid, playerPosition);
            if (distance < repelDist){
                //Negative impulse to velocity
                var impulseDirection = subtractVectors(currentBoid.position, playerPosition);
                impulseDirection = scaleVectorToLength(impulseDirection, toBeRepelledVel);
                currentBoid.velocity = addVectors(currentBoid.velocity, impulseDirection);
            }
        }
    }

    that.insult = function() {
     var playerPosition = player.position;
        for (var i = 0; i < boidArray.length; i++){
            var currentBoid = boidArray[i];
            var distance = getDistance(currentBoid, playerPosition);
            if (distance < repelDist){
                //Negative impulse to velocity
                var impulseDirection = subtractVectors(currentBoid.position, playerPosition);
                impulseDirection = scaleVectorToLength(impulseDirection, toBeInsultedVel);
                currentBoid.velocity = addVectors(currentBoid.velocity, impulseDirection);
                currentBoid.state = States.angry;
                currentBoid.setStateGraphic();
            }
        }
    }
    
    // The part that makes inheritance work.
    return that;
}

