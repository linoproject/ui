/**
 * 
 * <button class="x-lprjwdg-button x-lprjvar-action-text1_getVal x-lprjvar-return-widgetvalue" id="wdgButtonGetValue">Get Value</button>
 * 
 */
var Application_WidgetButtonlogout = Object.extend(Application_Widget, {
	
	sWidget: "button",
	oElement: null,
	oApplication: null,

	sWidget: "buttonlogout",
	
	sActiveClass: "active",
	
	constructor: function(oElement, oApplication){
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init "+this.sWidget);
		}
	},


	
	startWidget: function(oCallback){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Start button listener");
		}
		
		
		$(this.oElement).bind("click", this.fireAction.bind(this));
		oCallback();
	},

	fireAction:function(){
		
		this.oApplication.oLibClass.Auth.login(function () {
			// Do nothing	
		});
		
	}
});
