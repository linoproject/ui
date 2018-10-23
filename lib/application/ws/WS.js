var Application_WS = Object.extend(Object, {
	
	/**
	 * public simpleGet
	 * simple get without params
	 */
	simpleGet: function(sUrl, oCallback){
	
		$.ajax({
			  url: sUrl+"?rnd="+new Date().getTime(),
			  dataType: "json",
			  success: function(oData){
				  oCallback(oData);
				  
			  }.bind(this),
			  error: function(error){
				  
				  oCallback({});
			  }
		});
		
		
	},

	simpleAuthGet: function(sUrl, sToken, oCallback){
		
	
		$.ajax({
			  url: sUrl+"?rnd="+new Date().getTime(),
			  dataType: "json",
			  headers: {
				'Authorization' : sToken
			  },
			  success: function(oData){
				  oCallback(oData);
				  
			  }.bind(this),
			  error: function(error){
				  
				  oCallback({});
			  }
		});
		
		
	},
	
	simpleText: function(sUrl, oCallback){
	
		$.ajax({
			  url: sUrl+"?rnd="+new Date().getTime(),
			  dataType: "text",
			  success: function(oData){
				  oCallback(oData);
				  
			  }.bind(this),
			  error: function(){
				  oCallback({});
			  }
		});
		
		
	},

	authGet: function (sUrl, oParams, sToken, oCallback) {
		this._launchAuthWS(sUrl, "GET", sToken, oParams, oCallback);
	},

	authPost: function (sUrl, oParams, sToken, oCallback) {
		this._launchAuthWS(sUrl, "POST", sToken, oParams, oCallback);
	},

	_launchAuthWS: function (surl, oType, sToken, oParams, oCallback) {
		oCallback();
	}
	
});