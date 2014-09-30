$(document).ready(function() {
    var mouse = false;
    if (Modernizr.touch) {
        // iOS touch event-based movement
        theControls = "touch";
    } else if (mouse) {
        // Mouse-based movement
        theControls = "mouse";
    } else {
        // Key-based movement
        theControls = "keyboard";
    }
	
	var theEngine = new Engine({
        canvas: document.getElementById("myCanvas"),
        fps: 60,
        controls: theControls
    });
	
	// Intro and instructions control
	$("#helpMe").click(function() {
		$("#intro").fadeIn(500);
	});
	
	$("a.start-game").click(function() {
		$(".infoBox").hide();
	});
	
	$("a#toInstructions").click(function() {
		$("#intro").fadeOut(500);
		$("#instructions").fadeIn(500);
	});
	
	$("a#returnToIntro").click(function() {
		$("#instructions").fadeOut(500);
		$("#intro").fadeIn(500);
	});
	
	$(".restart-game").click(function() {
		$(".infoBox").hide();
		theEngine.reset();
	});
    
    // Input Boxes for Tweaks
    for (var setting in settings) {
      if (settings.hasOwnProperty(setting)) {
            var settingInt  = parseInt(settings[setting]);
            var settingBool = (settings[setting]);
            
            // If this is a boolean, the HTML input is a checkbox.
            // console.log($(theElString).get(0));
            
            var theLabel = $("<label id=\"" + setting + "\"><span>" + settingLabels[setting].name + "!</span><em>" + settings[setting] + "!</em></label>");
            
            if (isNaN(settingInt)) {
                var theInput = $("<input type=\"checkbox\" name=\"" + setting + "\">");
                // Check the checkbox if the setting is true.
                if (settingBool) $(theInput).attr("checked", settingBool);
                // Event handler
                $(theInput).change(function() {
                    settings[setting] = $(theInput).attr("checked");
                });
            } else {
                var theInput = $("<input type=\"range\" size=\"5\" name=\"" + setting + "\" min=\"" + settingLabels[setting].min + "\" max=\"" + settingLabels[setting].max + "\" value=\"" + settingInt + "\">");
                // Event handler
                
                var doUpdate = function() {
                    
                };
                
                $(theInput).keyup(function() {
                    // console.log($(this).attr("name"));
                    var theName = $(this).attr("name");
                    var theValue = parseFloat($(this).attr("value"));
                    if (isNaN(theValue)) {
                        theValue = settings[theName];
                    }
                    settings[theName] = theValue;
                    $("#" + theName + " em").text(settings[theName] + "!");
                }).change(function() {
                    // console.log($(this).attr("name"));
                    var theName = $(this).attr("name");
                    var theValue = parseFloat($(this).attr("value"));
                    if (isNaN(theValue)) {
                        theValue = settings[theName];
                    }
                    settings[theName] = theValue;
                    $("#" + theName + " em").text(settings[theName] + "!");
                });
            }
            
            $(theLabel).append(theInput);
            
            theLabel.appendTo("#inputs");
        }
    }
});
