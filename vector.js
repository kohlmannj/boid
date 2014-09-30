function Vector(a,b) {
    this.x = a;
    this.y = b;
    
    this.getMagnitude = function(){
        return length = Math.sqrt(this.x * this.x + this.y * this.y);
    };
}

// a and b should be vectors
function addVectors(a, b){
    var x = a.x + b.x;
    var y = a.y + b.y;
    return new Vector(x, y);
}

function subtractVectors(a, b){
    var x = a.x - b.x;
    var y = a.y - b.y;
    return new Vector(x, y);
}

function divideVectorByScalar(a, n){
    var x = a.x / n;
    var y = a.y / n;
    return new Vector(x, y);
}

function scaleVectorToLength(a, n){
    var oldLength = a.getMagnitude();
    var x = a.x * (n / oldLength);
    var y = a.y * (n / oldLength);
    return new Vector(x, y);
}

function truncate(a, b){
    magnitude = a.getMagnitude();
    if (magnitude < b){
        return a;
    }
    else {
        var returnValue = new Vector(0,0);
        returnValue.x = a.x * (b/magnitude);
        returnValue.y = a.y * (b/magnitude);
        return returnValue;
    }       
}
