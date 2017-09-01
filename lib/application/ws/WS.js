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
			  error: function(){
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
		
		
	}
	
});