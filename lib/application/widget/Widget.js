/**
 * Generic widget class
 * This is a base Widget. It will be used when a non specific Widget is found. 
 */
var Application_Widget = Object.extend(Object, {
	
	
	sWidget: "generic",
	oElement: null,
	oApplication: null,
	
	sWidgetId: "",
	
	sName: "",
	iIndex: -1,

	bAutostart: false,

	/**
	* @constructor 
	* @return void
	**/
	constructor: function(){
		
	},
	
	/**
	* @public getId 
	* @description if html element has id eval this.WidgetId
	* @return void
	**/
	getId: function(){
		
		if ($(this.oElement).attr("id") != undefined){
			//TODO Catch exception String
			this.sWidgetId = $(this.oElement).attr("id");
		}
	},
	
	/**
	* @public loadWidgetLibs
	* @description load further widget library 
	* @return void
	**/
	loadWidgetLibs: function(){
		
	},
	
	/**
	* @public startWidget (async)
	* @description Starts the widget functionality after all lib and DOM is done
	* @param oCallback:Object the method to call after widget is started (maybe an async method)
	* @return void 
	**/
	startWidget: function(oCallback){
		
		oCallback();
	},
	
	/**
	 * @public fireAction
	 * @description execute the widget action
	 * @return void
	 */
	fireAction: function(){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Fire Action extend to use it");
		}
	},
	
	destroy: function(){

	}
	
});