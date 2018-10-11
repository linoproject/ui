var Application_Auth = Object.extend(Object, {

    sAuthPage: "PUBLIC", // can be PUBLIC, PRIVATE

    bAuthenticated: false,
    sAuthCheckWS:"",
    sAuthCheckWSTokenVar: "",
    sAuthCheckTimer: "",
    sAuthCheckNoAuthRedirect: "", //Check 

    
    oUser:{
        User:null,
        token: "",
        role: "" //may
    },

    /**
     * @data 
     * @return void
     **/
    data: function (sAuthCheckWS,sAuthCheckWSTokenVar,sAuthCheckTimer,sAuthCheckNoAuthRedirect) {
        this.sAuthCheckWS = sAuthCheckWS;
        this.sAuthCheckWSTokenVar = sAuthCheckWSTokenVar;
        this.sAuthCheckTimer = sAuthCheckTimer;
        this.sAuthCheckNoAuthRedirect = sAuthCheckNoAuthRedirect;

    },

    
    
    checkToken: function (oCallback) {
        if (this.bAuthenticated == "PUBLIC"){
            this.bAuthenticated = true;
            oCallback();
        }else{
            //TODO Here authentication process
            this.bAuthenticated = true;
            oCallback();
        }
       
    }

});