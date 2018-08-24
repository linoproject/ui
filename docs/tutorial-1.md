# Linoproject UI Tutorial #

Before start coding you should have this directory structure:

- index.html (The main file)
- applicaton (dir) (your application files -> you could change this directory name)
- services (dir) (must contains business logic -> you could change this name)
- lib (dir) (The ui framework)
  - oop (dir) 
  - jqueryext (dir)
  - jquery_ui (dir)
  - bootstrap (dir)
  - node_modules (dir)
  - application (dir) (The real framework)
    - ws (dir)
      - WS.js 
    - widget (dir)
      - Widget.js 
      - Other widgets and directories
    - vars (dir)
      - Vars.js
    - tenplate (dir)
      - Template.js
    - Application.js

## Application definitions ##

Now it's time to build your html page or modify the existing paying attention to not execute other javascript elements or place css in every place: Always a clean HTML is mandatory to build a better HTML ui.

In a hidden div place you must place the following tags:
```HTML
<span class="x-lprjstartup">
  
  
  <!-- application elements --> 
  <span class="x-lprjelm x-lprjvar-ApplicationName">My Application Name</span> <!-- This is the name of the application -->
  <span class="x-lprjelm x-lprjvar-DirApp">application</span> <!-- This is your application directory--> 
  
  <!-- UI Framework directory definitions -->
  <span class="x-lprjelm x-lprjvar-DirLib">lib</span> 
  <span class="x-lprjelm x-lprjvar-DirWidget">lib/application/widget</span>
  
  <!-- Optional parameters -->
  <span class="x-lprjelm x-lprjvar-Debug">true</span> <!-- This enable the debug mode -->
</span>  
```

In the same area is possible define other optional directives like:
- External libraries to load (TODO: CSS file to load)
```HTML
<span class="x-lprjelm x-lprjvar-ExternalLib">path/to/file.js</span>
```

- Custom js file 

```HTML
<span class="x-lprjelm x-lprjvar-Page">Application</span>
```
Then under the defined application dir you must put Application.js file (the name is specified in the x-lprjvar-Page directive)
```javascript
var Application_Application = Object.extend(Object, {  // Pattern is Application_x-lprjvar-Page
	
	oApplication: null,
	
	constructor: function(oApplication){
		
		this.oApplication = oApplication;
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Custom class loaded");
		}
		
		// Other initialization functions here
    
	},
  
  runMethod: function(){
		console.log("Run Custom Method");
	}
  
  // Other methods here
});
```

In the HTML you could call every method using the Classname eg:
```HTML
<span class="x-lprjelm x-lprjvar-firePageEvent">Application_Application.runMethod()</span>
```

Next steps:
* The application actions
* The Object grouping
* Webservices definitions
* Place a simple Widget 
* Widget Interactions
