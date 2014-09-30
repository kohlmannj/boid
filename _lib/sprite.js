(function() {
    function LoaderProxy() {
        return {
            draw: $.noop,
            fill: $.noop,
            frame: $.noop,
            update: $.noop,
            width: null,
            height: null
        };
    }
    
    function Sprite(image, sourceX, sourceY, width, height) {
        sourceX = sourceX || 0;
        sourceY = sourceY || 0;
        width = width || image.width;
        height = height || image.height;
        
        return {
            draw: function(canvas, x, y, angle) {
                canvas.translate(x, y);
                canvas.rotate(angle);
                canvas.drawImage(
                    image,
                    sourceX,
                    sourceY,
                    width,
                    height,
                    // Center the sprite
                    -width / 2,
                    -height / 2,
                    width,
                    height
                );
                canvas.rotate(-angle);
                canvas.translate(-x, -y);
            },
            
            test: function() {
                console.log("Hi, I'm a test!")
            },
            
            fill: function(canvas, x, y, width, height, repeat) {
                repeat = repeat || "repeat";
                var pattern = canvas.createPattern(image, repeat);
                canvas.fillColor(pattern);
                canvas.fillRect(x, y, width, height);
            },
            
            width: width,
            height: height
        };
    };
    
    Sprite.load = function(url, loadedCallback) {
        var img = new Image();
        var proxy = LoaderProxy();
        
        img.onload = function() {
            var tile = Sprite(this);
            
            $.extend(proxy, tile);
            
            if(loadedCallback) {
                loadedCallback(proxy);
            }
        };
        
        img.src = url;
        
        return proxy;
    };
 
    window.Sprite = function(name, callback) {
        return Sprite.load(name, callback);
    };
    window.Sprite.EMPTY = LoaderProxy();
    window.Sprite.load = Sprite.load;
}());
