var margin = {top: 30, right: 40, bottom: 30, left: 200};
var width = 1000 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var semanticLabels = ["casual","chic","classic","clear","cool casual","dandy","dynamic","elegant","gorgeous","modern","natural","pretty","romantic"];

var type = '';
var codefile = '';
var datafile = '';

var componentCodes = {};    // color/font mapping
var dataCount = {};         // total number of occurences in data
var dataProb = {};              // condtitional probability model
var dataSize = 0;

var min = 10000, max = -1;

var Semantics = function() {
				this.casual = 0;
				this.chic = 0;
				this.classic = 0;
				this.clear = 0;
				this.cool = 0;
				this.dandy = 0;
				this.dynamic = 0;
				this.elegant = 0;
				this.gorgeous = 0;
				this.modern = 0;
				this.natural = 0;
				this.pretty = 0;
				this.romantic = 0;
				this.total = 0;
};

function initData() {

		componentCodes = {};
		dataCount = {};
		dataDir = "data/";

		if(type === "Color") {
				codefile = dataDir + "colorcodes.csv";
				datafile = dataDir + "colors.csv"; 
		}
		else {
				codefile = dataDir + "fontcodes.csv";
				datafile = dataDir + "fonts.csv"; 
		}

		generateBook();
		generateCount();
		$.when( $.ajax( generateCount() ) ).then(function() {
			$.when( $.ajax( calculateProb() ) ).then(function() {
				sortProb();
			});
		});

}

function generateBook(){
	d3.csv(codefile, function(data) {   // key - hexavalue, val - color name
		for(var i = 0; i < data.length; i++) {
			componentCodes[data[i][type]] =  data[i].Name;
			dataCount[data[i][type]] = new Semantics();
			dataProb[data[i][type]]= new Semantics();
		}
	});
}

Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

function generateCount(){
	d3.csv(datafile, function(data) {
		for (var i = 1; i < data.length; i++) {
			var row = data[i]
			var name = '';
			for (var key in row) {
				if( key === type ) name = row[key];
				else if(row[key] == 1) {
					dataCount[name][key]++;
					dataCount[name].total++;

					if (dataCount[name][key] > max) max = dataCount[name][key];
					if (dataCount[name][key] < min) min = dataCount[name][key];
				}
			}
		}
		dataSize = Object.size(dataCount);
	});
}

function drawXLabel(gridItemWidth, gridItemHeight, viz){
	for(var i = 0;i < semanticLabels.length; i++) {
			viz.append("text")
					.attr("class", "x label")
					.attr("text-anchor", "middle")
					.attr("x", i*gridItemWidth+gridItemWidth/2)
					.attr("y", gridItemHeight*dataSize + 15)
					.style("font-weight", 400)
					.style("font-size", "10px")
					.text(semanticLabels[i]);
	}
		
	viz.append("text")
			 .attr("class", "x label")
			 .attr("text-anchor", "end")
			 .attr("x", width*0.45)
			 .attr("y", gridItemHeight*dataSize + 35)
			 .style("font-weight", 400)
			 .style("font-size", "14px")
			 .text("Semantic Labels");

}

function drawLegend(gridItemWidth, gridItemHeight, colors, viz, legend) {

		var legendElementWidth = Math.ceil(((1.0*(width + margin.left + margin.right))/2)/(2*(max-min)));
		
		for(var i=min,j=0;i<=max;i++,j++) {
				var rectangle = legend.append("rect")
																										.attr("x", legendElementWidth * j)
																										.attr("y", 0)
																										.attr("width", legendElementWidth)
																										.attr("height", gridItemHeight)
																										.style("fill", colors(i))
																										.style("stroke", '#555');
		}
								
		legend.append("text")
								.attr("class", "mono")
								.text(min)
								.attr("x", -10)
								.attr("y", gridItemHeight+15);
												
		legend.append("text")
								.attr("class", "mono")
								.text("Count")
								.attr("x", legendElementWidth*(max-min)/2)
								.attr("y", gridItemHeight+15);
				
		legend.append("text")
								.attr("class", "mono")
								.text(max)
								.attr("x", legendElementWidth*j)
								.attr("y", gridItemHeight+15);

}

function removeViz() {
	var viz = document.getElementById("viz");
	while (viz.firstChild) {
	  viz.removeChild(viz.firstChild);
	}
}


function render(){

	$('#viz').show();
	$('#legend').show();
	$('#table').hide();

	removeViz();

	var basic = d3.select('#viz')
		.append('svg')
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom+20);

	var viz = basic.append("g")
			.attr("transform", 
						"translate(" + margin.left/2 + "," + margin.top + ")");
	var legend = d3.select("#legend").append("svg")
			.style("overflow", 'visible')
			.style("margin-bottom", '20px')
			.attr("width", width + margin.left + margin.right).attr("height",height + margin.top + margin.bottom+50).append("g").attr("transform", 
						"translate(" + margin.left/2 + "," + margin.top + ")");


	var colors = d3.scale.linear()
											 .domain([min, max])
											 .range(["white", "black"])
											 .interpolate(d3.interpolateHcl);
	var xPos = 0;
	var yPos = 0;
	var rectW = 0;
	var rectH =0;
	var gridItemWidth = 45;
	var gridItemHeight = 20;
	var legendElementWidth = 2;
	
	var i = 0, j = 0;;
	for(var name in dataCount) {
		for(var sem in dataCount[name]) {
			if (sem !== "total") {
				xPos = j*gridItemWidth;
				yPos = i*gridItemHeight;
				rectW = gridItemWidth;
				rectH = gridItemHeight;
												
				var rectangle = viz.append("rect")
													 .attr("x", xPos)
													 .attr("y", yPos)
													 .attr("width", rectW)
													 .attr("height", rectH)
													 .style("fill", colors(dataCount[name][sem]))
													 .style("stroke", '#555');
																								 
				rectangle.append("title").text(function(d) {
					var info = componentCodes[name] + "\n";
					info += "SemLabel: " + sem + "\n";
					info += "Count: " + dataCount[name][sem]; 
					return info;
				});
			}

			// color grid
			if (type === "Color") {
				viz.append("rect")
					 .attr("x", -1.5*gridItemWidth)
					 .attr("y", yPos)
					 .attr("width", rectW)
					 .attr("height", rectH)
					 .style("fill", name)
					 .style("stroke", '#555');
			}

			j++; 
		}

		// Y label
		viz.append("text")
			 .attr("class", "y label")
			 .attr("text-anchor", "left")
			 .attr("x", gridItemWidth*semanticLabels.length+12)
			 .attr("y", gridItemHeight/1.5+yPos)
			 .style("font-weight", 400)
			 .style("font-size", "10px")
			 .text(componentCodes[name]);
		
		i++;
		j = 0;
	}

	drawXLabel(gridItemWidth, gridItemHeight, viz);
	drawLegend(gridItemWidth, gridItemHeight, colors, viz, legend);
}

function calculateProb() {

	for(var name in dataCount) {
		for(var sem in dataCount[name]) {
			dataProb[name][sem] = dataCount[name][sem]/dataCount[name].total;
		}
	}
}

function sortProb() {
	var sorted = {}
	for(var name in dataProb) {
		sorted[name] = []
		for(var sem in dataProb[name]) {
			if (sem !== 'total'){
				sorted[name].push([sem, dataProb[name][sem]])
			}
		}
		sorted[name].sort(function(a, b) { return b[1] - a[1]} )
	}
	
	return sorted
}

function showProb() {

	$('#viz').hide();
	$('#legend').hide();
	$('#table').show();

	var table = document.getElementById("table");
	var headR = table.insertRow(0);
	var headC1 = headR.insertCell(0);
	var headC2 = headR.insertCell(1);
	var headC3 = headR.insertCell(2);
	headC1.innerHTML = "Color";
	headC2.innerHTML = "Semantic Lable";
	headC3.innerHTML = "P(Color | Semantic Label)";

	var count = 1;
	for(var name in dataCount) {
		for(var sem in dataCount[name]) {
			if (sem !== "total"){
				var row = table.insertRow(count);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);

				cell1.innerHTML = name;
				cell2.innerHTML = sem;
				cell3.innerHTML = dataProb[name][sem].toFixed(2);
				console.log(dataProb[name][sem])
				count++;
			}
		}
	}

}

function showViz() {
	render()
}

function showBar() {

	$('#viz').show();
	$('#legend').hide();
	$('#table').hide();

	removeViz();

	var basic = d3.select('#viz')
		.append('svg')
		.attr("width", width + margin.left + margin.right)
		.attr("height", dataSize*2*20 + margin.top + margin.bottom);

	var viz = basic.append("g")
			.attr("transform", 
						"translate(" + margin.left/2 + "," + margin.top + ")");

	var sorted = sortProb();

	var colors = [ '#F27077', '#AE77B2', '#6CADDF', '#9DD374', '#E194BC'];
	var barWidth = 500;
	var barHeight = 20;
	
	var i = 0;
	for(var name in sorted) {
		var xPos = 50;
		var yPos = i*barHeight;
		var rectW = 0;
		var rectH = barHeight;

		viz.append("text")
			 .attr("class", "y label")
			 .attr("text-anchor", "left")
			 .attr("x", xPos - 50)
			 .attr("y", yPos - 5)
			 .style("font-weight", 400)
			 .style("font-size", "10px")
			 .text(componentCodes[name]);
		if (type === "Color") {
				viz.append("rect")
					 .attr("x", xPos - 50)
					 .attr("y", yPos)
					 .attr("width", 40)
					 .attr("height", rectH)
					 .style("fill", name);
		}

		for(var j = 0; j < 4; j++) {
				xPos += rectW;
				rectW = barWidth*sorted[name][j][1];
												
				var rectangle = viz.append("rect")
													 .attr("x", xPos)
													 .attr("y", yPos)
													 .attr("width", rectW)
													 .attr("height", rectH)
													 .style("fill", colors[j]);
																								 
				rectangle.append("title").text(function(d) {
					var info = componentCodes[name] + "\n";
					info += "SemLabel: " + sorted[name][j][0] + "\n";
					info += "Count: " + dataCount[name][sorted[name][j][0]] + "\n"; 
					info += "Probability: " + (dataProb[name][sorted[name][j][0]] * 100).toFixed(2) + "%"; 
					return info;
				});

		}
		// last bar
		xPos += rectW
		var rectangle = viz.append("rect")
													 .attr("x", xPos)
													 .attr("y", yPos)
													 .attr("width", barWidth - xPos)
													 .attr("height", rectH)
													 .style("fill", colors[4]);
																								 
		rectangle.append("title").text(function(d) {
			var info = componentCodes[name] + "\n";
			info += "etc";
			return info;
		});

		var rectangle = viz.append("rect")
													 .attr("x", 0)
													 .attr("y", yPos + barHeight)
													 .attr("width", barWidth)
													 .attr("height", rectH)
													 .style("fill", 'white')
													 .style("stroke", 'white');
		i += 2;
		
	}

}


$(document).ready(function() { 

	$('#typeattr').on('change', function(){
		type = $(this).find('option:selected').val();
		initData();
	});

	$('#viz').hide();
	$('#legend').hide();
	$('#table').hide();

});

