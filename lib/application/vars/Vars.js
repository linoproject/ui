/**
 * @class Application_Vars
 * Stati class for loading vars
 */
var Application_Vars = Object.extend(Object, {

	/**
	 * @method getVars
	 * Get all vars by given root pattern x-lprj... and all x-lprjelm innerHTML
	 */
	getVars: function(sPattern,oApplication){
		
		var oVars = {};
		
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
					
					eval ("oVars."+sVarName+"='"+$(el).html()+"'");
				}
				
			}.bind(this))
			
		}
		
		return oVars;
	},
	
	/**
	 * @method getElementVar
	 * From element get all .x-lprjelm vars (widget elements)
	 */
	getElementVar: function(oElement, bText){
		var oVars = {};
		$(oElement).find(".x-lprjelm").each(function(i,el){
			
			// Identify sVarName
			$.each($(el).attr("class").split(" "), function(i, sClassName){
				if (sClassName.indexOf("x-lprjvar-") > -1){
					sVarName = sClassName.replace("x-lprjvar-","");
				}
			}.bind(this))
			
			if (sVarName != ""){
				if (bText == false){
					eval ("oVars."+sVarName+"='"+$(el).html()+"'");
				}else{
					eval ("oVars."+sVarName+"='"+el.innerText+"'");
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
				
				// Get anther var
				
				eval ("oVars."+sVarName+"='"+sVarValue+"'");
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
	
	
	getWidgetVar: function(oElement, sClassToFind){
		
		var sReturnVar = null;
		
		$.each($(oElement).attr("class").split(" "), function(i, sClassName){
			if (sClassName.indexOf(sClassToFind) > -1){
				sReturnVar = sClassName.replace(sClassToFind,"");
			}
		}.bind(this))
		return sReturnVar;
	}
});