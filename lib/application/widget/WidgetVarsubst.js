/**
 * @class Application_WidgetTplsubst
 * Use application vars to substitute the innerHTML element
 * 
 * <span class="x-lprjwdg-varsubst x-lprjvar-ApplicationName"></span>
 * 
 * 
 */
var Application_WidgetVarsubst = Object.extend(Application_Widget, {
	
	sWidget: "varsubst",
	oElement: null,
	oApplication: null,
	sVar: "",
	
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Var substitutor");
		}
	},
	
	startWidget: function(oCallback){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init template started");
		}
		this.sVar = $(this.oElement).attr('class').replace("x-lprjwdg-varsubst","").replace("x-lprjvar-","").replace("_",".");
		$(this.oElement).html(eval("this.oApplication.oApplicationVar."+this.sVar));
		
		oCallback();
	},

	fireAction: function(oData){
	
		if (oData != null){
			$(this.oElement).html(eval("oData."+this.sVar));
		}
	}
});
