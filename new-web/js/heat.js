var margin = {top: 30, right: 40, bottom: 30, left: 200},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
var filtervalue="";
var max=-1,min=10000;
var X = {};
var Y = {};
var meas = {};
var dataArr = [];
var codefile = "(epsilon,alpha)-plot.csv";
var datafile = "";
function drawAxes(gridItemHeight, gridItemWidth, viz){
	
	//console.log(xTickList.length,yTickList.length);
 // var xAxis = d3.svg.axis().scale(x).ticks(0);//ticks(xTickList.length);
 // var yAxis = d3.svg.axis().scale(y).ticks(0);//ticks(yTickList.length).orient("left");

 // viz.selectAll("g.x.axis").remove();
  //viz.selectAll("g.y.axis").remove();
  
  
  
  /*viz.append("g")            // Add the X Axis
    .attr("class", "x axis")
    .attr("transform", "translate(0," + heightWin + ")")
    .call(xAxis);

  viz.append("g")
      .attr("class", "y axis")
      .call(yAxis);*/
	  
   for(var i=0;i<X.length;i++)
	{
			  viz.append("text")
			  .attr("class", "x label")
			  .attr("text-anchor", "middle")
			  .attr("x", i*gridItemWidth+gridItemWidth/2) //+gridItemWidth/2
			  .attr("y", height + 15)
			  //.attr("transform", "translate("+((i+1)*gridItemWidth/2)+",0)")
			  .style("font-weight", 400)
			  .style("font-size", "10px")
			  .text(X[i]);
			  
	}
   viz.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width*0.4)
      .attr("y", height + 35)
      .style("font-weight", 400)
      .style("font-size", "14px")
      .text("epsilon");

  for(var i=0;i<Y.length;i++)
	{
			  viz.append("text")
			  .attr("class", "y label")
			  .attr("text-anchor", "middle")
			  .attr("x", i*gridItemWidth+gridItemWidth/2) //+gridItemWidth/2
			  .attr("y", height + 15)
			  //.attr("transform", "translate("+((i+1)*gridItemWidth/2)+",0)")
			  .style("font-weight", 400)
			  .style("font-size", "10px")
			  .text(Y[i]);
			  
	}
   viz.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width*0.4)
      .attr("y", height + 35)
      .style("font-weight", 400)
      .style("font-size", "14px")
      .text("alpha");
  
  /*for(var i=0;i<X.length;i++)
	{
			  viz.append("text")
			  .attr("class", "y label")
			  .attr("text-anchor", "left")
			  .attr("x", gridItemWidth*Y.length+12)
			  .attr("y", height - (i*gridItemHeight+gridItemHeight/4))
			  //.attr("transform", "rotate(-90)")
			  .style("font-weight", 400)
			  .style("font-size", "10px")
			  .text(componentCodes[X[i]]);
			  
	}*/
  
 /* viz.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "translate("+(-50)+",0)rotate(-90)")//"translate("+(widthWin+40)+",0)rotate(-90)")
    .style("font-weight", 400)
    .style("font-size", "14px")
    .text("Colors");*/
	
  
	
}


var basic = d3.select(".visualization").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom+20);

var viz = basic.append("g")
    .attr("transform", 
          "translate(" + margin.left/2 + "," + margin.top + ")");
var basicLegend = d3.select("#colorLegend").append("svg")
	.style("overflow", 'visible')
    .style("margin-bottom", '20px')
    .attr("width", width + margin.left + margin.right).attr("height",height + margin.top + margin.bottom+50).append("g").attr("transform", 
          "translate(" + margin.left/2 + "," + margin.top + ")");

function render(){

    console.log("here");
	
	console.log(dataArr);
	max = Math.max.apply(Math,dataArr.map(function(o){return o.Total;}));
	min = Math.min.apply(Math,dataArr.map(function(o){return o.Total;}));
	console.log(min,max);
	
	
		
	viz.selectAll("rect").remove();
	viz.selectAll("text").remove();
	
	basicLegend.selectAll("rect").remove();
	basicLegend.selectAll("text").remove();

	viz.selectAll("text.x.label").remove();
   viz.selectAll("text.y.label").remove();
	
	var colors = d3.scale.linear()
    .domain([min,max])
    .range(["lightblue", "darkblue"])
    .interpolate(d3.interpolateHcl);
		var xPos=0;
	  var yPos=0;
	  var rectW= 0;
	  var rectH=0;
	  var gridItemWidth = width / X.length;
		var gridItemHeight = height / X.length;
		var legendElementWidth = 2;//((widthWin + margin.left + margin.right)/2)/colors.length;
		
      for(var i=0;i<X.length;i++)
	  {
		  for(var j=0;j<Y.length;j++)
		  {
			  xPos = j*gridItemWidth;
			  yPos = i*gridItemHeight;//segmentArr_[i].yb-yMin
			  rectW = gridItemWidth;
			  rectH = gridItemHeight;
			  
			  var rectangle = viz.append("rect")
                            .attr("x", xPos)
                           .attr("y", yPos)
                           .attr("width", rectW)
						   .attr("height", rectH)
						   .style("fill", colors(meas[X[i]][Y[j]])) //d3.interpolateHcl(paleYellow, darkBlue)(segmentArr_[i].a))//function(d) {     return heatmapColor(segmentArr_[i].a)})
						   .style("stroke", '#555');
						   
			   
		  }
		  
		 
	  }
		  
	  drawAxes(gridItemHeight, gridItemWidth, viz);
		
	
		
		var legendElementWidth = Math.ceil(((1.0*(width + margin.left + margin.right))/2)/(2*(max-min)));
		
		for(var i=min,j=0;i<=max;i++,j++)
		  {
			  //console.log("x",legendElementWidth * j);
			  var rectangle = basicLegend.append("rect")
								.attr("x", legendElementWidth * j)
							   .attr("y", 0)
							   .attr("width", legendElementWidth)
							   .attr("height", gridItemHeight)
							   .style("fill", colors(i)) //d3.interpolateHcl(paleYellow, darkBlue)(segmentArr_[i].a))//function(d) {     return heatmapColor(segmentArr_[i].a)})
							   .style("stroke", '#555')
							   .style("stroke-width", 0);;
			  //rectangle.append("title").text(function(d){return segmentArr_[i].a});
		  }
		
		basicLegend.append("text")
		.attr("class", "mono")
            .text(min)
            .attr("x", -10)
			.attr("y", gridItemHeight+10);
			
		 basicLegend.append("text")
		.attr("class", "mono")
            .text("Total Samples (count)")
            .attr("x", legendElementWidth*(max-min)/3)
            .attr("y", gridItemHeight+10);
    
		basicLegend.append("text")
		.attr("class", "mono")
            .text(max)
            .attr("x", legendElementWidth*j)
            .attr("y", gridItemHeight+10);
	
		 
	 
	
}


function generateMap(){

    //var file = "componentCodes.csv";
    

    d3.csv(codefile, function(data) {
		
		for(var i=0;i<data.length;i++)
		{
			//console.log(data[i]);
			X[i] =  data[i].epsilon;//data[i].Color
			
			Y[i] = data[i].alpha;
			
			mas[X[i]][Y[i]] = data[i].Total;
			
		}
		
		
		
		});

	

}


$('#filterattr').on('change', function(){
	 d3.csv(codefile, function(data) {
		
		for(var i=0;i<data.length;i++)
		{
			//console.log(data[i]);
						
			meas.epsilon = data[i].epsilon;
			meas.alpha = data[i].alpha;
			meas.Total = parseInt(data[i].Total);

			dataArr[i] = meas;

			meas = {};
			
		}
		
		
		
		});
	 
 });
