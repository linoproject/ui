/**
 * Handle all authentication and authorization
 * TODO: implement GROUP
 */
var Application_Action = Object.extend(Object, {
    
    evalAction: function(oApplication, sAction){
        
        // Grab special commands like console.log, sleep,...
        if (sAction.indexOf("log")> -1){
            sAction = sAction.replace('log("',"").replace('")',"");
        }else if (sAction.indexOf("sleep") >-1){
            console.log("Sleep");
            var iMilliseconds = parseInt(sAction.replace('sleep(',"").replace(')',""));
            this._sleep(iMilliseconds);
        }else{

            try{
                eval ("oApplication.oApplicationClass."+sAction);
            }catch(e){
                try{
                    eval ("oApplication.oWidgets."+sAction);
                }catch(e){
                    
                    console.log("ERROR: No object|widget and method found!")
                    console.log("ERROR: Call method"+ "this.oApplication.oApplicationClass."+sAction);
                    console.log("ERROR: Call method"+ "this.oApplication.oWidgets."+sAction);
                }
            }
        }
    },
    
    evalMultipleActionsSub: function(oApplication, oActions, sWidgetSubAction){
        if (typeof(eval("oActions."+sWidgetSubAction).split("|")) == "object"){
			
			var aActions = eval("oActions."+sWidgetSubAction).split("|");
			for (var i=0; i < aActions.length; i++){
			
				this.evalAction(oApplication,aActions[i]); // Call action interpreter
			}
			
		}else{
			if (sWidgetSubAction != 'null'){
				
				sActionObject = eval ("oActions."+sWidgetSubAction);
				if (sActionObject == undefined){
					sActionObject = this.oActions[0];
				}
				
			}else{
				// Execure first action 
				sActionObject = this.oActions[0];
			}
			
			
			this.evalAction(oApplication,sActionObject);
			
		}
    },

    evalMultipleActions: function(oApplication, sActions){
        
        if (typeof(sActions.split("|")) == "object"){
            
            var aActions = sActions.split("|");
			for (var i=0; i < aActions.length; i++){
			
				this.evalAction(oApplication,aActions[i]); // Call action interpreter
            }
        }else{
            if (sActions != ""){
                this.evalAction(sActions);
            }
            
        }
    },

    _sleep: function(iMilliseconds){
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > iMilliseconds){
            break;
            }
        }

    }

});