/**
 *
 * @class Application_WidgetActionobj
 * 
 * Execute JS object or widget method on fire action
 * 
 * <span class="x-lprjwdg-actionobj" id="wdgAction1">
		<span class="x-lprjelm x-lprjvar-Action1">Application_index.action(0)|Application2_index.action(1)|...</span> 
	</span>
 *
 * 
 * 
 */
var Application_WidgetActionobj = Object.extend(Application_Widget, {
	
	sWidget: "actionobj",
	oElement: null,
	oApplication: null,
	
	
	oActions : {},
	
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
		
		oCallback();
	},
	
	
	fireAction: function(sWidgetSubAction){
		
		
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Fire action object");
		}

		this.oApplication.oLibClass.Action.evalMultipleActionsSub(this.oApplication, this.oActions,sWidgetSubAction );

	},
	
	
});
