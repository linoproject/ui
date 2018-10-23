/**
 * @class Application_WidgetLabels
 * @description
 * 
 * 
 <example>
 <span class="x-lprjwdg-labels" id="wdgLabel1">
	<span class="x-lprjelm x-lprjvar-label">Text here</span>
    <span class="x-lprjelm x-lprjvar-color">red|yellow|blue|...</span>
    <span class="x-lprjelm x-lprjvar-status">info|success|warning|danger</span>
    <span class="x-lprjelm x-lprjvar-hidden">true|false</span>
</span>
</example>
 * 
 */
var Application_WidgetLabels = Object.extend(Application_Widget, {
    sWidget: "labels",
    
    oElement: null,

    bHidden: false,
    
    oLabel: null,
    sStatus: "",

    aCondition: [],
    constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Label");
		}
	},
	
	startWidget: function(oCallback){
        this.oLabel = $("<span></span>");
        oWidgetVars = this.oApplication.oLibClass.Vars.getElementVar(this.oElement);

        
        if (oWidgetVars.hidden == "true"){
            this.bHidden = true;
        }
        this.oLabel.addClass("label");

        if (oWidgetVars.status != undefined){
            
            this.sStatus = oWidgetVars.status;
            this.oLabel.addClass("label-"+oWidgetVars.status);
        }

        this.oLabel.html(oWidgetVars.label);
        
        $(this.oElement).append(this.oLabel);
        
        if (this.bHidden){
            this.oLabel.hide();
        }else{
            this.oLabel.show();
        }
        
        oCallback();
    },


    setLabel: function(sLabelText){
        this.oLabel.html(sLabelText);
    },

    setStatus: function(sStatus){
        this.oLabel.removeClass("label-"+this.sStatus);
        this.sStatus = sStatus;
        this.oLabel.addClass("label-"+sStatus);
    },

    show: function(){
        this.oLabel.show();
    },
    hide: function(){

    },

    evaluateCondition: function(){

    }
});