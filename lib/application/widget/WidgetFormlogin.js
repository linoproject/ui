/**
 * 
 * 
<!-- Example -->
<span class = "x-lprjwdg-formlogin" id="wdgFormLogin1" >
	<span class="x-lprjelm x-lprjvar-user">wdgFormInputName</span> 
	<span class="x-lprjelm x-lprjvar-pass">wdgFormInputPassword</span>  
	<span class="x-lprjelm x-lprjvar-login">wdgFormBtnLogin</span>  
	<span class="x-lprjelm x-lprjvar-reset">wdgFormBtnReset</span>  
</span>


 * 
 */
var Application_WidgetFormlogin = Object.extend(Application_Widget, {
	
	sWidget: "formlogin",
	oElement: null,
	oApplication: null,
	

	oFormWidget:{},

	oFormData: {},
	
	sWidgetId: "",

	sDivError: "",
	
	sName: "",
	iIndex: -1,

	/**
	 * @constructor
	 * @param oElement:object Widget HTML element
	 * @param oApplication:object main Application
	 * @returns void
	 */
	constructor: function (oElement, oApplication) {


		this.oElement = oElement;
		this.oApplication = oApplication;

		if (this.oApplication.bDebug) {
			this.oApplication.writeDebugMsg("Init FormLogin");
		}
	},

	/**
	 * @public
	 * @description Start widget: gather all variables and actions
	 * @param {*} oCallback: object callback
	 * @returns object: callback action
	 */
	startWidget: function (oCallback) {
		if (this.oApplication.bDebug) {
			this.oApplication.writeDebugMsg("Start Form listener");
		}
		this.oFormWidget = this.oApplication.oLibClass.Vars.getElementVar(this.oElement);
		this.sDivError = this.oFormWidget.elementerror;

		oCallback();
	},

	fireAction: function(){

		this._validate();
		
	},

	_validate:function(){
		// Get Username val
		var sUsername = this.oApplication.oWidgets[this.oFormWidget.user].getValue();
		if (sUsername == undefined || sUsername == ""){
			
			this.oApplication.oWidgets[this.oFormWidget.user].showAlert("Please type User Name");
			return false;
		}
		
		var sPassword = this.oApplication.oWidgets[this.oFormWidget.pass].getValue();
		if (sPassword == undefined || sPassword == "") {
			this.oApplication.oWidgets[this.oFormWidget.pass].showAlert("Please type Password");
			return false;
		}
		
		this._sendLogin(sUsername, sPassword);
	},
	_sendLogin: function(sUsername, sPassword){
		this.oApplication.oLibClass.Auth.login(sUsername, sPassword, function (bAuth, result) {
			if (bAuth == false){
				if (this.oApplication.bDebug) {
					this.oApplication.writeDebugMsg("Invalid Username or Password");
				}
				if (this.sDivError != ""){
					$("#"+this.sDivError).html("Invalid Username or Password");
					$("#"+this.sDivError).show();
				}

			}

		}.bind(this));
	}
	
});