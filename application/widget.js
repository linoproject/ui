var Application_widget = Object.extend(Object, {
	
	oApplication: null,
	
	constructor: function(oApplication){
		this.oApplication = oApplication;
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Custom Widget class loaded");
		}
		
	},
	
	autofireAction: function(){
		
		this.oApplication.oWidgets.mnu0.setActive();
		
		
	},
	unActiveAllMenus: function(){
		
		$(".nav-link").removeClass('active');
	}

	

});