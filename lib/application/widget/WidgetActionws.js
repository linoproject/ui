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
		<span class="x-lprjelm x-lprjvar-ActionWs1 x-lprjws x-wdgTarget-areaWs1 x-lprjAutostart">api/action</span>
		<span class="x-lprjelm x-lprjvar-ActionWs2 x-lprjws x-wdgTarget-areaWs2 x-lprjForceUpdate">api/action</span>
		<span class="x-lprjelm x-lprjvar-ActionWs3 x-lprjws x-wdgTarget-areaWs2 x-lprjAuth">api/action</span>
		<span class="x-lprjelm x-lprjvar-schedulerws">ActionWs1</span> 
 		<span class="x-lprjelm x-lprjvar-scheduler">60</span>
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
	
	oTimer: null,
	bTimer: false,
	iTimeout: 0,

	bAutostart: false,
	
	aActions: [], // All WS
	oAction:{},
	aAutoexec: [],
	aScheduledAction: [],

	sDefultAction:"",
	
	
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
			this.oApplication.writeDebugMsg("Init ActionsWS ");
			
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
		oData =  this.oApplication.oLibClass.Vars.getElementVar(this.oElement);
		

		aElements = $(this.oElement).find(".x-lprjws");
		for (var i=0; i < aElements.length; i++){
		
			var sId = this.oApplication.oLibClass.Vars.getWidgetVar(aElements[i], "x-lprjvar-");
			var bAutoexec = this.oApplication.oLibClass.Vars.getWidgetVar(aElements[i], "lprjAutostart");
			if (bAutoexec != null){
				bAutoexec = true;
				this.bAutostart = true;
			}else{
				bAutoexec = false;
			}

			var bForceUpdate = this.oApplication.oLibClass.Vars.getWidgetVar(aElements[i], "lprjForceUpdate");
			if (bForceUpdate != null){
				bForceUpdate = true;
				
			}else{
				bForceUpdate = false;
			}
			
			var bAuth = this.oApplication.oLibClass.Vars.getWidgetVar(aElements[i], "lprjAuth");
			if (bAuth != null){
				bAuth = true;
				
			}else{
				bAuth = false;
			}
			var sUrl = $(aElements[i]).html()
			//Check url contains path vars like http://url/{{var}}
			var aVars = sUrl.match(/\{\{(.*)\}\}/);
			if (aVars != undefined){
				for (var k=0; k < aVars.length; k++){
					sVar = aVars[k].replace("{{","").replace("}}","");
					if (eval ("this.oApplication.oWidgets."+sVar)!= undefined){
						var sVal = eval ("this.oApplication.oWidgets."+sVar+".getVar()");
					}
					sUrl = sUrl.replace("{{"+sVar+"}}",sVal);
				}
			}

			this.aActions[i] = {
				id: sId,
				url: sUrl,
				target: this.oApplication.oLibClass.Vars.getWidgetVar(aElements[i], "x-wdgTarget-"),
				bAutoexec: bAutoexec,
				bForceUpdate:bForceUpdate,
				bAuth:bAuth
			};

			this.oAction[sId] = {
				id: sId,
				url: sUrl,
				target: this.oApplication.oLibClass.Vars.getWidgetVar(aElements[i], "x-wdgTarget-"),
				bAutoexec: bAutoexec,
				bForceUpdate:bForceUpdate,
				bAuth:bAuth
			};
		}

		// Scheduler
		this.iTimeout = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"scheduler");
		this.iTimeout = parseInt(this.iTimeout);
		if (isNaN(this.iTimeout)){
			this.iTimeout = 0;
		}
		
		this.sDefultAction = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"schedulerws");

		if (this.bAutostart){
			if (this.iTimeout >= 1){
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
	fireAction: function(sWidgetAction){

		if (sWidgetAction == undefined){
			// Execute only the first
			if (this.sDefultAction){
				sWidgetAction = this.sDefultAction;
				
			}else{
				sWidgetAction = this.aActions[0].sId;
			}
			
		}
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Fire ws action "+this.sWidgetId);
			this.oApplication.writeDebugMsg("Executing Action "+sWidgetAction);
		}
		
		
		var oAction = this.oAction[sWidgetAction];

		if (oAction.bAuth){
			this.oApplication.oLibClass.WS.simpleAuthGet(oAction.url,this.oApplication.oLibClass.Auth.sToken,function(oData){
			
				if (this.oApplication.bDebug){
					this.oApplication.writeDebugMsg("Loaded data from ws");
				}
	
				// Check data before execute fire actions
				if (this._checkData(oData)){
					
					try{
						eval ("this.oApplication.oWidgets."+oAction.target+".fireAction(oData)");
					
					}catch(e){
						// Split target and subtarget
						var aTarget = oAction.target.split("_");
						eval ("this.oApplication.oWidgets."+aTarget[0]+".fireAction('"+aTarget[1]+"')");
						
					}
					
				}else if (oAction.bForceUpdate){
					try{
						eval ("this.oApplication.oWidgets."+oAction.target+".fireAction(oData)");
					
					}catch(e){
						// Split target and subtarget
						var aTarget = oAction.target.split("_");
						eval ("this.oApplication.oWidgets."+aTarget[0]+".fireAction('"+aTarget[1]+"')");
						
					}
				}
	
				
				
			}.bind(this));
		
		}else{
			this.oApplication.oLibClass.WS.simpleGet(oAction.url,function(oData){
			
				if (this.oApplication.bDebug){
					this.oApplication.writeDebugMsg("Loaded data from ws");
				}
	
				// Check data before execute fire actions
				if (this._checkData(oData)){
					
					try{
						eval ("this.oApplication.oWidgets."+oAction.target+".fireAction(oData)");
					
					}catch(e){
						// Split target and subtarget
						var aTarget = oAction.target.split("_");
						eval ("this.oApplication.oWidgets."+aTarget[0]+".fireAction('"+aTarget[1]+"')");
						
					}
					
				}else if (oAction.bForceUpdate){
					try{
						eval ("this.oApplication.oWidgets."+oAction.target+".fireAction(oData)");
					
					}catch(e){
						// Split target and subtarget
						var aTarget = oAction.target.split("_");
						eval ("this.oApplication.oWidgets."+aTarget[0]+".fireAction('"+aTarget[1]+"')");
						
					}
				}
	
				
				
			}.bind(this));
		}
		
		
		
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
