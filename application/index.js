var Application_index = Object.extend(Object, {
	
	oApplication: null,
	
	constructor: function(oApplication){
		this.oApplication = oApplication;
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Custom Index class loaded");
		}
		
	},
	
	autofireAction: function(){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Action ws host execution");
		}
		this.oApplication.oWidgets.wdgButtonService1.fireAction();
		
	},
	
	action1: function(){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Action1 executed");
		}
	},
	
	unActiveAllMenus: function(){
		$(".nav-link").removeClass('active');
	}

	

});