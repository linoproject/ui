/**
 * @class Application_WidgetTplsubst
 * Use application vars to substitute the innerHTML element
 * 
 * <span class="x-lprjwdg-var x-lprjvar-ApplicationName">VAR</span>
 * 
 * 
 */
var Application_WidgetVar = Object.extend(Application_Widget, {
	
	sWidget: "var",
	oElement: null,
	oApplication: null,
	sVar: "",
	
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Var");
		}
	},
	
	startWidget: function(oCallback){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init var started");
		}
		this.sVar = $(this.oElement).html();
		
		
		oCallback();
	},

	getVar: function(){
       
		return this.sVar;
    },
    setVar: function(sVar){
       
        this.sVar = sVar;
        $(this.oElement).html(this.sVar);
    }
});
