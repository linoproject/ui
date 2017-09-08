/**
 *
 * @class Application_WidgetActionobj
 * 
 * Execute JS object or widget method on fire action
 * 
 * <span class="x-lprjwdg-actionobj" id="wdgAction1">
		<span class="x-lprjelm x-lprjvar-Action1">Application_index.action(0)|Application2_index.action(1)|...</span> 
	</span>
 *
 * 
 * 
 */
var Application_WidgetActionobj = Object.extend(Application_Widget, {
	
	sWidget: "actionobj",
	oElement: null,
	oApplication: null,
	
	
	oActions : {},
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Actions");
		}
	},
	
	startWidget: function(oCallback){
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Instantiate and place action hooks");
		}
		
		// Catch action
		this.oActions =  this.oApplication.oLibClass.Vars.getElementVar(this.oElement);
		
		oCallback();
	},
	
	
	fireAction: function(sWidgetSubAction){
		
		
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Fire action object");
		}
		
		if (typeof(eval("this.oActions."+sWidgetSubAction).split("|")) == "object"){
			
			var aActions = eval("this.oActions."+sWidgetSubAction).split("|");
			for (var i=0; i < aActions.length; i++){
				try{
					eval ("this.oApplication.oApplicationClass."+aActions[i]);
				}catch(e){
					try{
						eval ("this.oApplication.oWidgets."+aActions[i]);
					}catch(e){
						
						console.log("ERROR: No object|widget and method found!")
						console.log("ERROR: Call method"+ "this.oApplication.oApplicationClass."+aActions[i]);
						console.log("ERROR: Call method"+ "this.oApplication.oWidgets."+aActions[i]);
					}
				}
			}
			
		}else{
			if (sWidgetSubAction != 'null'){
				
				sActionObject = eval ("this.oActions."+sWidgetSubAction);
				if (sActionObject == undefined){
					sActionObject = this.oActions[0];
				}
				
			}else{
				// Execure first action 
				sActionObject = this.oActions[0];
			}
			
			try{
				eval ("this.oApplication.oApplicationClass."+sActionObject+"()");
			}catch(e){
				try{
					eval ("this.oApplication.oWidgets."+sActionObject+"()");
				}catch(e){
					console.log("No object|widget and method found!")
				}
			}
			
		}
		
		
		
		
		
	
		
		
		
	},
	
	
});
