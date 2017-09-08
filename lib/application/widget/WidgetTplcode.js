/**
 * @class Application_WidgetTplcode
 * 
 * Append and substitute html and special chars
 * 
 *  <div class="x-lprjwdg-tplcode" id="areaHosts">
   	<span class="x-lprjelm x-lprjvar-CodeFile">code/start.code</span>
   	<span class="x-lprjelm x-lprjvar-Style">code</span>
   	<span class="x-lprjelm x-lprjvar-ShowFile">true</span>
   </div>
 * 
 * 
 */
var Application_WidgetTplcode = Object.extend(Application_Widget, {
	
	sWidget: "tplcode",
	oElement: null,
	oApplication: null,
	
	sTemplate: "",
	oTargetElement: null,
	
	bShowFile: false,
	aExternalLib:["highlight.pack.js"],
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Template code");
		}
		
		
	},
	
	startWidget: function(oCallback){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init template code started");
		}
		
		var sCodeFile = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"CodeFile");
		var sStyle = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"Style");
		
		this.bShowFile = eval(this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"ShowFile"));
		
		if (sCodeFile != ""){
			// Load file
			if (this.oApplication.bDebug){
				this.oApplication.writeDebugMsg("Loading file"+ sCodeFile);
			}
			// Purge code
			this.oApplication.oLibClass.WS.simpleText(sCodeFile,function(sText){
				
				sText = this.oApplication.oLibClass.Template.substituteHTMLTag(sText);
				sText = this.oApplication.oLibClass.Template.insertBR(sText);
				if (sStyle != ""){
					sText = "<div class=\""+sStyle+"\"><pre><code>"+sText+"</code></pre></div>";
					
				}else{
					sText = "<div><pre><code>"+sText+"</code></pre></div>";
				}
				
				if (this.bShowFile){
					sText +="<div class=\"code filename\">"+sCodeFile+"</div>"
				}
				
				$(this.oElement).append(sText);
				
				if (sStyle != ""){
					$('pre code').each(function(i, block) {
						hljs.highlightBlock(block);
					});
				}
				
				oCallback();
			}.bind(this));
				
			// Append content
		}else{
			oCallback();
		}
		
		
		

	}
});
