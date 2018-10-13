/**
 * 
 * <button class="x-lprjwdg-button x-lprjvar-action-text1_getVal x-lprjvar-return-widgetvalue" id="wdgButtonGetValue">Get Value</button>
 * 
 */
var Application_WidgetButton = Object.extend(Application_Widget, {
	
	sWidget: "button",
	oElement: null,
	oApplication: null,
	
	//Custom actions
	sWidgetAction: null,
	sWidgetSubAction: null,
	sWidgetSubActionParam: null,
	sWidgetActionReturn:null,
	
	sActiveClass: "active",
	
	
	constructor: function(oElement, oApplication){
		
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Button");
		}
	},
	
	startWidget: function(oCallback){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Start button listener");
		}
		
		//TODO verify x-lprjvar-actionobj
		this.sWidgetAction =  this.oApplication.oLibClass.Vars.getWidgetVar(this.oElement, "x-lprjvar-actionobj-");
		
		if (this.sWidgetAction == undefined){
			this.sWidgetAction = this.oApplication.oLibClass.Vars.getWidgetVar(this.oElement, "x-lprjvar-action-");
			
			
			// Element return here
			this.sWidgetActionReturn = this.oApplication.oLibClass.Vars.getWidgetVar(this.oElement, "x-lprjvar-return-");
			
		}
		
		if (this.sWidgetAction != undefined){
			aAction = this.sWidgetAction.split("_");	
			if (aAction.length > 0){
				this.sWidgetAction = aAction[0];
				this.sWidgetSubAction = aAction[1];
				
				if (aAction.length > 2){
					this.sWidgetSubActionParam = aAction[2];
				}
				
			}
		}
		
		$(this.oElement).bind("click", this.fireAction.bind(this));
		oCallback();
	},
	
	fireAction:function(){
		
		
		if (this.sWidgetAction != null){
			
			if (this.sWidgetAction == "AuthLogout"){
				this.oApplication.oLibClass.Auth.logout(function(){
					// Do nothing
				});
			}else{

				oData = eval("this.oApplication.oWidgets."+this.sWidgetAction+".fireAction('"+this.sWidgetSubAction+"','"+this.sWidgetSubActionParam+"')");
				
				if (this.sWidgetActionReturn != null){
					eval("this.oApplication.oWidgets."+this.sWidgetActionReturn+".fireAction(oData)");
				}
			}
			
		}
		
	},
	
	setActive(sClass){
	
		console.log("Set active");
		if (sClass != undefined){
			
			this.sActiveClass = sClass;
		}
		$(this.oElement).addClass(this.sActiveClass);
	},
	
	setUnActive(){
		
		$(this.oElement).removeClass(this.sActiveClass);
	}
});