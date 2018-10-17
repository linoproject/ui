/**
 * @class Application_WidgetActionws
 * @description Run webservice then fire widget action
 * 
 * @param x-lprjws Webservice
 * @param [inline x-lprjws] x-lprjvar-[actionname] Action name
 * @param [inline x-lprjws] x-wdgTarget-[target_widget_name] execute fireAction to target widget Id
 * @param x-lprjvar-schedulerws web service used in the scheduler
 * @param x-lprjvar-scheduler timeout scheduling in seconds
 * @param x-lprjvar-autostart true|false auotstart widget
 * 
 * 
 <example>
 <div style="display:none;">
 	<span class="x-lprjwdg-actionws" id="wdgActionWs">
		<span class="x-lprjelm x-lprjvar-ActionWs1 x-lprjws x-wdgTarget-areaWs1">api/action</span>
		<span class="x-lprjelm x-lprjvar-schedulerws">ActionWs1</span> 
 		<span class="x-lprjelm x-lprjvar-scheduler">60</span>
 		<span class="x-lprjelm x-lprjvar-autostart">true</span>
 	</span>
 </div>
 </example>
 *
 * 
 */
var Application_WidgetActionws = Object.extend(Application_Widget, {
	
	sWidget: "actionws",
	oElement: null,
	oApplication: null,
	
	sWidgetSubAction: null,
	
	oTimer: null,
	bTimer: false,
	bAutoexec: false,
	iTimeout: 0,
	oData:null,
		
	oActions : {},
	oTargets : {},
	
	/**
	 * @constructor
	 * @param oElement Object HTML widget element 
	 * @param oApplication parent Object Application 
	 * @return void
	 */
	constructor: function(oElement, oApplication){
		this.oTimer = null;
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Actions");
		}
	},
	
	/**
	 * @method startWidget gather all elements and optionally starts Timer
	 * @param oCallback Object function to call after widget started
	 * @return oCallback
	 */
	startWidget: function(oCallback){
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Instantiate and store actions");
		}
		
		// Catch action
		this.oActions =  this.oApplication.oLibClass.Vars.getElementVar(this.oElement);
		this.sWidgetSubAction = this.oActions.schedulerws;
		
		// Catch targets
		this.oTargets = this.oApplication.oLibClass.Vars.getElementClassValue(this.oElement, "x-wdgTarget-");
		
		// Scheduler
		this.iTimeout = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"scheduler");
		this.bAutoexec = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"autostart");
		this.iTimeout = parseInt(this.iTimeout);
		if (isNaN(this.iTimeout)){
			this.iTimeout = 0;
		}
		
		
		if (this.bAutoexec == "true"){
			
			if (this.iTimeout < 1){
				
				//this.fireAction();
				this.bAutostart = true;
			}else{
				
				this.bTimer = true;
				this.startTimer();
			}
		}
		
		oCallback();
	},
	
	/** 
	 * @public
	 * @method fireAction Fire 
	 * steps:
	 * 1. call ws
	 * 2. attach template
	 * 3. substitute template
	 * @param sWidgetSubAction if defined execute this action after ws
	 * @return void
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
			// Execute first action 
			sActionObject = this.oActions[0];
		}
		
		
		
		this.oApplication.oLibClass.WS.simpleGet(sActionObject,function(oData){
			
			if (this.oApplication.bDebug){
				this.oApplication.writeDebugMsg("Loaded data from ws");
			}

			// Check data before execute fire actions
			if (this._checkData(oData)){
				
				
				if (sWidgetSubAction != "null"){
					if ("this.oApplication.oWidgets."+this.oTargets[sWidgetSubAction] != undefined){
						
						eval ("this.oApplication.oWidgets."+this.oTargets[sWidgetSubAction]+".fireAction(oData)");
					}
				}else{
					eval ("this.oApplication.oWidgets."+this.oTargets[0]+".fireAction(oData)");
				}
			}
			
		}.bind(this));
		
	},
	
	/**
	 * @method startTimer exec @method fireAction every this.iTimeout seconds
	 * @return void
	 */
	startTimer: function(){
		this.fireAction(); // First execution
		this.oTimer = setInterval (this.fireAction.bind(this), this.iTimeout*1000);
	},
	
	/**
	 * @method stopTimer stop scheduled executuin @method fireAction 
	 * @return void
	 */
	stopTimer: function(){
		
		clearInterval(this.oTimer);
	},
	
	/**
	 * @private
	 * @method _checkData check and store data if changed from the previous load
	 * @param oData Object data coming from webservice
	 * @return bool true if data are changed
	 */
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
	},

	/**
	 * @method destroy Execute actions at destroy -> stop Timer
	 * @return void
	 */
	destroy: function(){
		
		this.stopTimer();
		
	}
	
	
});
