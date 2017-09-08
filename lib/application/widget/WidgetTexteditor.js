/**
 * 
 * <div class="x-lprjwdg-texteditor" id="txt">
 </div>
 */
var Application_WidgetTexteditor = Object.extend(Application_Widget, {
	
	sWidget: "texteditor",
	oElement: null,
	oApplication: null,
	
	sWidgetId: "",
	
	aExternalLib:["jquery-te-1.4.0.min.js"],
	aExternalCss:["jquery-te-1.4.0.css"],
	
	oTextArea: null,
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Text Editor");
		}
		
		
	},
	
	startWidget: function(oCallback){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Start Text editor");
		}
		
		$(this.oElement).append("<textarea id=\"textarea_"+this.sWidgetId+"\"></textarea>");
		this.oTextArea = $(this.oElement).find("textarea");
		$(this.oTextArea).jqte();
		oCallback();
		
	},
	
	fireAction:function(sAction){
		// Get action type
		
		if (sAction == "getVal"){
			
			return $(this.oTextArea).val();
		}
	}
	
});
