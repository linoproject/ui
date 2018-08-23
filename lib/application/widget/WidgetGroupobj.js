/**
 * @class Application_WidgetGroupobj
 * Group Objects in order to make some collective actions
 * 
 *  <span class="x-lprjwdg-groupobj" id="group1">
			<span class="x-lprjelm x-lprjobj">btnDashboard</span>
			<span class="x-lprjelm x-lprjobj">btnRunvCheck</span>
	</span>
 * 
 * 
 */
var Application_WidgetGroupobj = Object.extend(Application_Widget, {
	
	sWidget: "groupobj",
	oElement: null,
	oApplication: null,
	
	aObject: [],
	
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Template substitutor");
		}
	},
	
	startWidget: function(oCallback){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Groupobj started");
		}
		
		$(this.oElement).find(".x-lprjelm").each(function(i,el){
			
			var aVar = $(el).attr("class").split(" ");
			
			for (var i =0; i< aVar.length; i++){
				if (aVar[i].indexOf("x-lprjobj") > -1 ){
					
					var sVar = $(el)[0].innerHTML;
					this.aObject.push(sVar);
					
				}
			}
			 
		}.bind(this))
		
		oCallback();
		
	},
	
	fireAction: function(sAction){
		if (sAction != undefined){
			for (var i=0; i< this.aObject.length; i++){
				eval ("this.oApplication.oWidgets."+this.aObject[i]+"."+sAction);
			}
		}
	}
});
