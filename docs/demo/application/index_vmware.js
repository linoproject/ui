var Application_index_vmware = Object.extend(Object, {
	
	oApplication: null,
	
	constructor: function(oApplication){
		this.oApplication = oApplication;
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Custom Index class loaded");
		}
		
	},
	
	autofireAction: function(){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Auto open first menu");
		}
		this.oApplication.oWidgets.mnu0.fireAction();
		
	},
	
	unActiveAllMenus: function(){
		$(".nav-link").removeClass('active');
	}

	

});