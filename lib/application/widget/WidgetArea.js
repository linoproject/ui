/**
 * @class Application_WidgetArea
 * 
 * Show Multiple Content in Area div
 * 
 * <div class="x-lprjwdg-tplarea" id="area1">
      <span class="x-lprjelm x-lprjvar-default" style="display:none">0</span>
	  
      <div class="x-div-0">
	  <span class="x-lprjelm x-lprjvar-tplhtmlurl" style="display:none">/path/to/file.html</span>
	  <div>
     </div>
 *			
 * 
 */
var Application_WidgetArea = Object.extend(Application_Widget, {
	
	sWidget: "area",
	oElement: null,
	oApplication: null,
	
	iOpenArea :0,
	
	aArea: [],

	aWidgetArea:[],
	
	
	sActiveElement: null,
	oLibWidget: null,
	
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
	
	startWidget: function(oCallback){
		this.oApplication.aWidgetsAutostart.push($(this.oElement).attr("id"));
		oCallback();
	},
	
	fireAction: function(sMethod, sParam){
		this.oLibWidget.deleteAllWidgets();

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
	
	
	opendiv: function(iArea, oCallback){
		
		$(this.aArea[this.iOpenArea]).hide();
		this.iOpenArea = iArea;

		//this.oLibWidget.deleteAllWidgets();
		
		// Get HTML template url
		sTemplateUrl = this.oApplication.oLibClass.Vars.findElementVar($(this.aArea[this.iOpenArea]),"tplhtmlurl");
		
		if (sTemplateUrl == undefined || sTemplateUrl == ""){
			$(this.aArea[this.iOpenArea]).show();
			if (oCallback != undefined){
				oCallback();
			}
		}else{
			this.oApplication.oLibClass.Template.loadTemplate(sTemplateUrl, function(sTemplate){
					var oArea = $(this.aArea[this.iOpenArea]).find(".x-div-area-tgt");
					
					$(oArea[0]).html(sTemplate);
					$(this.aArea[this.iOpenArea]).show();
					
					
					this.oLibWidget.getAllWidgetsFromId(this.oApplication,$(this.oElement).attr("id"),function(){
						if (oCallback != undefined){
							oCallback();
						}
					});
					
			}.bind(this));
			
		}
		
	}
});
