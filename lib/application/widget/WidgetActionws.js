/**
 * @class Application_WidgetActionws
 * 
 * Run webservice then fire widget action
 * 
 * <div style="display:none;">
 *		<span class="x-lprjwdg-actionws" id="wdgActionWs">
 *			<span class="x-lprjelm x-lprjvar-ActionWs1 x-lprjws x-wdgTarget-areaWs1">../vsphere/ws1</span>
 *			<span class="x-lprjelm x-lprjvar-scheduler">60</span>
 *			<span class="x-lprjelm x-lprjvar-autostart">true</span>
 *		</span>
 *	</div>
 *
 * TODO : 
 * 1. Temporized action
 * 2. Cache results
 * 
 */
var Application_WidgetActionws = Object.extend(Application_Widget, {
	
	sWidget: "actionws",
	oElement: null,
	oApplication: null,
	
	sWidgetSubAction: null,
	
	oTimer: null,
	bTimer: false,
	iTimeout: 0,
	oData:null,
		
	oActions : {},
	oTargets : {},
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Actions");
		}
	},
	
	
	startWidget: function(oCallback){
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Instantiate and place action hooks");
		}
		
		
		// Catch action
		this.oActions =  this.oApplication.oLibClass.Vars.getElementVar(this.oElement);
		
		// Catch targets
		this.oTargets = this.oApplication.oLibClass.Vars.getElementClassValue(this.oElement, "x-wdgTarget-");
		
		
		
		// Scheduler
		this.iTimeout = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"scheduler");
		this.bTimer = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"autostart");
		if (this.bTimer != undefined && this.bTimer == "true"){
			this.bTimer = true;
		}else{
			this.bTimer = false;
		}
		if (this.iTimeout != undefined){
			this.iTimeout = parseInt(this.iTimeout);
		}else{
			this.iTimeout = 0;
		}
		
		if (this.iTimeout > 0 && this.bTimer == true){
			this.startTimer();
		}
		oCallback();
	},
	
	/** 
	 * @public fireAction
	 * steps:
	 * 1. call ws
	 * 2. attach template
	 * 3. substitute template -> need Template class //TODO Teplate class
	 */
	fireAction: function(sWidgetSubAction){

		if (sWidgetSubAction == undefined){
			sWidgetSubAction = this.sWidgetSubAction;
		}else{
			this.sWidgetSubAction = sWidgetSubAction; 
		}
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Fire ws action "+this.sWidgetId);
			this.oApplication.writeDebugMsg("Action "+sWidgetSubAction);
		}
		
		if (sWidgetSubAction != "null"){
			
			sActionObject = eval ("this.oActions."+sWidgetSubAction);
			if (sActionObject == undefined){
				sActionObject = this.oActions[0];
			}
			
		}else{
			// Execure first action 
			sActionObject = this.oActions[0];
		}
		
		this.oApplication.oLibClass.WS.simpleGet(sActionObject,function(oData){
			
			
			
			// Check data before execute fire actions
			
			if (this.oApplication.bDebug){
				this.oApplication.writeDebugMsg("Loaded data from ws");
			}
			
			if (this._checkData(oData)){
				
				
				if (sWidgetSubAction != "null"){
					eval ("this.oApplication.oWidgets."+this.oTargets[sWidgetSubAction]+".fireAction(oData)");
				}else{
					eval ("this.oApplication.oWidgets."+this.oTargets[0]+".fireAction(oData)");
				}
			}
			
		}.bind(this));
		
	},
	
	/**
	 * 
	 */
	startTimer: function(){
		this.oTimer = setInterval (this.fireAction.bind(this), this.iTimeout*1000);
	},
	
	stopTimer: function(){
		clearInterval(this.oTimer);
	},
	
	
	_checkData: function(oData){
		
		if ($.compare(this.oData, oData )){
			if (this.oApplication.bDebug){
				this.oApplication.writeDebugMsg("No data change");
			}
			return false;
		}else{
			if (this.oApplication.bDebug){
				this.oApplication.writeDebugMsg("data is changed");
			}
			this.oData = oData;
		}
		
		return true;
	}
	
	
});
