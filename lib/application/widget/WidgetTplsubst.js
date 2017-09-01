/**
 * @class Application_WidgetTplsubst
 * Use application vars to substitute the innerHTML element
 * 
 * <div class="x-lprjwdg-tplsubst starter-template">
 *     <span class="x-lprjelm x-lprjvar-ApplicationName"></span>
 * </div>
 * 
 * 
 */
var Application_WidgetTplsubst = Object.extend(Application_Widget, {
	
	sWidget: "tplsubst",
	oElement: null,
	oApplication: null,
	
	
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
		$(this.oElement).find(".x-lprjelm").each(function(i,el){
			
			
			aVar = $(el).attr("class").split(" ");
			
			for (var i =0; i< aVar.length; i++){
				if (aVar[i].indexOf("x-lprjvar-") > -1 ){
					sVar = aVar[i].replace("x-lprjvar-","").replace("_",".");
					
					//TODO Check here for element type
					eval("el.innerHTML = this.oApplication.oApplicationVar."+sVar);
				}
			}
			 
		}.bind(this))
		oCallback();
	}
});
