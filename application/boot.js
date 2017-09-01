
//var global_Application_appName = "Politically in containers";
//var global_urlServiceApplication = "lib/ui";
//var global_Application_dir = "/vsphere";

var global_oApp;
var global_Page;

var global_oDebug = true;

var global_indexToLoad = 0;
var global_aJs = [];
var global_aStyleSheet = [];
var global_aTemplate = [];


var aJs=[
     
];

$(document).ready(function(){
	
	var oApp = new Application();
	oApp.sApplicationName = "FH Politically in containers";
	oApp.sDirLib = "lib";
	oApp.sDirApp = "application";
	
	
	oApp.loadApplicationClass("index",function(oIndex){
		oIndex.writeDebugMsg("Here go "+oIndex.sApplicationName);
		oIndex.startWidget(function(){
			oIndex.writeDebugMsg("Here start");
		}.bind(this));
	}.bind(this));
	
});







