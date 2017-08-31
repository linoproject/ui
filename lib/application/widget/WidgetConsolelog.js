/**
 * @class Application_WidgetConsole
 * Send value to console.log area (or specified)
 * 
 * <div class="x-lprjwdg-consolelog" id="consolelog"></div>
 * 
 * 
 */
var Application_WidgetConsolelog = Object.extend(Application_Widget, {
	
	sWidget: "consolelog",
	oElement: null,
	oApplication: null,
	
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Consolelog");
		}
	},
	
	startWidget: function(oCallback){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Widget Consolelog started");
		}
		
		oCallback();
	},
	
	fireAction: function(oData){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Data sent to consolelog");
		}
		console.log(oData);
	}
});
