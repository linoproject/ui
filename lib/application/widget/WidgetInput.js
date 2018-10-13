/**
 * 
 * <span class="x-lprjwdg-input" id="wdgFormInputName">
	<span class="x-lprjelm x-lprjvar-label">Username</span>
	<span class="x-lprjelm x-lprjvar-name">username</span>
	<span class="x-lprjelm x-lprjvar-placeholder">Here placeholder</span>
	<span class="x-lprjelm x-lprjvar-required">true</span>
	<span class="x-lprjelm x-lprjvar-helper">Helper Text</span>
</span>
 * 
 */
var Application_WidgetInput = Object.extend(Application_Widget, {
	
	sWidget: "input",
	oElement: null,
	oInputData: null,
	oInputElement:{
		oElement: null,
		oLabel: $('<label for="example" class="clr-control-label clr-col-xs-12 clr-col-md-2"></label>'),
		oIcon: $('<clr-icon class="clr-validate-icon" shape=""></clr-icon>'),
		sIcon: "exclamation-circle",
		oHelper: $('<span class="clr-subtext"></span>'),
		oInput: $('<div class="clr-input-wrapper"><input type="text" placeholder="" name="" class="clr-input" required></div>')
	},
	oApplication: null,
	bActive: true,
	
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
			this.oApplication.writeDebugMsg("Start input render and listener");
		}
		this.oInputData = this.oApplication.oLibClass.Vars.getElementVar(this.oElement);
		
		if (this.oInputData.label != undefined){
			
			$(this.oInputElement.oLabel).append(this.oInputData.label);
		}else{
			this.oInputElement.oLabel = $('');
		}

		if (this.oInputData.helper != undefined) {
			$(this.oInputElement.oHelper).append(this.oInputData.helper);
		}else{
			this.oInputElement.oHelpe = $('');
		}

		$(this.oInputElement.oInput).find("input").attr("name", this.oInputData.name);
		var oHeader = $('<div class="clr-form-control clr-row"></div>');
		$(this.oElement).after(oHeader);
		this.oInputElement.oElement = $('<div class="clr-control-container clr-col-xs-12 clr-col-md-10"></div>');
		oHeader.append(this.oInputElement.oElement);
		
		//$(this.oInputElement.oLabel).appendTo($(this.oInputElement.oElement));
		this.oInputElement.oElement.append(this.oInputElement.oLabel);
		this.oInputElement.oElement.append(this.oInputElement.oInput);

		if (this.oInputData.type == "password"){
			$(this.oInputElement.oInput).find("input").attr("type","password");
		}

		this.oInputElement.oElement.append(this.oInputElement.oIcon);
		this.oInputElement.oElement.append(this.oInputElement.oHelper);
		
		if (this.oInputData.placeholder != undefined){
			
			$(this.oInputElement.oInput).find("input").attr("placeholder", this.oInputData.placeholder);
		}
		
		$(this.oInputElement).bind("focus", this.hideAlert.bind(this));

		oCallback();
		
	},

	showAlert: function(sMsg){
		this.oInputElement.oHelper.empty();
		this.oInputElement.oIcon.css("display", "block");
		this.oInputElement.oHelper.append(sMsg);
	},
	hideAlert: function(){
		this.oInputElement.oIcon.css("display", "none");
		this.oInputElement.oHelper.append("");
	},
	
	getValue: function(){
		
		return $(this.oInputElement.oInput).find("input").val();
	}
	
});