/**
 * @class Application_WidgetChart
 * 
 * Insert index and anchor to element
 * <div class="x-lprjwdg-widgetchart" id="chart1">
 * <span class="x-lprjelm x-lprjvar-charttype">bar</span>
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
	}
});
