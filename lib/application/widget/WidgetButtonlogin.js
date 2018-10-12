/**
 * 
 * <button class="x-lprjwdg-button x-lprjvar-action-text1_getVal x-lprjvar-return-widgetvalue" id="wdgButtonGetValue">Get Value</button>
 * 
 */
var Application_WidgetButtonlogin = Object.extend(Application_WidgetButton, {
	
	sWidget: "buttonlogin",
	oElement: null,
	oApplication: null,
	aRequire:["WidgetButton"],
	
	
	
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Button Login");
		}
	},
	
	
	fireAction:function(){
		this.oApplication.oLibClass.Auth.login(function () {
			// Do nothing
		});
		
		
	}
});
