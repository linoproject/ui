/**
 * @class Application_WidgetTplws
 * 
 * Substitute using webservice response data and template
 * 
 * <div class="x-lprjwdg-tplws x-toggle-true x-target-tgtElement" id="areaTemplate">
 *     <span class="x-lprjelm x-lprjvar-template" style="display:none">application/template/template.html</span>
 *      
 *		<div>
 *			<ul id="tgtElement"></ul>
 *		</div>
 *	  </div>
 * 
 * 
 */
var Application_WidgetTplws = Object.extend(Application_Widget, {
	
	sWidget: "tplsubst",
	oElement: null,
	oApplication: null,
	bToggle: true,
	
	sTemplate: "",
	oTargetElement: null,
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Template substitutor");
		}
	},
	
	startWidget: function(oCallback){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init template started");
		}
		
		oTemplate =  this.oApplication.oLibClass.Vars.getElementVar(this.oElement);
		
		//TODO Load template
		this.oApplication.oLibClass.Template.loadTemplate(oTemplate.template, function(sTemplate){
			this.sTemplate = sTemplate;
		}.bind(this));
		
		// Get toggle action
		if (this.oApplication.oLibClass.Vars.getWidgetVar(this.oElement,"x-toggle-") == "true"){
			this.bToggle = true;
		}
		if (this.oApplication.oLibClass.Vars.getWidgetVar(this.oElement,"x-target-") != null){
			this.oTargetElement = $("#"+this.oApplication.oLibClass.Vars.getWidgetVar(this.oElement,"x-target-"));
		}
		
		oCallback();
	},
	
	fireAction: function(oData){
		
		if (this.oApplication.oWidgetToggle != undefined){
			this.oApplication.oWidgetToggle.fireToggle();
			this.oApplication.oWidgetToggle = null;
		}
		
		if (this.bToggle){
			this.oApplication.oWidgetToggle = this;
		}
		
		if (this.oTargetElement != null){
			this.oApplication.oLibClass.Template.fillTemplate(this.oTargetElement, this.sTemplate, oData);
		}
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Fire Event widget id "+this.sWidgetId);
		}
		
		// Set element visible
		$(this.oElement).show();
	},
	
	
	fireToggle: function(){
		
		//TODO Check if element is visible
		$(this.oElement).hide();
		if (this.oTargetElement != null){
			$(this.oTargetElement).html("");
		}
	}
});
