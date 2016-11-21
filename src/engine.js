//Replaces the character at an index with a new character
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

var Engine = {
	
    //Clickable objects
    Clickables: {
        hackButton:     null,
        
        //Load, save, and delete
        saveButton:     null,
        loadButton:     null,
        deleteButton:   null,
        
        //Main menu buttons
        terminalMainMenuButton:     null,
        characterMainMenuButton:    null,
    },
    
    //Display objects
    Display: {
        //Progress bar
        progress:       null,
        
        //Display for status text (such as "Saved" or "Loaded")
        statusText:     null,
        
        hacking_skill:   null,
        
        //Main menu content
        terminalContent:    null,
        characterContent:   null,
        
        //Character info
        characterInfo:      null,
    },
	
	//Time variables (milliseconds unix epoch time)
	_lastUpdate: new Date().getTime(),
	_idleSpeed: 200,    //Speed (in ms) at which the main loop is updated
    
    //Save function
    saveFile: function() {
        var tempSaveFile = JSON.stringify(Player);
        
        window.localStorage.setItem("netburnerSave", tempSaveFile);
        
        Engine.displayStatusText("Saved!");
    },
    
    //Load saved game function
    loadSave: function() {
        //Check to see if file exists
        if (!window.localStorage.getItem("netburnerSave")) {
            Engine.displayStatusText("No save file present for load!");
        } else {
            var tempSaveFile = window.localStorage.getItem("netburnerSave");
            Player = JSON.parse(tempSaveFile);
            Engine.displayStatusText("Loaded successfully!");
        }
    },
    
    //Delete saved game function
    deleteSave: function() {
        if (!window.localStorage.getItem("netburnerSave")) {
            Engine.displayStatusText("No save file present for deletion");
        } else {
            window.localStorage.removeItem("netburnerSave");
            Engine.displayStatusText("Deleted successfully!");
        }
    },
    
    /* Load content when a main menu button is clicked */ 
    loadTerminalContent: function() {
        Engine.hideAllContent();
        Engine.Display.terminalContent.style.visibility = "visible";
    },
    
    loadCharacterContent: function() {
        Engine.hideAllContent();
        Engine.Display.characterContent.style.visibility = "visible";
        Engine.displayCharacterInfo();
    },
    
    //Helper function that hides all content 
    hideAllContent: function() {
        Engine.Display.terminalContent.style.visibility = "hidden";
        Engine.Display.characterContent.style.visibility = "hidden";
    },
    
    /* Display character info */
    displayCharacterInfo: function() {
        Engine.Display.characterInfo.innerHTML = 'Money: $' + Player.money + '<br><br>' +
                                                 'Hacking Level: ' + Player.hacking_skill + '<br><br>' + 
                                                 'Strength: ' + Player.strength + '<br><br>' + 
                                                 'Defense: ' + Player.defense + '<br><br>' + 
                                                 'Dexterity: ' + Player.dexterity + '<br><br>' + 
                                                 'Agility: ' + Player.agility + '<br><br>' +
												 'Charisma: ' + Player.charisma + '<br><br>' +
												 'Servers owned: ' + Player.purchasedServers.length + '<br><br>' +
                                                 'Hacking Experience: ' + Player.hacking_exp + '<br><br>';
    },
	
	/* Main Event Loop */
	idleTimer: function() {
		//Get time difference
		var _thisUpdate = new Date().getTime();
		var diff = _thisUpdate - Engine._lastUpdate;
        
        //Divide this by cycle time to determine how many cycles have elapsed since last update
        diff = Math.round(diff / Engine._idleSpeed);
        
        if (diff > 0) {
            //Update the game engine by the calculated number of cycles
            Engine.updateGame(diff);
            Engine._lastUpdate = _thisUpdate;
        }       
		
		window.requestAnimationFrame(Engine.idleTimer);
	},
    
    //TODO Account for numCycles in Code, hasn't been done yet
    updateGame: function(numCycles = 1) {
        //Manual hack
		if (Player.startAction == true) {
			Engine._totalActionTime = Player.actionTime;
			Engine._actionTimeLeft = Player.actionTime;
			Engine._actionInProgress = true;
			Engine._actionProgressBarCount = 1;
			Engine._actionProgressStr = "[                                                  ]";
			Engine._actionTimeStr = "Time left: ";
			Player.startAction = false;
			
			//document.getElementById("hack-progress-bar").style.whiteSpace = "pre";
		}
		
		Engine.updateHackProgress();
    },
	
	/* Calculates the hack progress for a manual (non-scripted) hack and updates the progress bar/time accordingly */
	_totalActionTime: 0,
	_actionTimeLeft: 0,
	_actionTimeStr: "Time left: ",
	_actionProgressStr: "[                                                  ]",
	_actionProgressBarCount: 1,
	_actionInProgress: false,
	updateHackProgress: function() {
		if (Engine._actionInProgress == true) {
			Engine._actionTimeLeft -= (Engine._idleSpeed/ 1000);	//Substract idle speed (ms)
		
			//Calculate percent filled 
			var percent = Math.round((1 - Engine._actionTimeLeft / Engine._totalActionTime) * 100);
			
			//Update progress bar 
			while (Engine._actionProgressBarCount * 2 <= percent) {
				Engine._actionProgressStr = Engine._actionProgressStr.replaceAt(Engine._actionProgressBarCount, "|");
				Engine._actionProgressBarCount += 1;
			}
			
			//Update hack time remaining
			Engine._actionTimeStr = "Time left: " + Math.max(0, Math.round(Engine._actionTimeLeft)).toString() + "s";
			document.getElementById("hack-progress").innerHTML = Engine._actionTimeStr;
			
			//Dynamically update progress bar
			document.getElementById("hack-progress-bar").innerHTML = Engine._actionProgressStr.replace( / /g, "&nbsp;" );
			
			//Once percent is 100, the hack is completed
			if (percent >= 100) {
				Engine._actionInProgress = false;
				Terminal.finishAction();
			}

		}
	},
	
    /* Initialization */
	init: function() {
		//Initialization functions
		Player.init();
		
		ForeignServers.init();
		
		Companies.init();
		CompanyPositions.init();
		
        //Load, save, and delete buttons
        //Engine.Clickables.saveButton = document.getElementById("save");
		//Engine.Clickables.saveButton.addEventListener("click", function() {
		//	Engine.saveFile();
		//	return false;
		//});
		
		//Engine.Clickables.loadButton = document.getElementById("load");
		//Engine.Clickables.loadButton.addEventListener("click", function() {
		//	Engine.loadSave();
		//	return false;
		//});
		
		//Engine.Clickables.deleteButton = document.getElementById("delete");
		//Engine.Clickables.deleteButton.addEventListener("click", function() {
		//	Engine.deleteSave();
		//	return false;
		//});
        
        //Main menu buttons and content
        Engine.Clickables.terminalMainMenuButton = document.getElementById("terminal-menu-link");
        Engine.Clickables.terminalMainMenuButton.addEventListener("click", function() {
            Engine.loadTerminalContent();
            return false;
        });
        
        Engine.Clickables.characterMainMenuButton = document.getElementById("character-menu-link");
        Engine.Clickables.characterMainMenuButton.addEventListener("click", function() {
            Engine.loadCharacterContent();
            return false;
        });
        
        Engine.Display.terminalContent = document.getElementById("terminal-container");
        Engine.Display.characterContent = document.getElementById("character-container");
        Engine.Display.characterContent.style.visibility = "hidden";
        
        //Character info
        Engine.Display.characterInfo = document.getElementById("character-info");
        Engine.displayCharacterInfo();
        
        //Message at the top of terminal
		postNetburnerText();
        
        //Run main loop
		Engine.idleTimer();
	}
};

window.onload = function() {
	Engine.init();
};


	

		