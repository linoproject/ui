var Application_Widget = Object.extend(Object, {
	
	sWidget: "generic",
	oElement: null,
	oApplication: null,
	
	sWidgetId: "",
	
	sName: "",
	iIndex: -1,
	
	
	constructor: function(){
		
	},
	
	getId: function(){
		
		if ($(this.oElement).attr("id") != undefined){
			//TODO Catch exception String
			this.sWidgetId = $(this.oElement).attr("id");
		}
	},
	
	loadWidgetLibs: function(){
		
	},
	
	startWidget: function(oCallback){
		
		oCallback();
	},
	
	/**
	 * @public fireAction
	 * execute actions here
	 */
	fireAction: function(){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Fire Action extend to use it");
		}
	}
	
});