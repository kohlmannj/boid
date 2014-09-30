function Player(theCanvas, theEngine, startX, startY) {
    // Position will default to (0,0) if startX and startY are undefined.
    this.position = new Vector(theCanvas.width / 2, theCanvas.height / 2);
    var degrees = 0;

    this.health = 100;
    this.invulnerable = true;
    this.invulnerableTime = 2 * 60;
    this.score = 0;
    this.gameOver = false;
    this.engine = theEngine;

    var sprite = new Sprite("_img/awesome_player_small.png");

    // Canvas information
    if (theCanvas == undefined || ! theCanvas.getContext("2d")) {
        throw "Player instantiated with invalid canvas reference.";
    }
    var canvas = theCanvas;
    var context = canvas.getContext("2d");

    this.draw = function() {
        this.update();
        sprite.draw(context, this.position.x, this.position.y, degrees * Math.PI / 180);
        // angle = (angle + 1) % 360;
        
        //Healthbar
        context.lineWidth = 2;
        context.fillStyle   = '#f00';
        context.strokeStyle = '#fff';
        if (this.invulnerable) {
            if (this.invulnerableTime % 20 < 10){
                    context.fillRect(this.position.x - 10, this.position.y - 30, Math.max((this.health/5), 0), 5);
                context.strokeRect(this.position.x - 10, this.position.y - 30, 20, 5);
            }
        }
        else {
                        context.fillRect(this.position.x - 10, this.position.y - 30, Math.max((this.health/5), 0), 5);
                    context.strokeRect(this.position.x - 10, this.position.y - 30, 20, 5);
        }
    };

    this.update = function() {
        //degrees = (degrees + 1) % 360;
        if (this.invulnerable){
            this.invulnerableTime = this.invulnerableTime - 1;
            if (this.invulnerableTime < 0){
                this.invulnerable = false;
            }
        }
    }

    this.gotHit = function() {
        this.health -= 20;
        this.invulnerable = true;
        this.invulnerableTime = 3 * 60;
        if (this.health <= 0){
	    this.gameOver = true;
        }
    }
}
