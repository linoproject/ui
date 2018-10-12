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
    sAuthCheckKOedirect: "", //Check
    sAuthCheckOKedirect: "", //Check
    sAuthLoginOKRedirect: "",
    sAuthLoginKORedirect: "",


    sAuthCheckWSTokenVar: "",
    sAuthCheckTimer: "",
    

    
    oUser:{
        User:null,
        token: "",
        role: "" //may
    },

    checkToken: function (oCallback) {
        if (this.sAuthPage == "PUBLIC") {
            this.bAuthenticated = true;
            this._actionRedirect("check",oCallback);
        }else if (this.sAuthPage == "LOGIN"){
            // Case Login check is authenticated and take actions
        }else {
            //TODO Here authentication process

            this._launchWSToken(oCallback);
        }
       
    },

    login: function(oCallback){
        if (this.sAuthLoginWS != ""){
            if (this.oApplication.bDebug) {
                this.oApplication.writeDebugMsg("Login Fired");
            }
            $.ajax({
                url: this.sAuthLoginWS + "?rnd=" + new Date().getTime(),
                dataType: "json",
                success: function (oData) {

                    if (oData.auth == true) {
                        this.bAuthenticated = true;
                    } else {
                        this.bAuthenticated = false;
                    }
                    this._actionRedirect("login",oCallback);

                }.bind(this),
                error: function (error) {

                    this.bAuthenticated = false;
                    this._actionRedirect("login",oCallback);

                }.bind(this)
            });
        }else{
            // No action defined
            oCallback();
        }
        
        
    },

    logout: function(oCallback){
        oCallback();
    },

    _launchWSToken: function(oCallback){
        if (this.sAuthCheckWS != ""){
            
            // Launch WS with token //Check mode
            $.ajax({
                url: this.sAuthCheckWS + "?rnd=" + new Date().getTime(),
                dataType: "json",
                success: function (oData) {
                    
                    if (oData.auth == true){
                        this.bAuthenticated = true;
                        // Insert token
                    }else{
                        this.bAuthenticated = false;
                        // Insert token
                    }
                    this._actionRedirect("check",oCallback);
                    
                }.bind(this),
                error: function (error) {

                    if (this.oApplication.bDebug) {
                        this.oApplication.writeDebugMsg(error);
                    }

                    this.bAuthenticated = false;
                    this._actionRedirect("check",oCallback);

                }.bind(this)
            });
           
        }else{
            this.bAuthenticated = false;
            this._actionRedirect(oCallback);
        }
        
    },

   

    _actionRedirect: function(sType, oCallback){
        if (sType == "check"){
            var sRedirectOK = this.sAuthCheckOKedirect;
            var sRedirectKO = this.sAuthCheckKOedirect;

        } else if (sType == "login") {
            var sRedirectOK = this.sAuthLoginOKedirect;
            var sRedirectKO = this.sAuthLoginKOedirect;
        }

        if (this.bAuthenticated == false) {
            if (this.oApplication.bDebug) {
                this.oApplication.writeDebugMsg("Access denied!");
            }
            
            if (sRedirectKO != "") {
                eval(sRedirectOK);
            }
            oCallback();

        } else {
            if (this.oApplication.bDebug) {
                this.oApplication.writeDebugMsg("Access granted!");
            }
            if (sRedirectKO != "") {
                eval(sRedirectOK);
            }
            
            oCallback();
        }
    }

});