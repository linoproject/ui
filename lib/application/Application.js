/**
 * @class Application
 * Main Application class to handle principal application workflow:
 * - Load CSS
 * - Load application vars
 * - Load Lib class
 * - Load Widget
 * - Check Authorization 
 * - Execute Widget (w Listeners) -> TODO Order in execution (new variable needs)
 * - Optionally load application class -> Page must defined 
 * 
 * 
 * 
 * TODO: 
 * - https://epochjs.github.io/epoch/
 * - https://d3js.org/
 * 
 * TODO:
 * - nested widgets -> Only widget template
 * */

var Application = Object.extend(Object, {
	
	oApplicationVar:{
		ApplicationName:"Application",
		DirApp:"application",
		Page:"",
		AutoexecPageMethod:"",
		DirLib:"lib",
		DirWidget:"lib/application/widget",
		
		AuthPage: "PUBLIC", // PUBLIC or ROLE such as ADMIN or USER

		AuthCheckWS:"",
		AuthLoginWS: "",
		AuthLogoutWS: "",

		AuthCheckWSTokenVar:"",
		AuthCheckNoAuthRedirect:"",
		AuthLoginOKRedirect: "",
		AuthLoginKOAuthRedirect: "",

		
		ExternalCss:[],
		ExternalLib:[]
	},
	
	oLibClass:{},
	oExternalLib:{},
	oExternalCss:{},
	oApplicationClass: {},
	oWidgets:{},
	
	

	oWidgetToggle:null,
	
	//sDirLib: "lib", // don't change this
	bDebug: true, // set false in production
	
	
	_aTodoThings: [],
	
	/**
	 * @constructor Application starts here 
	 * @return void
	 */
	constructor: function(){
		if (this.bDebug){
			this.writeDebugMsg("Application starting right now!");
		}
		
		this.oLibClass.Vars = new Application_Vars();
		this.oExternalLib = new Application_ExternalLib();
		this.oExternalCss = new Application_ExternalCss();
		
		
		this._loadClassAndVars(function(){
			
			
			this._passAuthVars(); // Insert authorization vars
			// Load external libs -> async
			this.oExternalLib.startExternalLib(this.oApplicationVar.DirLib, this.oApplicationVar.ExternalLib, function () {
				// Load CSS -> sync
				this.oExternalCss.loadExternalCss(this.oApplicationVar.ExternalCss);

				// Check Token if page is private
				this.oLibClass.Auth.checkToken(function () {

					// Load widget loader and parse all Widget
					this.loadLibClass("widget/WidgetLoader", function () {
						this.oLibClass.WidgetLoader.getAllWidget(this,null , function () {
							
							if (this.oApplicationVar.Page != "" && this.oApplicationVar.Page != null) {
								this.loadApplicationClass(this.oApplicationVar.Page, function (oApplicationClass) {
									if (this.bDebug) {
										this.writeDebugMsg("Application Loaded w Custom application class");
									}
									if (this.oApplicationVar.AutoexecPageMethod != "") {
										eval("this.oApplicationClass.Application_" + this.oApplicationVar.Page + "." + this.oApplicationVar.AutoexecPageMethod + "()");
									}
									
								}.bind(this));
							} else {
								if (this.bDebug) {
									this.writeDebugMsg("Application Loaded");

								}
								
							}

						}.bind(this));
					}.bind(this));


				}.bind(this));


			}.bind(this));
			// Check auth
			
			
			
		
		}.bind(this));
		
		
		
	},
	
	
	
	_loadClassAndVars: function(oCallback){
		
		
		$.extend (this.oApplicationVar, this.oLibClass.Vars.getVars("",this));
		
		
		if (this.oApplicationVar.Debug == "true"){
			this.bDebug = true;
		}else{
			this.bDebug = false;
		}
		
		this.loadLibClass("ws/WS", function(){
			this.loadLibClass("template/Template", function(){
				this.loadLibClass("auth/Auth", function () {
					this.loadLibClass("action/Action", function () {					
						oCallback();
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
		
	},
	
	
	
	loadApplicationClass: function(sClass, oCallback){
		
		$.ajax({
			  url: this.oApplicationVar.DirApp+"/"+sClass+".js?rnd="+new Date().getTime(),
			  dataType: "script",
			  success: function(oData){
				  var oClass = {};
				  eval ("this.oApplicationClass.Application_"+sClass+" = new Application_"+sClass+"(this)");
				  
				  oCallback();
				  
				  
			  }.bind(this)
		});
	},
	
	loadLibClass: function(sClass, oCallback){
		
		
	
		$.ajax({
			  url: this.oApplicationVar.DirLib+"/application/"+sClass+".js?rnd="+new Date().getTime(),
			  dataType: "script",
			  success: function(oData){
				  
				  aObjDepth = sClass.split("/");
				  sAddClass = "";
				  for (i =0 ; i < aObjDepth.length; i++){
					  if (i < aObjDepth.length -1 ){
						  eval ("this.oLibClass."+aObjDepth[i]+" = {}");
						  sAddClass += aObjDepth[i];
					  }else{
						  sAddClass += aObjDepth[i];
						  sClass = aObjDepth[i];
					  }
				  }
				  
				  eval ("this.oLibClass."+sClass+" = new Application_"+sClass+"()");
				  
				  oCallback();
				  
			  }.bind(this)
		});
	},
	
	loadJsList: function(oJsList){
		
	},
	
	writeDebugMsg: function(sMsg){
		console.log("DEBUG: "+sMsg);
	},
	
	todoThings: function(iPrio, sTodo){
		this._aTodoThings.push(sTodo);
	},
	_passAuthVars: function(){
		
		this.oLibClass.Auth.oApplication = this;
		this.oLibClass.Auth.sAuthPage= this.oApplicationVar.AuthPage;

		this.oLibClass.Auth.sAuthCheckWS = this.oApplicationVar.AuthCheckWS;
		this.oLibClass.Auth.sAuthCheckKORedirect = this.oApplicationVar.AuthCheckKORedirect;
		this.oLibClass.Auth.sAuthCheckOKRedirect = this.oApplicationVar.AuthCheckOKRedirect;

		this.oLibClass.Auth.sAuthLoginWS = this.oApplicationVar.AuthLoginWS;
		this.oLibClass.Auth.sAuthLoginOKRedirect = this.oApplicationVar.AuthLoginOKRedirect;
		this.oLibClass.Auth.sAuthLoginKORedirect = this.oApplicationVar.AuthLoginKOAuthRedirect;


		
		this.oLibClass.Auth.sAuthLogoutWS = this.oApplicationVar.AuthLogoutWS;
		this.oLibClass.Auth.sAuthLogoutOKRedirect = this.oApplicationVar.AuthLogoutOKRedirect;
		this.oLibClass.Auth.sAuthLogoutKORedirect = this.oApplicationVar.AuthLogoutKORedirect;
		
		
	}
	
});



/**
 * @class Application_Vars
 * Static class for widget variables elaboration
 */
var Application_Vars = Object.extend(Object, {

	/**
	 * @method getVars
	 * Get all vars by given root pattern x-lprj... and all x-lprjelm innerHTML
	 */
	getVars: function(sPattern,oApplication){
		
		var oVars = {};
		var aPlaced = Array();
		
		if (sPattern == ""){
			sPattern = '[class^="x-lprjstartup"]'
		}
		
		var aElApplicationVar = $(sPattern);
		if (aElApplicationVar.length >0){
			$(aElApplicationVar[0]).find(".x-lprjelm").each(function(i,el){
				
				// Identify sVarName
				$.each($(el).attr("class").split(" "), function(i, sClassName){
					if (sClassName.indexOf("x-lprjvar-") > -1){
						sVarName = sClassName.replace("x-lprjvar-","");
					}
				}.bind(this))
				
				if (sVarName != ""){
					
					if (aPlaced[sVarName] == undefined){
						
						aPlaced[sVarName] = 0;
						eval ("oVars."+sVarName+"='"+$(el).html()+"'");
					}else if (aPlaced[sVarName] == 0){
						sValue = "";
						eval ("sValue = oVars."+sVarName);
						eval ("oVars."+sVarName+"=[]");
						eval ("oVars."+sVarName+"[0]= sValue");
						
						eval ("oVars."+sVarName+"[1]= '"+$(el).html()+"'");
						aPlaced[sVarName] = aPlaced[sVarName]+1
					
					}else if (aPlaced[sVarName] > 0){
						aPlaced[sVarName] = aPlaced[sVarName]+1
						eval ("oVars."+sVarName+"["+aPlaced[sVarName]+"]= '"+$(el).html()+"'");
					}
					
					
					
				}
				
			}.bind(this));
			
		}
		
		return oVars;
	},
	
	/**
	 * @method getElementVar
	 * From element get all .x-lprjelm vars (widget elements)
	 */
	getElementVar: function(oElement,bText){
		var oVars = {};
		$(oElement).find(".x-lprjelm").each(function(i,el){
			
			// Identify sVarName
			$.each($(el).attr("class").split(" "), function(i, sClassName){
				if (sClassName.indexOf("x-lprjvar-") > -1){
					sVarName = sClassName.replace("x-lprjvar-","");
				}
			}.bind(this));
			
			if (sVarName != ""){
				
				if (bText == false){
					eval ("sVarValue='"+$(el).html()+"'");
				}else{
					eval ("sVarValue=\'"+el.innerText+"'");
				}
				
				if (eval("oVars."+sVarName+" != undefined")){
					
					if (eval("Object.prototype.toString.call(oVars."+sVarName+") != '[object Array]'")){
						
						sArrayVar = eval("oVars."+sVarName);
						eval (eval("oVars."+sVarName+" = Array()"));
						eval("oVars."+sVarName+".push(sArrayVar)");
					}
					
					eval("oVars."+sVarName+".push(sVarValue)");
					//eval("array_push(oVars."+sVarName+",sVarValue)")
					
				}else{
					// Get anther var
					eval ("oVars."+sVarName+"='"+sVarValue+"'");
				}
				
				
				
			}
			
		}.bind(this))
		
		return oVars;
	},
	
	
	getElementClassValue: function(oElement, sClassToFind){
		var oVars = {};
		var sVarName = "";
		var sVarValue = "";
		$(oElement).find(".x-lprjelm").each(function(i,el){
			
			// Identify sVarName
			$.each($(el).attr("class").split(" "), function(i, sClassName){
				if (sClassName.indexOf("x-lprjvar-") > -1){
					sVarName = sClassName.replace("x-lprjvar-","");
				}
				
				if (sClassName.indexOf(sClassToFind) > -1){
					sVarValue = sClassName.replace(sClassToFind,"");
				}
				
			}.bind(this))
			
		
			if (sVarName != "" && sVarValue != ""){
				
				
				if (eval("oVars."+sVarName+" != undefined")){
					if (eval("oVars."+sVarName+".isArray() == false")){
						sArrayVar = eval("oVars."+sVarName);
						eval("array_push(oVars."+sVarName+",sArrayVar)")
					}
					eval("array_push(oVars."+sVarName+",sVarValue)")
					
				}else{
					// Get anther var
					eval ("oVars."+sVarName+"='"+sVarValue+"'");
				}
				
				
			}
			
		}.bind(this))
		
		return oVars;
	},
	
	
	/**
	 * @public findElementVar
	 * Get single var by given id
	 * @return String 
	 */
	findElementVar: function(oElement, sId){
		oVars = this.getElementVar(oElement);
		
		
		if (eval("oVars."+sId) != undefined){
			return eval("oVars."+sId);
		}else{
			return "";
		}
	},
	
	
	getWidgetVar: function(oElement, sClassToFind){
		
		var sReturnVar = null;
		
		$.each($(oElement).attr("class").split(" "), function(i, sClassName){
			if (sClassName.indexOf(sClassToFind) > -1){
				sReturnVar = sClassName.replace(sClassToFind,"");
			}
		}.bind(this))
		return sReturnVar;
	},
	

	/**
	 * @public findElementVarInnertext
	 * Get single var by given id
	 * @return String 
	 */
	findElementVarInnertext: function(oElement, sId){
		oVars = this.getElementVar(oElement, true);
		
		if (eval("oVars."+sId) != undefined){
			return eval("oVars."+sId);
		}else{
			return "";
		}
	},
	

	
	/**
	 * @public findElementArrayInnertext
	 * Get single var by given id
	 * @return String 
	 */
	findElementArrayInnertext: function(oElement, sId){
		oVars = this.getElementVar(oElement, true);
		
		if (eval("oVars."+sId) != undefined){
			return eval("oVars."+sId);
		}else{
			return "";
		}
	}

});


/**
 * @class Application_ExternalLib
 * Static class for External libs
 */
var Application_ExternalLib = Object.extend(Object, {
	
	iToLoad : 0,
	iLoaded: 0,
	oCallback: null,
	aLibToLoad: [],
	sDirLib: "",
	
	/**
	 * Start loading external lib
	 */
	startExternalLib: function(sDirLib, aLibToLoad, oCallback){
		
		this.sDirLib = sDirLib;
		this.aLibToLoad = aLibToLoad;
		this.oCallback = oCallback;
		
		// Include a default lib
		this.aLibToLoad.push("jqueryext/jqueryext.js");
		this.aLibToLoad.push("jqueryext/jquery.cookie.js");
		
	
		if (typeof aLibToLoad === "object" && aLibToLoad.length === 0){
			this.oCallback();
			return;
		}
		
		
		if (typeof aLibToLoad === "string"){
			this.iToLoad = 1;
			this._loadJsLib(sDirLib+ "/"+aLibToLoad+"?rnd="+new Date().getTime());
			
		}else{
			this.iToLoad = aLibToLoad.length;
			this._loadJsLib(sDirLib+ "/"+aLibToLoad[0]+"?rnd="+new Date().getTime());
		
		}
		
		
	},
	
	_loadJsLib: function(sUrl){
		$.ajax({
			
			url: sUrl,
			  dataType: "script",
			  success: function(oData){
				  
				  this.iLoaded++;
				  this._checkLoadedLib();
				  
			  }.bind(this),
			  
			  error: function(){
				  this.iLoaded++;
				  this._checkLoadedLib();
			  }.bind(this)
		});
	},
	
	_checkLoadedLib: function(){
		if (this.iLoaded == this.iToLoad){
			this.oCallback();
			return;
		}else{
			this._loadJsLib(this.sDirLib+ "/"+this.aLibToLoad[this.iLoaded]+"?rnd="+new Date().getTime())
		}
	}
	
});

var Application_ExternalCss = Object.extend(Object,{
	iToLoad: 0,
	iLoaded: 0,
	aCssToLoad: [],

	/**
	 * Load widget CSS
	 */
	loadExternalCss: function (aCssToLoad) {
		
		this.aCssToLoad = aCssToLoad;
		
		if (this.aCssToLoad.length > 0) {

			
			this.iToLoad = this.aCssToLoad.length;

			for (var i = 0; i < this.iToLoad; i++) {
				this._loadExternalCss(this.aCssToLoad[i]);
			}

		}
		
	},

	_loadExternalCss: function (sCss) {
		var sCssUrl = sCss + "?rnd=" + new Date().getTime();
		$('<link rel="stylesheet" type="text/css" href="' + sCssUrl + '" >').appendTo("head");
		this.iLoaded++;
	}

});

var oGlobal = {};
/**
 * Main workflow
 */
$(document).ready(function(){
	
	oGlobal.oApp = new Application();
	
});



