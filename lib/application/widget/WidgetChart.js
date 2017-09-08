/**
 * @class Application_WidgetChart
 * 
 * Insert index and anchor to element
 * <div class="x-lprjwdg-widgetchart" id="chart1">
 * <span class="x-lprjelm x-lprjvar-charttype">bar</span>
<<<<<<< HEAD
 * </div>
 * 
 * 
 */
var Application_WidgetChart = Object.extend(Application_Widget, {
	
	sWidget: "widgetchart",
	oElement: null,
	oCanvas: null,
	oApplication: null,
	
	sChartType: "bar",
	
	aData:[],
	
	sId :"",
	aExternalLib:["Chart.min.js"],
	
	sLabel: "",
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		this.sChartType = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"charttype");
		this.sLabel = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"label");
		
		this.sId = $(this.oElement).attr("id");
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Window Dialog widget");
		}
		
		
	},
	
	startWidget: function(oCallback){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Chart widget started");
		}
		
		this.oCanvas = $('<canvas/>',{
             id: 'canvas_'+this.sId                   
         }).prop({
             width: 200,
             height: 200
         });
		$(this.oElement).append(this.oCanvas);
		
		// Append SVG
		
	},
	
	fireAction: function(oData){
		
		var ctx = $("#canvas_"+this.sId)[0].getContext('2d');
		var myChart = new Chart(ctx, {
		    type: 'bar',
		    data: {
		        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
		        datasets: [{
		            label: this.sLabel,
		            data: oData,
		            backgroundColor: [
		                'rgba(255, 99, 132, 0.2)',
		                'rgba(54, 162, 235, 0.2)',
		                'rgba(255, 206, 86, 0.2)',
		                'rgba(75, 192, 192, 0.2)',
		                'rgba(153, 102, 255, 0.2)',
		                'rgba(255, 159, 64, 0.2)'
		            ],
		            borderColor: [
		                'rgba(255,99,132,1)',
		                'rgba(54, 162, 235, 1)',
		                'rgba(255, 206, 86, 1)',
		                'rgba(75, 192, 192, 1)',
		                'rgba(153, 102, 255, 1)',
		                'rgba(255, 159, 64, 1)'
		            ],
		            borderWidth: 1
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        }
		    }
		});
=======
 * <span class="x-lprjelm x-lprjvar-label">My sample label</span>
 * <span class="x-lprjelm x-lprjvar-width">300</span>
 * <span class="x-lprjelm x-lprjvar-height">300</span>
 * <span class="x-lprjelm x-lprjvar-consolidatedata">true</span>
 * </div>
 * 
 * 
 */
var Application_WidgetChart = Object.extend(Application_Widget, {
	
	sWidget: "widgetchart",
	oElement: null,
	oCanvas: null,
	oElementLoading: null,
	oApplication: null,
	
	// Defaults
	aDefaultBgColor: ["rgba(255, 99, 132, 0.2)","rgba(54, 162, 235, 0.2)","rgba(255, 206, 86, 0.2)","rgba(75, 192, 192, 0.2)"],
	aDefaultBorderColor: [ "rgba(255,99,132,1)","rgba(54, 162, 235, 1)","rgba(255, 206, 86, 1)","rgba(75, 192, 192, 1)"],
	
	sChartType: "bar",
	
	aData:[],
	
	sId :"",
	aExternalLib:["Chart.min.js"],
	
	sLabel: "",
	sWidth:200,
	sHeight: 200,
	
	bConsolidateData: false,
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		
		this.sChartType = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"charttype");
		this.sLabel = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"label");
		var sWidth = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"width");
		var sHeight = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"height");
		
		if (this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"consolidatedata") == "true"){
			this.bConsolidateData = true;
		}
		
		// Keep default if no values are found on widget definition
		if (sWidth != ""){
			this.sWidth = sWidth;
		}
		if (sHeight != ""){
			this.sHeight = sHeight;
		}
		
		this.sId = $(this.oElement).attr("id");
		
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Init Chart widget");
		}
		
	},
	
	startWidget: function(oCallback){
		if (this.oApplication.bDebug){
			this.oApplication.writeDebugMsg("Chart widget started");
		}
		$(this.oElement).css({
            "width": this.sWidth,
            "height": this.sHeight
        });
		
		
		
		this.oElementLoading = $("<span>Loading...</span>");
		$(this.oElement).append(this.oElementLoading);
		
		this.oCanvas = $('<canvas/>',{
             id: 'canvas_'+this.sId                   
         }).prop({
             width: this.sWidth,
             height: this.sHeight
         });
		$(this.oElement).append(this.oCanvas);
		
		// Append SVG
		oCallback();
	},
	
	fireAction: function(oData){
		
		// Validate data:
		// bar need: data and labels, optionally background color and border color
		
		
		 
		if (this.bConsolidateData){
			var oConsolidatedData = {};
			oConsolidatedData.data = [];
			oConsolidatedData.labels = [];
			for (var i=0; i < oData.length; i++){
				oConsolidatedData.data[i]=oData[i].data;
				oConsolidatedData.labels[i]=oData[i].labels;
			}
			
			var oData = oConsolidatedData;
		}
		
		
		
		
		if (this.sChartType == "bar"){
			
			// TODO cycle color list
			if (oData.bgColors == undefined){
				var k = 0;
				
				oData.bgColors = [];
				for (var i = 0; i< oData.data.length; i++){
					if (k >= this.aDefaultBgColor.length){
						k = 0;
					}else{
						k++;
					}
					
					oData.bgColors[i] = this.aDefaultBgColor[k];
				}
				
			}
			
			if (oData.borderColors == undefined){
				var k = 0;
				oData.borderColors = [];
				
				for (var i = 0; i< oData.data.length; i++){
					if (k >= this.aDefaultBgColor.length){
						k = 0;
					}else{
						k++;
					}
					oData.borderColors[i] = this.aDefaultBorderColor[k];
				}
				
			}
			
			
			oDataset = [{
	            label: this.sLabel,
	            data: oData.data,
	            backgroundColor:oData.bgColors,
	            borderColor:oData.borderColors ,
	            borderWidth: 1
	        }];
		}
		
		
		var ctx = $("#canvas_"+this.sId)[0].getContext('2d');
		var myChart = new Chart(ctx, {
		    type: this.sChartType,
		    data: {
		        labels: oData.labels,
		        datasets: oDataset
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        }
		    }
		});
		$(this.oElementLoading).hide();
		myChart.canvas.parentNode.style.width = this.sWidth;
		myChart.canvas.parentNode.style.height = this.sHeight;
>>>>>>> branch 'master' of https://github.com/linoproject/ui
	}
});
