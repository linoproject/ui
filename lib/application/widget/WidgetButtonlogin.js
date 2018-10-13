/**
 * 
 * <button class="x-lprjwdg-buttonlogin x-lprjvar-action-login|logout">Get Value</button>
 * 
 */
var Application_WidgetButtonlogin = Object.extend(Application_Widget, {
	
	sWidget: "button",
	oElement: null,
	oApplication: null,

	sWidgetAction: null,

	sWidget: "buttonlogin",
	
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
		
		this.sWidgetAction =  this.oApplication.oLibClass.Vars.getWidgetVar(this.oElement, "x-lprjvar-action-");
		
		$(this.oElement).bind("click", this.fireAction.bind(this));
		oCallback();
	},

	fireAction:function(){
		console.log (this.sWidgetAction);
		if (this.sWidgetAction == "login"){
			this.oApplication.oLibClass.Auth.login(function () {
				// Do nothing	
			});
		}else if (this.sWidgetAction == "logout"){
			
			this.oApplication.oLibClass.Auth.logout(function () {
				// Do nothing	
			});
		}
		
		
	}
});
