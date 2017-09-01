/**
 * @class Application_WidgetIndex
 * 
 * Insert index and anchor to element
 * 
 *   <div class="x-lprjwdg-index" id="index1">
  	<span class="x-lprjelm x-lprjvar-elemtitle">h2</span>
  </div>
 * 
 * 
 */
var Application_WidgetIndex = Object.extend(Application_Widget, {
	
	sWidget: "index",
	oElement: null,
	oApplication: null,
	
	sId :"",
	
	aIndexElement: null,
	
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		this.sId = $(this.oElement).attr("id");
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Index widget");
		}
		
		
	},
	
	startWidget: function(oCallback){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Index widget started");
		}
		
		var sIndexPageElement = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"elemtitle");
		
		
		
		if (sIndexPageElement != ""){
			this.aIndexElement = $(sIndexPageElement);
			for (var i=0; i < this.aIndexElement.length; i++){
				sTarget = this.sId+"_"+i;
				
				
				this._appendContent(this.aIndexElement[i].innerHTML, sTarget);
				this._anchorElement(this.aIndexElement[i], sTarget);
			}
			// Append content
			oCallback();
		}else{
			oCallback();
		}

	},
	
	_appendContent: function(sIndex, sTarget){
		$(this.oElement).append("<a href=\"#"+sTarget+"\">"+sIndex+"</a><br>");
	},
	
	_anchorElement: function(oElement, sTarget){
		
		$(oElement).append("<a name=\""+sTarget+"\"></a>");
	}
});
