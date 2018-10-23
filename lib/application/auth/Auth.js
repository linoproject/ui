/**
 * Handle all authentication and authorization
 * TODO: implement GROUP
 */
var Application_Auth = Object.extend(Object, {

    oApplication: null,
    sAuthPage: "PUBLIC", // can be PUBLIC, LOGIN, PRIVATE

    bAuthenticated: false,
    sToken: "",

    // Web services
    sAuthCheckWS:"",
    sAuthLoginWS:"",
    sAuthLogoutWS:"",
    
    // Redirect actions here
    sAuthCheckKORedirect: "", //Check
    sAuthCheckOKRedirect: "", //Check
   
    sAuthLoginOKRedirect: "",
    sAuthLoginKORedirect: "",

    sAuthLogoutOKRedirect: "",
    sAuthLogoutKORedirect: "",


    sAuthCheckWSTokenVar: "",
    sAuthCheckTimer: "",
    
    sCookieAuthVar: "linoprjauth",

    
    oUser:{
        username:null,
        token: "",
        roles: [] //may
    },

    checkToken: function (oCallback) {
        
        if (this.sAuthPage == "PUBLIC") {
            // Skip authentication change
            oCallback(); // No redirect
            if (this.oApplication.bDebug) {
                this.oApplication.writeDebugMsg("Public Page");
            }
        }else if (this.sAuthPage == "LOGIN"){
            // Case Login page -> check is authenticated and take actions
            this._launchWSToken(oCallback);
            if (this.oApplication.bDebug) {
                this.oApplication.writeDebugMsg("Login Page");
            }
        }else {
            //TODO Here authentication process
            this._launchWSToken(oCallback);
            if (this.oApplication.bDebug) {
                this.oApplication.writeDebugMsg("Private Page");
            }
        }
       
    },

    login: function (sUsername, sPassword, oCallback) {
        
        if (this.sAuthLoginWS != ""){
            if (this.oApplication.bDebug) {
                this.oApplication.writeDebugMsg("Login Fired");
            }
            $.ajax({
                url: this.sAuthLoginWS + "?rnd=" + new Date().getTime(),
                type:"post",
                data: {
                    username: sUsername,
                    password: sPassword
                },
                dataType: "json",
                success: function (oData) {
                    
                    if (oData.success == true || oData.token) {
                        this.insertUserData(oData);
                    } else {
                        this.removeUserData();
                    }
                    this._actionRedirect("login",oCallback);

                }.bind(this),
                error: function (err,error) {

                    if (this.oApplication.bDebug) {
                        console.log(error);    
                    } 
                    oCallback(false, error);

                }.bind(this)
            });
        }else{
            // No action defined
            oCallback(true, "");
        }
        
        
    },

    logout: function(oCallback){
        
        
        $.cookie.json = true;
        var oCookie = $.cookie(this.sCookieAuthVar);

        if (oCookie == undefined || this.sAuthLogoutWS == "") {
            this.bAuthenticated = false;
            this.removeUserData();
            this._actionRedirect("logout", oCallback);
            oCallback();
        } else {
        
            if (oCookie.token == null){
                this.bAuthenticated = false;
                this.removeUserData();
                this._actionRedirect("logout", oCallback);
                oCallback();
            }else{
            
                if (this.oApplication.bDebug) {
                    this.oApplication.writeDebugMsg("Logout Fired");
                }
                $.ajax({
                    url: this.sAuthLogoutWS + "?rnd=" + new Date().getTime(),
                    type: "post",
                    data: {
                        token: oCookie.token
                    },
                    dataType: "json",
                    success: function (oData) {

                        if (oData.success == true) {
                            this.removeUserData();
                        }else{
                            // Do nothing
                        }
                        this._actionRedirect("logout",oCallback);

                    }.bind(this),
                    error: function (err,error) {
                        // Fire error
                        if (this.oApplication.bDebug) {
                            console.log(error);    
                        } 
                        oCallback();
                    }.bind(this)
                });
            }
        }
    },

    insertUserData: function(oData){
        this.sToken = oData.token;
        this.oUser = oData;
        this.bAuthenticated = true;

        $.cookie.json = true;
        $.cookie(this.sCookieAuthVar, oData);

        

    },

    removeUserData: function(){
        this.bAuthenticated = false;
        $.removeCookie(this.sCookieAuthVar);
    },

    _launchWSToken: function(oCallback){
       
        $.cookie.json = true;
        var oCookie = $.cookie(this.sCookieAuthVar);
        
        
        if (oCookie == undefined || this.sAuthCheckWS == "") {
            this.bAuthenticated = false;
            this._actionRedirect("check", oCallback);
        }else{
            if (oCookie.token == null){
                //  token was removed
                this.removeUserData();
                this._actionRedirect("check", oCallback);
            }else{
                // Check cookie
                $.ajax({
                    url: this.sAuthCheckWS + "?rnd=" + new Date().getTime(),
                    type: "post",
                    data: {
                        token: oCookie.token
                    },
                    dataType: "json",
                    success: function (oData) {
                        
                        if (this.oApplication.bDebug) {
                            console.log(oData);
                        }
                        if (oData.success == true || oData.username != undefined) {
                            this.bAuthenticated = true;
                            // Insert token
                            this.sToken = oCookie.token;
                            oData.token = oCookie.token;
                            $.cookie.json = true;
                            $.cookie(this.sCookieAuthVar, oData);

                        } else {
                            this.bAuthenticated = false;
                            // Insert token
                            $.removeCookie(this.sCookieAuthVar);
                        }
                        this._actionRedirect("check", oCallback);

                    }.bind(this),
                    error: function (error) {

                        if (this.oApplication.bDebug) {
                            this.oApplication.writeDebugMsg(error);
                        }

                        this.bAuthenticated = false;
                        $.removeCookie(this.sCookieAuthVar);
                        this._actionRedirect("check", oCallback);

                    }.bind(this)
                });
            }
        }

        
        
    },

    _actionRedirect: function(sType, oCallback){
        if (sType == "check"){
            var sRedirectOK = this.sAuthCheckOKRedirect;
            var sRedirectKO = this.sAuthCheckKORedirect;

        } else if (sType == "login") {
            var sRedirectOK = this.sAuthLoginOKRedirect;
            var sRedirectKO = this.sAuthLoginKORedirect;
        }else if (sType == "logout") {
            
            var sRedirectOK = this.sAuthLogoutOKRedirect;
            var sRedirectKO = this.sAuthLogoutOKRedirect;
            
        }

        
        if (this.bAuthenticated == false) {
            if (this.oApplication.bDebug) {
                this.oApplication.writeDebugMsg("Access denied!");
            }
            
            if (sRedirectKO != "") {
                try{
                    this.evalAction(sRedirectKO);
                }catch(e){
                    if (this.oApplication.bDebug) {
                        this.oApplication.writeDebugMsg("Problem redirect KO");
                        this.oApplication.writeDebugMsg(e);
                    }
                }
            }
            oCallback();

        } else {
            if (this.oApplication.bDebug) {
                this.oApplication.writeDebugMsg("Access granted!");
            }
            if (sRedirectOK != "") {
                try{
                    this.evalAction(sRedirectOK);
                }catch(e){
                    if (this.oApplication.bDebug) {
                        this.oApplication.writeDebugMsg("Problem redirect OK");
                        this.oApplication.writeDebugMsg(e);
                    }
                }
            }
            
            oCallback();
        }
    },

    evalAction: function(sAction){

        console.log(sAction);
        if (sAction == undefined){
            sAction = "";
        }
        if (sAction.indexOf("redirect")> -1){
            var sRedirectUrl = sAction.replace("redirect-","");
            console.log(sRedirectUrl);
            $(location).attr('href', sRedirectUrl);
        }else if (sAction.indexOf("log")> -1){
            var sLogMsg = sAction.replace("log-","");
            console.log(sLogMsg);
        }else{
            if (this.oApplication.bDebug) {
                this.oApplication.writeDebugMsg("Unknown action");
            }
        }
    }

});