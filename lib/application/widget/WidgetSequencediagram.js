/**
 * @class Application_WidgetDiagram
 * 
 * Draw sequence diagram
 * https://bramp.github.io/js-sequence-diagrams/
 * 
 * <div class="x-lprjwdg-sequencediagram" id="seq1">
   	<span class="x-lprjelm x-lprjvar-sequence">
   		A->B: Message
   	</span>
   </div>
 * 
 */
var Application_WidgetSequencediagram = Object.extend(Application_Widget, {
	
	sWidget: "index",
	oElement: null,
	oApplication: null,
	
	aExternalLib:["webfont.js","snap.svg-min.js","underscore-min.js","sequence-diagram-min.js"],

	//sTheme: "hand",
	sTheme: "simple",
	sDiagramText:"",
	
	oDiagram: null,
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
	},
	
	startWidget: function(oCallback){
		
		var aDiagramText = this.oApplication.oLibClass.Vars.findElementVarInnertext(this.oElement,"sequence");
		
		if (Object.prototype.toString.call(aDiagramText) == "[object Array]"){
			for (var i=0; i < aDiagramText.length; i++){
				this.sDiagramText += aDiagramText[i]+"\n";
			}
		}else{
			this.sDiagramText = aDiagramText;
		}
		
		// Load library		
		this.oDiagram = Diagram.parse(this.sDiagramText);
		this.oDiagram.drawSVG(this.oElement, {theme: this.sTheme});
		
		oCallback();
	}
});
