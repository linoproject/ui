# Linoproject User Interface Framework

This framework is built to help developers and designers to work better with html syntax (without javascript coding) and building html5 applications. It uses html class definition place and intercts with widget, actions, etc...

This is based on jquery (included as external lib) and could be implemented with Bootstrap library or VMware Clarity.

## Architecture ##
All begins with ui/lib/Application.js file which contains the main directives to:
* Get all class and variables
* Load External Libraries like bootstrap, jquery_ui,... (TODO: load external CSS)
* Load internal libraries like the widget loader
* Load widgets based on page
* Execute widgets

Every element in the page could interact with another: if you press a button you could run webservice and put results into a div area. This becasue every elements could be called by their id in the html or programmatically using a call to object.

If you like it is possible define a personalized JS file and every element is available using oApplication object or global application var oGlobal.oApp

Every widget is an implementation of /lib/application/widget/Widget.js and have 3 states:
* Loading phase
* Reday 
* Fire action

During lodiang phase WidgetLoader is executing the following steps:
- check and load widget based on x-lprjwdg html class attribute (eg: x-lprjwdg-button load WidgetButton.js)
- instantiate an object under Application.js called oWidgets using the pattern oApplication.oWidget.[htmlid]
- Load further external libs which are composing the widget execution
- Load further CSS file  
- execute async method: startWidget()

This is the Widget skeleton
```javascript
var Application_Widget = Object.extend(Object, {
	
	sWidget: "generic",
	oElement: null,
	oApplication: null,
	
	sWidgetId: "",
	
	sName: "",
	iIndex: -1,
	
	
	constructor: function(){
	},
	
	getId: function(){
		if ($(this.oElement).attr("id") != undefined){
			//TODO Catch exception String
			this.sWidgetId = $(this.oElement).attr("id");
		}
	},

	loadWidgetLibs: function(){
	},
	
	startWidget: function(oCallback){		
		oCallback();
	},
	
	/**
	 * @public fireAction
	 * execute actions here
	 */
	fireAction: function(){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Fire Action extend to use it");
		}
	}
	
});
```

## Installation and test ##

### Requirements: ###
* Webserver or Powershell
* Web browser

### Tested on: ###
* Firefox 
* Chrome

### Running in powershell ###
* git pull this repo
* run the web-server powershell script in the directory 
```powershell
PS> ./Start-WebServer.ps1
```
* Open browser to [http://localhost:8080/index.html](http://localhost:8080/index.html) to test the application

### Running on webserver ###
* simply put this direcotry into public directory on the web server
* Open browser to  http://[webserver]:[port]/index.html

## Tutorial and examples ##

[Start Turorial - Intro e Application definitions](docs/tutorial1.md)

## Widgets ##

### Base ###
| ClassName | Widget HTML Class | Reference File(s) 						   |Description														 |
|-----------|-------------------|----------------------------------------------|-----------------------------------------------------------------|
| Application_Widget	| x-lprjwdg-*		| [Widget.js](lib/application/widget/Widget.js)|Base Widget. It will be used when a non specific Widget is found |
| Application_WidgetTplsubst	| x-lprjwdg-tplsubst | [WidgetTplsubst.js](lib/application/widget/WidgetTplsubst.js)| |


### Template ###
| ClassName				    | Widget HTML Class | Reference File(s) 						  			 |Description														 |
|---------------------------|-------------------|--------------------------------------------------------|-----------------------------------------------------------------|
| Application_WidgetTplws	| x-lprjwdg-tplws	| [WidgetTplws.js](lib/application/widget/WidgetTplws.js)| Insert HTML code using webservice and substituting markup lang contained in a template with response data |
| Application_WidgetTpcode	| x-lprjwdg-tplcode	| [WidgetTplcode.js](lib/application/widget/WidgetTplcode.js)||
| Application_WidgetTplsubst| x-lprjwdg-tpltplsubst	| [WidgetTplsubst.js](lib/application/widget/WidgetTplsubst.js)||

TODO Examples

### Actions ###
| ClassName				    | Widget HTML Class | Reference File(s) 						  			 |Description														 |
|---------------------------|-------------------|--------------------------------------------------------|-----------------------------------------------------------------|
| Application_WidgetActionws	| x-lprjwdg-actionws	| [WidgetActionws.js](lib/application/widget/WidgetActionws.js)|  |
| Application_WidgetActionobj	| x-lprjwdg-actionobj	| [WidgetActionobj.js](lib/application/widget/WidgetActionobj.js)|  |

### Page ###



### Windows ###
| ClassName				    | Widget HTML Class | Reference File(s) 						  			 |Description														 |
|---------------------------|-------------------|--------------------------------------------------------|-----------------------------------------------------------------|
| Application_WidgetWindowdialog	| x-lprjwdg-windowdialog	| [WidgetWindowdialog.js](lib/application/widget/WidgetWindowdialog.js)|  |


### Form ###



### Graph ###


 
 
