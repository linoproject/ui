/**
 * @class Application_WidgetArea
 * 
 * @description Show Dynamic Content in Area div
 * 
 * @param x-lprjvar-default default div to open
 * @param x-div-area div content (index [0..n] will base on document order)
 * @param [inside x-div] x-lprjvar-tplhtmlurl url for dynamic content (a widget parse will take place)
 * 
<example>
<div class="x-lprjwdg-tplarea" id="area1">
    <span class="x-lprjelm x-lprjvar-default" style="display:none">0</span>	  
    <div class="x-div-area">
		<span class="x-lprjelm x-lprjvar-tplhtmlurl" style="display:none">/path/to/file.html</span>
		<div class="x-div-area-tgt"></div>
	<div>
	<div class="x-div-area">
		Static Content here
	<div>
</div>
</example>
 *			
 * 
 */
var Application_WidgetArea = Object.extend(Application_Widget, {
	
	sWidget: "area",
	oElement: null,
	oApplication: null,
	
	
	iOpenArea :0,
	
	aArea: [],
	aDynArea: [],

	aWidgetArea:[],
	
	
	sActiveElement: null,
	oLibWidget: null, // Is initantiated during object construction

	
	
	/**
	 * @constructor
	 * @param oElement Object HTML widget element 
	 * @param oApplication parent Object Application 
	 * @return void
	 */
	constructor: function(oElement, oApplication){
		this.oLibWidget = null;
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		this.oLibWidget = new Application_WidgetLoader();
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Template Area");
		}
		sDefaultArea = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"default");
		if (sDefaultArea != null){
			
			this.iOpenArea = parseInt(sDefaultArea);
		}
		
		
	},
	
	/**
	 * @method startWidget
	 * @param oCallback Object function to call after widget started
	 * @return oCallback
	 */
	startWidget: function(oCallback){

		//this.oApplication.aWidgetsAutostart.push(this.sWidgetId);
		this.bAutostart = true;
		oCallback();
	},
	
	/**
	 * @method fireAction
	 * @param sMethod String (if null will open default div)
	 * @param sParam
	 * @return void
	 */
	fireAction: function(sMethod, sParam){
	
		if (sMethod == undefined && sParam == undefined){
			this.aArea = $(this.oElement).find(".x-div-area");
				this.opendiv(this.iOpenArea, function(){
			});
		}else{
			try{
				eval("this."+sMethod+"("+sParam+")")
			}catch(e){
				console.log("ERROR No method "+sMethod+" defined");
			}
		}
	},
	
	/**
	 * @method opendiv
	 * @async
	 * @param iArea index are to open
	 * @param oCallback Object function to call after div load + display
	 * @return oCallback
	 */
	opendiv: function(iArea, oCallback){
		
		
		$(this.aArea[this.iOpenArea]).hide();
		this.iOpenArea = iArea;

		// Get HTML template url
		sTemplateUrl = this.oApplication.oLibClass.Vars.findElementVar($(this.aArea[this.iOpenArea]),"tplhtmlurl");
		
		if (sTemplateUrl == undefined || sTemplateUrl == ""){
			$(this.aArea[this.iOpenArea]).show();
			if (oCallback != undefined){
				oCallback();
			}
		}else{
			
			this.oLibWidget.deleteAllWidgets(); // Delete all widgets in the area and stop all WS
			
			this.oApplication.oLibClass.Template.loadTemplate(sTemplateUrl, function(sTemplate){
					
					this.purgeDynArea();
					this.aDynArea[this.iOpenArea] = this.aArea[this.iOpenArea]; 
					var oArea = $(this.aArea[this.iOpenArea]).find(".x-div-area-tgt");
					
					$(oArea[0]).html(sTemplate);
					$(this.aArea[this.iOpenArea]).show();
					this.oLibWidget.getAllWidget(this.oApplication,this.sWidgetId,function(){ // Re-Parse here
						
						if (oCallback != undefined){
							oCallback();
						}
					});
					
			}.bind(this));
			
		}
		
	},

	purgeDynArea: function(){
		for (var i=0;i< this.aDynArea.length ; i++){
			$(this.aDynArea[i]).find(".x-div-area-tgt").html("");
		}
	},
	destroy: function () {
		this.oLibWidget.deleteAllWidgets();
	}
});
