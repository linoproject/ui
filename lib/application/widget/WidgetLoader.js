/**
 * @class Application_Vars
 * @description class loading and parsing widget with
 * - Widget lib
 * - External libs
 * - CSS external libs
 * - Start widget
 * - insert autoexec widgets
 */
var Application_WidgetLoader = Object.extend(Object, {

	oApplication: null,

	// Widget Area
	iWidgetToLoad: 0,
	iWidgetLoaded: 0,

	iWidgetExtraLoad: 0,
	iWidgetExtraLoaded: 0,

	iWidgetExtraCssLoad: 0,
	iWidgetExtraCssLoaded: 0,


	iWidgetStarted: 0,

	aWidgetToinstantiate:[],
	iWidgetInstantiated: 0,

	oWidgetId: {},
	aWidget: [],
	aWidgetClass: [],

	aExtraLib: [],
	aExtraLibWidget: [],

	aRequireWidget: [],

	aExtraCss: [],
	aExtraCssWidget: [],


	_callbackLoadStartWidget: null,
	
	/**
	 * @constructor 
	 * @returns void
	 */
	constructor: function () {
		this.iWidgetToLoad = 0;
		this.iWidgetLoaded = 0;

		this.iWidgetExtraLoad= 0;
		this.iWidgetExtraLoaded =0;

		this.iWidgetExtraCssLoad= 0;
		this.iWidgetExtraCssLoaded= 0;


		this.iWidgetStarted= 0;

		this.aWidgetToinstantiate=[];
		this.iWidgetInstantiated= 0;

		this.aWidget = [];
		this.oWidgetId = {};

		this.aWidgetAutostart = [];
	},

	/**
	 * @async
	 * @method getAllWidget Get all available widget
	 * @param oApplication
	 * @param sId id or null for the html document
	 * @param oCallback
	 * @returns oCallback
	 */
	getAllWidget: function (oApplication,sId, oCallBack) {
		

		this.oApplication = oApplication;
		this._callbackLoadStartWidget = oCallBack;
		if (sId == undefined){
			var aElWidget = $('*[class^="x-lprjwdg"]');
		}else{
			var aElWidget = $("#"+sId).find('*[class^="x-lprjwdg"]');
		}

		if (aElWidget.length > 0) {
			
			this.iWidgetToLoad = aElWidget.length;
			
			if (typeof (Application_Widget) == "undefined") {


				$.ajax({
					url: this.oApplication.oApplicationVar.DirLib + "/application/widget/Widget.js?rnd=" + new Date().getTime(),
					dataType: "script",
					success: function () {

						this._listWidget(aElWidget);
					}.bind(this)
				});
			} else {
				this._listWidget(aElWidget);
			}
		} else {
			//this._callbackLoadApplicatonClass(this);

			this._callbackLoadStartWidget(this);
		}



	},

	
	deleteAllWidgets: function(){
		
		for (var i=0; i < this.aWidget.length; i++){
			this.oApplication.oWidgets[this.aWidget[i].sWidgetId].destroy();
			this.oApplication.oWidgets[this.aWidget[i].sWidgetId] = undefined;
		}

		this.iWidgetToLoad = 0;
		this.iWidgetLoaded = 0;

		this.iWidgetExtraLoad= 0;
		this.iWidgetExtraLoaded =0;

		this.iWidgetExtraCssLoad= 0;
		this.iWidgetExtraCssLoaded= 0;


		this.iWidgetStarted= 0;

		this.aWidgetToinstantiate=[];
		this.iWidgetInstantiated= 0;

		this.aWidget = [];
		this.oWidgetId = {};
	},

	/**
	 * @private _listWidget
	 * Execute the list of getted widget
	 */
	_listWidget: function (aElWidget) {
		for (var i = 0; i < aElWidget.length; i++) {

			var aClassName = $(aElWidget[i]).attr("class").split(" ");

			for (var k = 0; k < aClassName.length; k++) {
				
				if (aClassName[k].indexOf("x-lprjwdg-") > -1) {
					var sWidgetType = aClassName[k].replace("x-lprjwdg-", "");
					sWidgetType = sWidgetType.charAt(0).toUpperCase() + sWidgetType.slice(1);
					// Check already ID before instantiate again
					
					var sId = $(aElWidget[i]).attr("id");
					
					if (sId == undefined || this.oApplication.oWidgets[sId] != undefined || this.oWidgetId[sId] != undefined){
						
						this.iWidgetToLoad--;
						if (this.oApplication.bDebug) {
							this.oApplication.writeDebugMsg("No or duplicate id");
						}
					}else{
						this.oWidgetId[sId] = aElWidget[i];
						this._instantiateWidget(aElWidget[i], sWidgetType);
					}

				}

			}


		}
	},

	

	/**
	 * @private _instantiateWidget
	 * Instantiate the widget
	 */
	_instantiateWidget: function (oElement, sWidgetName) {
		
	
		if (eval("typeof(Application_Widget" + sWidgetName + ")") == "undefined") {
			var sData = "";
			$.ajax({
				url: this.oApplication.oApplicationVar.DirLib + "/application/widget/Widget" + sWidgetName + ".js?rnd=" + new Date().getTime(),
				dataType: "script",
				success: function (sData) {
					this._instantiateWidgetCall(oElement, sWidgetName);
					
			
				}.bind(this),
				error: function () {

					if (this.bDebug) {
						this.writeDebugMsg("No widget available!");
					}

					this.aWidget[this.iWidgetLoaded] = new Application_Widget();
					this.aWidgetClass[this.iWidgetLoaded] = "widget";
					this.iWidgetLoaded++;
					this._checkLoadedWidget();
				}.bind(this)
			});
		} else {
			
			this._instantiateWidgetCall(oElement, sWidgetName);
			/*this.aWidget[this.iWidgetLoaded] = new Application_Widget();
			this.iWidgetLoaded++;
			this._checkLoadedWidget();*/
		}
	},

	_instantiateWidgetCall: function (oElement, sWidgetName) {
		
		
		eval("this.aWidget[this.iWidgetLoaded] = new Application_Widget" + sWidgetName + "(oElement,this.oApplication)");
		
		this.aWidgetClass[this.iWidgetLoaded] = sWidgetName;

		

		if ($(oElement).attr("id") != undefined) {
			var sWidgetId = $(oElement).attr("id");
		} else {
			var sWidgetId = sWidgetName + "_" + new Date().getTime();
		}

		this.aWidget[this.iWidgetLoaded].sWidgetId = sWidgetId;
		eval("this.oApplication.oWidgets." + this.aWidget[this.iWidgetLoaded].sWidgetId + " = this.aWidget[this.iWidgetLoaded];");


		this.iWidgetLoaded++;
		this._checkLoadedWidget();
	},

	/**
	 * @private _checkLoadedWidget
	 * Check if all widget are loaded
	 */
	_checkLoadedWidget: function () {

		
		if (this.iWidgetToLoad == this.iWidgetLoaded) {
			
			//this.startWidget();
			this.loadExternalLib();
		}
	},

	/**
	 * Load widget library
	 */
	loadExternalLib: function () {
		
		
		if (this.iWidgetToLoad == 0) {
			if (this.oApplication.bDebug) {

				this.oApplication.writeDebugMsg("Nothing extra to load");
			}
			this.loadExternalCss(); //oCallback();
		} else {

			for (var i = 0; i < this.aWidget.length; i++) {

				if (this.aWidget[i].aExternalLib != undefined) {

					for (var k = 0; k < this.aWidget[i].aExternalLib.length; k++) {

						//Check already loaded widget external lib

						if (this.aExtraLibWidget[this.aWidgetClass[i] + "_" + this.aWidget[i].aExternalLib[k]] == undefined) {

							this.aExtraLibWidget[this.aWidgetClass[i] + "_" + this.aWidget[i].aExternalLib[k]] = "loaded";
							this.aExtraLib[this.iWidgetExtraLoad] = this.aWidgetClass[i] + "/" + this.aWidget[i].aExternalLib[k];
							this.iWidgetExtraLoad++;
						}


					}

				}
			}


			if (this.aExtraLib.length == 0) {
				this.loadExternalCss();
			} else {
				this._loadExternalLib(this.aExtraLib[this.iWidgetExtraLoaded]);
			}


		}
	},

	_loadExternalLib: function (sJs) {
		$.ajax({
			url: this.oApplication.oApplicationVar.DirWidget + "/Widget" + sJs + "?rnd=" + new Date().getTime(),
			dataType: "script",
			success: function (oData) {
				this.iWidgetExtraLoaded++;
				this._checkLoadedExternalLib();
			}.bind(this),
			error: function () {
				this.iWidgetExtraLoaded++;
				this._checkLoadedExternalLib();
			}.bind(this)
		});
	},

	/**
	 * Check Exteral lib loaded
	 */
	_checkLoadedExternalLib: function () {
		
		if (this.iWidgetExtraLoad == this.iWidgetExtraLoaded) {
			
			this.loadExternalCss();
			//this.loadExternalLib();
		} else {
			this._loadExternalLib(this.aExtraLib[this.iWidgetExtraLoaded]);
		}
	},


	/**
	 * Load widget CSS
	 */
	loadExternalCss: function () {

		if (this.iWidgetToLoad == 0) {
			if (this.oApplication.bDebug) {

				this.oApplication.writeDebugMsg("Nothing to extra CSS load");
			}
			this.startWidget(); //oCallback();
		} else {

			for (var i = 0; i < this.aWidget.length; i++) {

				if (this.aWidget[i].aExternalCss != undefined) {

					for (var k = 0; k < this.aWidget[i].aExternalCss.length; k++) {

						//Check already loaded widget external lib

						if (this.aExtraCssWidget[this.aWidgetClass[i] + "_" + this.aWidget[i].aExternalCss[k]] == undefined) {

							this.aExtraCssWidget[this.aWidgetClass[i] + "_" + this.aWidget[i].aExternalCss[k]] = "loaded";
							this.aExtraCss[this.iWidgetExtraCssLoad] = this.aWidgetClass[i] + "/" + this.aWidget[i].aExternalCss[k];
							this.iWidgetExtraCssLoad++;
						}


					}

				}
			}


			if (this.aExtraCss.length == 0) {
				this.startWidget();
			} else {
				this._loadExternalCss(this.aExtraCss[this.iWidgetExtraCssLoaded]);
			}


		}
	},

	_loadExternalCss: function (sJs) {

		var sCssUrl = this.oApplication.oApplicationVar.DirWidget + "/Widget" + sJs + "?rnd=" + new Date().getTime();
		$('<link rel="stylesheet" type="text/css" href="' + sCssUrl + '" >').appendTo("head");
		this.iWidgetExtraCssLoaded++;
		this._checkLoadedExternalCss();
	},

	/**
	 * Check Exteral css loaded
	 */
	_checkLoadedExternalCss: function () {

		if (this.iWidgetExtraCssLoad == this.iWidgetExtraCssLoaded) {
			
			
			this.startWidget();
			//this.loadExternalLib();
		} else {
			this._loadExternalCss(this.aExtraCss[this.iWidgetExtraCssLoaded]);
		}
	},

	/**
	 * Start all widget
	 */
	startWidget: function () {
		
		
		if (this.iWidgetToLoad == 0) {
			if (this.oApplication.bDebug) {
				this.oApplication.writeDebugMsg("Nothing to start");
			}

			this._callbackLoadStartWidget();
		} else {
			//Starting all widgets
			this.aWidget[this.iWidgetStarted].startWidget(this._checkStartedWidget.bind(this));

		}

	},

	/**
	 * @private _checkStartedWidget 
	 */
	_checkStartedWidget: function () {

		
		this.aWidget[this.iWidgetStarted].getId();
		if (this.aWidget[this.iWidgetStarted].sWidgetId != "") {
			if (this.oApplication.bDebug) {
				this.oApplication.writeDebugMsg("Started ID: " + this.aWidget[this.iWidgetStarted].sWidgetId);
			}

			//eval("this.oApplication.oWidgets." + this.aWidget[this.iWidgetStarted].sWidgetId + " = this.aWidget[this.iWidgetStarted];");
		}

		

		this.iWidgetStarted++;

		// Changed here 
		
		if (this.iWidgetToLoad == this.iWidgetStarted) {
			
			// Before callback check if widget must auotstart	
			for (var i=0 ; i <this.aWidget.length; i++){
				
				if (this.aWidget[i].bAutostart == true){
				
					this.aWidget[i].fireAction();
				}
			}

			this._callbackLoadStartWidget();
		} else {
			this.aWidget[this.iWidgetStarted].startWidget(this._checkStartedWidget.bind(this));
		}


	},
});