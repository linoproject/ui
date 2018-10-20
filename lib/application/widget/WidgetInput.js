/**
 * @class Application_WidgetInput
 * @description
 * 
 * 
 <example>
 <span class="x-lprjwdg-input" id="wdgFormInputName">
	<span class="x-lprjelm x-lprjvar-label">Username</span>
	<span class="x-lprjelm x-lprjvar-name">username</span>
	<span class="x-lprjelm x-lprjvar-placeholder">Here placeholder</span>
	<span class="x-lprjelm x-lprjvar-required">true</span>
	<span class="x-lprjelm x-lprjvar-helper">Helper Text</span>
	<span class="x-lprjelm x-lprjvar-passwordmd5">true</span>
</span>
</example>
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
		oInput: $('<div class="clr-input-wrapper"><input type="text" placeholder="" name="" class="clr-input"></div>'),
		oInputLogingForm: $('<input type="text" placeholder="" name="" class="username">'),
	},
	oApplication: null,
	bActive: true,
	bLoginForm: false,

	aExternalLib:["md5.js"],

	bMD5: false,
	
	sActiveClass: "active",
	
	/**
	 * @constructor
	 * @param oElement Object HTML widget element 
	 * @param oApplication parent Object Application 
	 * @returns void
	 */
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

		if (this.oInputData.loginForm != undefined){
			if (this.oInputData.loginForm == "true"){
				this.bLoginForm = true;
			}
		}
		
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
		if (this.oInputData.type == "password"){
			$(this.oInputElement.oInput).find("input").attr("type","password");
			
			
			if (this.oInputData.passwordmd5 == "true"){
				this.bMD5 = true;
			}

		}
		if (this.oInputData.placeholder != undefined){
			
			$(this.oInputElement.oInput).find("input").attr("placeholder", this.oInputData.placeholder);
		}
		if (this.bLoginForm == true){
			
			
			if (this.oInputData.type == "password"){
				$(this.oInputElement.oInput).find("input").removeClass("username");
				$(this.oInputElement.oInput).find("input").addClass("password");
			}
			this.oInputElement.oInput = $(this.oInputElement.oInput).find("input")[0];
			$(this.oElement).after(this.oInputElement.oInput);
		}else{
			var oHeader = $('<div class="clr-form-control clr-row"></div>');
			$(this.oElement).after(oHeader);
			this.oInputElement.oElement = $('<div class="clr-control-container clr-col-xs-12 clr-col-md-10"></div>');
			oHeader.append(this.oInputElement.oElement);
			
			//$(this.oInputElement.oLabel).appendTo($(this.oInputElement.oElement));
			this.oInputElement.oElement.append(this.oInputElement.oLabel);
			this.oInputElement.oElement.append(this.oInputElement.oInput);

			this.oInputElement.oElement.append(this.oInputElement.oIcon);
			this.oInputElement.oElement.append(this.oInputElement.oHelper);
		
		}


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
		if (this.bLoginForm){
			var sVal = $(this.oInputElement.oInput).val()
			if (this.bMD5){
				return md5(sVal);
			}else{
				return sVal;
			}
			
		}else{
			return $(this.oInputElement.oInput).find("input").val();
		}
		
	}
	
});