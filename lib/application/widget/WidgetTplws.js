/**
 * @class Application_WidgetTplws
 * 
 * Substitute using webservice response data and template
 * 
 <example>
<div class="x-lprjwdg-tplws x-toggle-true x-target-tgtElement" id="areaTemplate">
 	<span class="x-lprjelm x-lprjvar-template" style="display:none">application/template/template.html</span>
	<div>
 		<ul id="tgtElement"></ul>
 	</div>
</div>
</example>

<example>
	<div class="x-lprjwdg-tplws x-lprjvar-inline" id="areaTemplate" style="display:none">application/template/template.html</div>
</example>
 */
var Application_WidgetTplws = Object.extend(Application_Widget, {
	
	sWidget: "tplws",
	oElement: null,
	oApplication: null,
	bToggle: true,
	
	sTemplateURL: "", 

	sTemplate: "",
	oTargetElement: null,

	oLibWidget: null,
	aWidget:[],
	
	

	constructor: function(oElement, oApplication){
		
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Template Webservices");
		}

		this.oLibWidget = new Application_WidgetLoader();
	},
	
	startWidget: function(oCallback){

		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init template Webservices started");
		}
		
		if (this.oApplication.oLibClass.Vars.getWidgetVar(this.oElement,"inline")){
			
			var oTemplate = $(this.oElement).html();
			this.sTemplateURL = oTemplate;
			this.bToggle = true;
			this.oApplication.oLibClass.Template.loadTemplate(oTemplate, function(sTemplate){
				this.sTemplate = sTemplate;
				$(this.oElement).html("");
				
				this.bAutostart = true;
				
				oCallback();
			}.bind(this));
			
		}else{

			var oTemplate =  this.oApplication.oLibClass.Vars.getElementVar(this.oElement);
			this.sTemplateURL = oTemplate.template;

			// Get toggle action
			if (this.oApplication.oLibClass.Vars.getWidgetVar(this.oElement,"x-toggle-") == "true"){
				this.bToggle = true;
			}
			if (this.oApplication.oLibClass.Vars.getWidgetVar(this.oElement,"x-target-") != null){
				this.oTargetElement = $("#"+this.oApplication.oLibClass.Vars.getWidgetVar(this.oElement,"x-target-"));
			}

			//TODO Load template
			this.oApplication.oLibClass.Template.loadTemplate(oTemplate.template, function(sTemplate){
				
				this.sTemplate = sTemplate;
				oCallback();
			}.bind(this));
			
			
		}
		
		
	},
	
	fireAction: function(oData){
		
		
		if (this.oApplication.oLibClass.Vars.getWidgetVar(this.oElement,"inline")){
			
			this.oApplication.oLibClass.Template.fillTemplate(this.oElement, this.sTemplate, {});
			if (this.oApplication.bDebug){
				this.oApplication.writeDebugMsg("Fire Event widget id "+this.sWidgetId);
			}
			
			this.oLibWidget.getAllWidget(this.oApplication,this.sWidgetId,function(){
			});
		}else{
			//this.oLibWidget.deleteAllWidgets(); // Delete all widgets in the area and stop all WS
			if (this.oApplication.oWidgetToggle != undefined){
				this.oApplication.oWidgetToggle.fireToggle();
				this.oApplication.oWidgetToggle = null;
			}
			
			if (this.bToggle){
				this.oApplication.oWidgetToggle = this;
			}
			
			
			if (this.oTargetElement != null){

				// Parse only if array
				if (typeof(oData) == "object"){ // TODO Show template for no results
					if (oData.length > 0){
						this.oApplication.oLibClass.Template.fillTemplate(this.oTargetElement, this.sTemplate, oData);
					}
				}
				
			}
			
			
			this.oLibWidget.getAllWidget(this.oApplication,this.sWidgetId,function(){
				
			}.bind(this));

			if (this.oApplication.bDebug){
				this.oApplication.writeDebugMsg("Fire Event widget id "+this.sWidgetId);
			}
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
	},
	destroy: function(){
		this.oLibWidget.deleteAllWidgets();
	}
});
