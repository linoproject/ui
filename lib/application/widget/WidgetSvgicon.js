/**
 * @class Application_WidgetSvgicon
 * 
 * Draw sequence diagram
 * https://bramp.github.io/js-sequence-diagrams/
 * 
 * <div class="x-lprjwdg-svgicon" id="icn1">
   	<span class="x-lprjelm x-lprjvar-svgicon">path/to/file.svg</span>
   </div>
 * 
 */
var Application_WidgetSvgicon = Object.extend(Application_Widget, {
	
	sWidget: "svgicon",
	oElement: null,
	oApplication: null,
	
	sPathicon: "",

	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		this.sPathicon = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"svgicon");
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init svgicon widget");
		}
		
	},
	
	startWidget: function(oCallback){
		
		if (this.sPathicon != ""){
			this.oApplication.oLibClass.WS.simpleText(this.sPathicon,function(sSVGText){
				
				
				var oSVGHeader = $('<clr-icon/>').prop({
					"_ngcontent-c0":"",
					"shape":"vm-bug"
				});
				
				$(this.oElement).append(oSVGHeader);
				$(oSVGHeader).append(sSVGText);
				
			
				oCallback();
				
			}.bind(this));
		}else{
			oCallback();
		}
		
			
		
	}
});
