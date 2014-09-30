function Engine(init) {
    if (init == undefined) {
        throw "Improperly initialized Engine.";
    }
    
    var that = this;
    
    // Canvas Initialization
    var fps = init.fps;
    var canvas = init.canvas;
    var context = canvas.getContext("2d");

    // Game Draw and Update Loops
    setInterval(function() {
        draw();
    }, 1000 / fps);
    
    var specialBackground = false;
    var changeBackgroundTimer = Math.floor(Math.random() * 60) + 60;
    var timerLength = changeBackgroundTimer;
    var Colours = {"purple":0, "red":1, "green":2, "yellow":3, "orange":4, "blue":5};
    var currentColour = (Math.random() * 6);
    
    var theBackgroundColor = [0,0,0,1];
    var currentAlpha = 1;
    var alphaStep = 0;
    
    var redrawColor = "rgba(0,0,0,1)";
    
    var theColorToString = function(theColor) {
        return "rgba(" + theColor[0] + "," + theColor[1] + "," + theColor[2] + "," + theColor[3] + ")";
    }
    
    var motionBlur = function(enable) {
        if (enable) {
            redrawColor = "rgba(0,0,0,0.35)";
        } else {
            redrawColor = "rgba(0,0,0,1)";
        }
    }
    
    var draw = function() {
        // Draw black background all the time
        context.fillStyle = redrawColor;
        context.fillRect(0,0,canvas.width,canvas.height);
        
        if (specialBackground) {
            switch(currentColour){
                case Colours.purple:
                    theBackgroundColor = [0, 0, 200, 0.3];
                    break;
                case Colours.red:
                    theBackgroundColor = [255, 0, 0, 0.3];
                    break;
                case Colours.green:
                    theBackgroundColor = [0, 255, 0, 0.3];
                    break;
                case Colours.yellow:
                    theBackgroundColor = [255, 255, 0, 0.6];
                    break;
                case Colours.orange:
                    theBackgroundColor = [255, 165, 0, 0.5];
                    break;
                case Colours.blue:
                    theBackgroundColor = [0, 0, 255, 0.3];
                    break;
                default:
                    theBackgroundColor = [0, 0, 200, 0.3];
                    break;
            }
        }

        changeBackgroundTimer--;
        if (changeBackgroundTimer < 0){
            if (specialBackground) {
                changeBackgroundTimer = Math.floor(Math.random() * 60) + 60;
                timerLength = changeBackgroundTimer;
                alphaStep = currentAlpha / changeBackgroundTimer;
                specialBackground = false;
            }
            else {
                changeBackgroundTimer = Math.floor(Math.random() * 80) + 50;
                timerLength = changeBackgroundTimer;
                alphaStep = 0;
                specialBackground = true;
                currentColour = Math.floor(Math.random() * 6);
            }
        }
        boids.draw();
        
        if (specialBackground) {
            var theCurrentColor = theBackgroundColor;
            if (changeBackgroundTimer / timerLength < 0.5) {
                theCurrentColor[3] *= changeBackgroundTimer / timerLength;
            } else {
                theCurrentColor[3] *= 1 - changeBackgroundTimer / timerLength;
            }
            context.fillStyle = theColorToString(theCurrentColor);
            context.fillRect(0,0,canvas.width,canvas.height);
        }
    }
    
    // Entities that require drawing and updates.
    var player;
    var boids;
    var pissed = false;
    
    reset = function() {
        player = new Player(canvas, this);
        boids = new Boids(canvas, player);
        pissed = false;
        motionBlur(pissed);
        // Controls in here for now!
        // Key Bindings
        $(document).bind('keydown', 'c', boids.charm);
        $(document).bind('keydown', 'x', boids.repel);
        $(document).bind('keydown', 'z', function() {
            if (! pissed) {
                //...they will be.
                document.getElementById("audioT").play();
                pissed = true;
                motionBlur(pissed);
            }
            
            var audioAngry = document.getElementById("audioAngry");
            
            if (! audioAngry.playing || audioAngry.ended) {
                audioAngry.currentTime = 0;
                audioAngry.play();
            }
            
            boids.insult();
        });           
        
        // Mouse Movement
        $("#myCanvas").mousemove(function(e) {
            player.position.x = e.pageX - this.offsetLeft;
            player.position.y = e.pageY - this.offsetTop;
        });
    }

    reset();

	this.reset = reset;
}
