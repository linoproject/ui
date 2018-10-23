/**
 * @class Application_Template
 * Static class for template
 */
var Application_Template = Object.extend(Object, {
	
	/**
	 * @public loadTemplate
	 * Load template into string
	 * @return string template
	 */
	loadTemplate: function(sUrl, oCallback){
		$.ajax({
            url : sUrl+ "?rnd="+new Date().getTime(),
            dataType: "text",
            success :oCallback.bind(this),
            error: oCallback.bind(this)
        });
	},
	
	/**
	 * @public fillTemplate
	 * Append n times template depending on aData length
	 * and sustitute content
	 * @return true
	 */
	fillTemplate: function(oTargetElement, sTemplate, aData){
		
		if (aData == undefined){
			
			console.log("No data");
			return false
		}
		sTemplate = $.trim(sTemplate);
		if (aData.length == 0 || aData.length == undefined){
			this._appendTemplate(oTargetElement, sTemplate, "", true);
		}else{
			
			
			

			for (i = 0; i < aData.length; i++){
				
				if (aData[i] != undefined){
					//$(oTargetElement).append(sTemplate);
					this._appendTemplate(oTargetElement, sTemplate, aData[i], true);
				}
				
			}
		}
		
		
		return true;
	},
	
	/**
	 * @private _appendTemplate
	 * Append template with data
	 */
	_appendTemplate: function(oTargetElement, sTemplateHTML, oData, bPurgeUnavailable){
		
		
		var aCondition = sTemplateHTML.match(/\{\{(.*)\}\}([\s\S]*?)\{\{end\}\}/g);
		if (aCondition != undefined){
			for (var i= 0; i < aCondition.length; i++){
				var sCondition = aCondition[i].match(/\{\{(.*)\}\}/);
				sCondition = sCondition[0].replace(/\{\{/,"").replace(/\}\}/,"");
				eval ("if (oData."+sCondition+"){sTemplateHTML = sTemplateHTML.replace('{{"+sCondition+"}}','').replace('{{end}}','');}else{sTemplateHTML = sTemplateHTML.replace(aCondition[i],'');}");
				
			}
		}
		
		aVarToSubst = sTemplateHTML.match(/##(.*?)##/g);
		if (aVarToSubst != undefined ){
			for (var i=0; i < aVarToSubst.length; i++){
				try{
					
					sObjectString = aVarToSubst[i].replace(/##/g,"");
					aVarToSubst[i] = aVarToSubst[i].replace("[", "\\[").replace("]","\\]");
					if (eval("oData."+sObjectString) != undefined){
						eval ("sTemplateHTML = sTemplateHTML.replace(/"+aVarToSubst[i]+"/g,oData."+sObjectString+" )")
					}else{
						if (bPurgeUnavailable){
							
							eval("sTemplateHTML = sTemplateHTML.replace(/"+aVarToSubst[i]+"/g,'')");
						}
					}
					
				}catch(e){
					console.log(e);
				}
				
			}
		}
	
		
		$(oTargetElement).append(sTemplateHTML);
		
		
		
	},
	
	appendTemplateConditional: function(sTemplateHTML, sObjectToAppend, oData, aCondition){
		
		aValueInCondition = [];
		
		aVarToSubst = sTemplateHTML.match(/##(.*?)##/g);
		
		if (aVarToSubst != undefined ){
			for (var i=0; i < aVarToSubst.length; i++){
				try{
					sObjectString = aVarToSubst[i].replace(/##/g,"");
					
					for (var k=0; k < aCondition.length; k++){
						if (aCondition[k][sObjectString]){
							
							aValueInCondition[aCondition[k][sObjectString].sElementToEvaluate]= aCondition[k][sObjectString];
							aValueInCondition[aCondition[k][sObjectString].sElementToEvaluate].storeValue(eval("oData."+aValueInCondition[aCondition[k][sObjectString].sElementToEvaluate].sElementToEvaluate));
							
							
						}
					}
					
					
					
				}catch(e){
					//console.log(e);
				}
			}
			
			//console.log(aValueInCondition);
			
			for (var i=0; i < aVarToSubst.length; i++){
				try{
					
					//console.log("Varifico "+sObjectString);
					sObjectString = aVarToSubst[i].replace(/##/g,"");
					
					
					aVarToSubst[i] = aVarToSubst[i].replace("[", "\\[").replace("]","\\]");
					if (eval("oData."+sObjectString) != undefined){
						eval ("sTemplateHTML = sTemplateHTML.replace(/"+aVarToSubst[i]+"/g,oData."+sObjectString+" )")
					}
					
				}catch(e){
					//console.log(e);
				}
				
			}
			
			for (var i=0; i < aVarToSubst.length; i++){
				try{
					sObjectString = aVarToSubst[i].replace(/##/g,"");
					bConditionFound = false;
					for (var k=0; k < aCondition.length; k++){
						if (aCondition[k][sObjectString] && bConditionFound == false){
							
							
							sHTMLReturn = aCondition[k][sObjectString].executeCondition(sObjectString);
							eval ("sTemplateHTML = sTemplateHTML.replace(/"+aVarToSubst[i]+"/g,sHTMLReturn)");
							bConditionFound = true;
							
						}
					}
					
					
					
				}catch(e){
					console.log(e);
				}
			}
			
		}
		
		
		
		$("#"+sObjectToAppend).append(sTemplateHTML);
		
		
		
	},
	
	subsituteCodeTemplate: function(sCodeString){
		return sCodeString.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
	},
	
	substituteContentPage: function(oData , bPurgeUnavailable){
		
		aElementToSubs = $(".elementTemplate");
		
		if (aElementToSubs != undefined ){
			for (var i=0; i < aElementToSubs.length; i++){
				
				if (aElementToSubs[i].nodeName == "SPAN"){
					sObjectString = aElementToSubs[i].innerHTML.replace(/##/g,"");
					//console.log(oData[sObjectString]);
					try{
						if (eval("oData."+sObjectString) != undefined){
							eval ("aElementToSubs[i].innerHTML = oData."+sObjectString);
							$(aElementToSubs[i]).removeClass("elementTemplate").addClass("elementTemplateShow");
						}else{
							if (bPurgeUnavailable){
								aElementToSubs[i].innerHTML = "";
								$(aElementToSubs[i]).removeClass("elementTemplate").addClass("elementTemplateShow");
							}
						}
					}catch(e){
						console.log(e);
						if (bPurgeUnavailable){
							aElementToSubs[i].innerHTML = "";
							$(aElementToSubs[i]).removeClass("elementTemplate").addClass("elementTemplateShow");
						}
					}
				}else if (aElementToSubs[i].nodeName == "INPUT"){
					
					sObjectString = aElementToSubs[i].value.replace(/##/g,"");
					try{
						if (eval("oData."+sObjectString) != undefined){
							
							eval ("aElementToSubs[i].value = oData."+sObjectString);
							$(aElementToSubs[i]).removeClass("elementTemplate").addClass("elementTemplateShow");
							
						}else{
							
							aElementToSubs[i].value = "";
							if (bPurgeUnavailable){
								$(aElementToSubs[i]).removeClass("elementTemplate").addClass("elementTemplateShow");
							}
						}
					}catch(e){
						
						if (bPurgeUnavailable){
							aElementToSubs[i].value = "";
							$(aElementToSubs[i]).removeClass("elementTemplate").addClass("elementTemplateShow");
						}
					}
				}else if (aElementToSubs[i].nodeName == "IMG"){
					try{
						//console.log( $(aElementToSubs[i]).attr("src"));
						sObjectString = $(aElementToSubs[i]).attr("src").replace(/##/g,"");
						if (eval("oData."+sObjectString) != undefined){
							
							eval ("$(aElementToSubs[i]).attr(\"src\",oData."+sObjectString+")");
							$(aElementToSubs[i]).removeClass("elementTemplate").addClass("elementTemplateShow");
						}else{
							aElementToSubs[i].src = "";
							if (bPurgeUnavailable){
								$(aElementToSubs[i]).removeClass("elementTemplate").addClass("elementTemplateShow");
							}
							
						}
					}catch(e){
						
						if (bPurgeUnavailable){
							aElementToSubs[i].src = "";
							$(aElementToSubs[i]).removeClass("elementTemplate").addClass("elementTemplateShow");
						}
					}
				}else if (aElementToSubs[i].nodeName == "P"){
					try{
						sObjectString = aElementToSubs[i].innerHTML.replace(/##/g,"");
						//console.log(oData[sObjectString]);
						if (eval("oData."+sObjectString) != undefined){
							eval ("aElementToSubs[i].innerHTML = oData."+sObjectString);
							$(aElementToSubs[i]).removeClass("elementTemplate").addClass("elementTemplateShow");
						}else{
							if (bPurgeUnavailable){
								$(aElementToSubs[i]).removeClass("elementTemplate").addClass("elementTemplateShow");
								aElementToSubs[i].innerHTML = "";
							}
						}
					}catch(e){
						if (bPurgeUnavailable){
							$(aElementToSubs[i]).removeClass("elementTemplate").addClass("elementTemplateShow");
							aElementToSubs[i].innerHTML = "";
						}
					}
				}

				
			}
		}
		
	
	},
	
	substituteHTMLTag: function(sText){		
		return sText.replace(/</g,"&lt;").replace(/>/g, "&gt;");
	},
	
	insertBR: function(sText){
		return sText.replace(/(?:\r\n|\r|\n)/g, '<br />');
	}
	
});