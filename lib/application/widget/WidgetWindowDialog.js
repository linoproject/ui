/**
 * @class Application_WidgetWindowdialog
 * 
 * Insert index and anchor to element
 * <div class="x-lprjwdg-windowdialog" id="winDialog1">
 * <span class="x-lprjelm x-lprjvar-wintitle">Dialog Title Here</span>
 * <p>This is the default dialog which is useful for displaying information. The dialog window can be moved, resized and closed with the 'x' icon.</p>
 * </div>
 * 
 * 
 */
var Application_WidgetWindowdialog = Object.extend(Application_Widget, {
	
	sWidget: "windowdialog",
	oElement: null,
	oApplication: null,
	
	oWindow: null,
	
	sId :"",
	sWinTitle: "",
	
	aIndexElement: null,
	
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		this.sWinTitle = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"wintitle");
		
		this.sId = $(this.oElement).attr("id");
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Window Dialog widget");
		}
		
		
	},
	
	startWidget: function(oCallback){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Dialog windows widget started");
		}
		
		var sIndexPageElement = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"wintitle");
		$(this.oElement).dialog({
			 autoOpen: false,
			 title: this.sWinTitle
		});
		
		oCallback();
		
	},
	
	fireAction: function(oData){
		
		$(this.oElement).dialog("open");
		
	}
});
