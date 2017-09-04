/**
 * @class Application_WidgetChart
 * 
 * Insert index and anchor to element
 * <div class="x-lprjwdg-widgetchart" id="chart1">
 * <span class="x-lprjelm x-lprjvar-charttype">bar</span>
 * <span class="x-lprjelm x-lprjvar-label">My sample label</span>
 * <span class="x-lprjelm x-lprjvar-width">300</span>
 * <span class="x-lprjelm x-lprjvar-height">300</span>
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
	sWidth:200,
	sHeight: 200,
	
	constructor: function(oElement, oApplication){
		
		this.oElement = oElement;
		this.oApplication = oApplication;
		
		this.sChartType = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"charttype");
		this.sLabel = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"label");
		var sWidth = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"width");
		var sHeight = this.oApplication.oLibClass.Vars.findElementVar(this.oElement,"height");
		
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
		this.oCanvas = $('<canvas/>',{
             id: 'canvas_'+this.sId                   
         }).prop({
             width: this.sWidth,
             height: this.sHeight
         });
		$(this.oElement).append(this.oCanvas);
		
		// Append SVG
		
	},
	
	fireAction: function(oData){
		
		// Validate data:
		// bar need: data and labels, optionally background color and border color
		
		console.log(oData);
		
		if (this.sChartType == "bar"){
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
		
		myChart.canvas.parentNode.style.width = this.sWidth;
		myChart.canvas.parentNode.style.height = this.sHeight;
	}
});
