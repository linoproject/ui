var Application_WidgetActionobj = Object.extend(Application_Widget, {
	
	sWidget: "action",
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
			this.oApplication.writeDebugMsg("Fire action "+this.sWindgetId);
		}
		
		if (sWidgetSubAction != 'null'){
			
			sActionObject = eval ("this.oActions."+sWidgetSubAction);
			if (sActionObject == undefined){
				sActionObject = this.oActions[0];
			}
			
		}else{
			// Execure first action 
			sActionObject = this.oActions[0];
		}
		
	
		eval ("this.oApplication.oApplicationClass."+sActionObject+"()");
		
		
	},
	
	
});
