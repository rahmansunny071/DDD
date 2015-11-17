var margin = {top: 30, right: 40, bottom: 30, left: 200},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
var filtervalue="";
var max=-1,min=10000;
var componentCodes = []; // color/font mapping to name
var countArray = []; // object array, each entry in the is a count for a given semantic label
var componentArray = []; // color/ font array
var codefile = "";
var datafile = "";
var semanticLabels = ["casual","chic","classic","clear","cool casual","dandy","dynamic","elegant","gorgeous","modern","natural","pretty","romantic"];
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
	  
   for(var i=0;i<semanticLabels.length;i++)
	{
			  viz.append("text")
			  .attr("class", "x label")
			  .attr("text-anchor", "middle")
			  .attr("x", i*gridItemWidth+gridItemWidth/2) //+gridItemWidth/2
			  .attr("y", height + 15)
			  //.attr("transform", "translate("+((i+1)*gridItemWidth/2)+",0)")
			  .style("font-weight", 400)
			  .style("font-size", "10px")
			  .text(semanticLabels[i]);
			  
	}
   viz.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width*0.4)
      .attr("y", height + 35)
      .style("font-weight", 400)
      .style("font-size", "14px")
      .text("Semantic Labels");
  
  /*for(var i=0;i<componentArray.length;i++)
	{
			  viz.append("text")
			  .attr("class", "y label")
			  .attr("text-anchor", "left")
			  .attr("x", gridItemWidth*semanticLabels.length+12)
			  .attr("y", height - (i*gridItemHeight+gridItemHeight/4))
			  //.attr("transform", "rotate(-90)")
			  .style("font-weight", 400)
			  .style("font-size", "10px")
			  .text(componentCodes[componentArray[i]]);
			  
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
	console.log(componentCodes);

	console.log(componentArray);
	console.log(countArray);
	
	console.log(min,max);
	
	
		
	viz.selectAll("rect").remove();
	viz.selectAll("text").remove();
	
	basicLegend.selectAll("rect").remove();
	basicLegend.selectAll("text").remove();

	viz.selectAll("text.x.label").remove();
   viz.selectAll("text.y.label").remove();
	
	if(String(filtervalue)==String("Color"))
	{
				var colors = d3.scale.linear()
    .domain([min,max])
    .range(["white", "black"])
    .interpolate(d3.interpolateHcl);
		var xPos=0;
	  var yPos=0;
	  var rectW= 0;
	  var rectH=0;
	  var gridItemWidth = width / componentArray.length;
		var gridItemHeight = height / componentArray.length;
		var legendElementWidth = 2;//((widthWin + margin.left + margin.right)/2)/colors.length;
		console.log(width,componentCodes.length,gridItemWidth);
      for(var i=0;i<componentArray.length;i++)
	  {
		  for(var j=0;j<semanticLabels.length;j++)
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
						   .style("fill", colors(countArray[componentArray[i]][semanticLabels[j]])) //d3.interpolateHcl(paleYellow, darkBlue)(segmentArr_[i].a))//function(d) {     return heatmapColor(segmentArr_[i].a)})
						   .style("stroke", '#555');
						   
			   rectangle.append("title").text
									(
										function(d)
										{
											var number=countArray[componentArray[i]][semanticLabels[j]]; 
											var colorName="Color: "+componentCodes[componentArray[i]]+"\n";
											var semLabel="SemLabel: "+semanticLabels[j]+"\n";
											return colorName+semLabel+"Count: "+number;

												
										}
									);
		  }
		  if(String(filtervalue) == String("Color"))
		  {
			  viz.append("rect")
								.attr("x", -1.5*gridItemWidth)
							   .attr("y", yPos)
							   .attr("width", rectW)
							   .attr("height", rectH)
							   .style("fill", componentArray[i]) //d3.interpolateHcl(paleYellow, darkBlue)(segmentArr_[i].a))//function(d) {     return heatmapColor(segmentArr_[i].a)})
							   .style("stroke", '#555');
		  }
		  
	      viz.append("text")
			  .attr("class", "y label")
			  .attr("text-anchor", "left")
			  .attr("x", gridItemWidth*semanticLabels.length+12)
			  .attr("y", gridItemHeight/1.5+yPos)
			  //.attr("transform", "rotate(-90)")
			  .style("font-weight", 400)
			  .style("font-size", "10px")
			  .text(componentCodes[componentArray[i]]);
		  
		 
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
            .text("Color Legend (count)")
            .attr("x", legendElementWidth*(max-min)/3)
            .attr("y", gridItemHeight+10);
    
		basicLegend.append("text")
		.attr("class", "mono")
            .text(max)
            .attr("x", legendElementWidth*j)
            .attr("y", gridItemHeight+10);
	}
	else
	{
				var colors = d3.scale.linear()
    .domain([min,max])
    .range(["white", "black"])
    .interpolate(d3.interpolateHcl);
		var xPos=0;
	  var yPos=0;
	  var rectW= 0;
	  var rectH=0;
	  var gridItemWidth = width / (semanticLabels.length+3);
		var gridItemHeight = height / componentArray.length;
		var legendElementWidth = 2;//((widthWin + margin.left + margin.right)/2)/colors.length;
		console.log(width,componentCodes.length,gridItemWidth);
      for(var i=0;i<componentArray.length;i++)
	  {
		  for(var j=0;j<semanticLabels.length;j++)
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
						   .style("fill", colors(countArray[componentArray[i]][semanticLabels[j]])) //d3.interpolateHcl(paleYellow, darkBlue)(segmentArr_[i].a))//function(d) {     return heatmapColor(segmentArr_[i].a)})
						   .style("stroke", '#555');
						   
			   rectangle.append("title").text
									(
										function(d)
										{
											var number=countArray[componentArray[i]][semanticLabels[j]]; 
											var colorName="Font: "+componentCodes[componentArray[i]]+"\n";
											var semLabel="SemLabel: "+semanticLabels[j]+"\n";
											return colorName+semLabel+"Count: "+number;

												
										}
									);
		  }
		  		  
	      viz.append("text")
			  .attr("class", "y label")
			  .attr("text-anchor", "left")
			  .attr("x", gridItemWidth*semanticLabels.length+12)
			  .attr("y", gridItemHeight/1.5+yPos)
			  //.attr("transform", "rotate(-90)")
			  .style("font-weight", 400)
			  .style("font-size", "10px")
			  .text(componentCodes[componentArray[i]]);
		  
		 
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
            .text("Color Legend (count)")
            .attr("x", legendElementWidth*(max-min)/3)
            .attr("y", gridItemHeight+10);
    
		basicLegend.append("text")
		.attr("class", "mono")
            .text(max)
            .attr("x", legendElementWidth*j)
            .attr("y", gridItemHeight+10);
	}
		 
	 
	
}
function generateColorBook(){

    //var file = "componentCodes.csv";
    

    d3.csv(codefile, function(data) {
		
		for(var i=0;i<data.length;i++)
		{
			//console.log(data[i].Name,data[i].Color);
			componentCodes[data[i].Color] =  data[i].Name;//data[i].Color
			
			componentArray[i] = data[i].Color;
			
			var obj = [];
			
			for(var j=0;j<semanticLabels.length;j++)
			{
				obj[semanticLabels[j]] = 0;
			}
			countArray[data[i].Color]= obj;
			
			obj.length = 0;
		}
		
		
		
		});

	

}
function generateColorCount(){
		//var file = "colors.csv";
        d3.csv(datafile, function(data) {
        //console.log(countArray);
		
		
		for(var i=0;i<data.length;i++)
		{
			var obj = countArray[data[i].Color];
			
			//console.log(data[i].Color,countArray[data[i].Color]);
			for(var j=0;j<semanticLabels.length;j++)
			{
				
				if(String(semanticLabels[j])==String("casual"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].casual);
				if(String(semanticLabels[j])==String("chic"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].chic);
				if(String(semanticLabels[j])==String("classic"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].classic);
				if(String(semanticLabels[j])==String("clear"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].clear);
				if(String(semanticLabels[j])==String("cool casual"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].cool);
				if(String(semanticLabels[j])==String("dandy"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].dandy);
				if(String(semanticLabels[j])==String("dynamic"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].dynamic);
				if(String(semanticLabels[j])==String("elegant"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].elegant);
				if(String(semanticLabels[j])==String("gorgeous"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].gorgeous);
				if(String(semanticLabels[j])==String("modern"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].modern);
				if(String(semanticLabels[j])==String("natural"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].natural);
				if(String(semanticLabels[j])==String("pretty"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].pretty);
				if(String(semanticLabels[j])==String("romantic"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].romantic);
				
				if(max<obj[semanticLabels[j]])
					max = obj[semanticLabels[j]];

				if(min > obj[semanticLabels[j]])
					min = obj[semanticLabels[j]];
			}
			
			countArray[data[i].Color] = obj;
		}

		        

    });
	

}

function generateFontBook(){

    //var file = "componentCodes.csv";
    

    d3.csv(codefile, function(data) {
		
		for(var i=0;i<data.length;i++)
		{
			//console.log(data[i]);
			componentCodes[data[i].Font] =  data[i].Name;//data[i].Color
			
			componentArray[i] = data[i].Font;
			
			var obj = [];
			
			for(var j=0;j<semanticLabels.length;j++)
			{
				obj[semanticLabels[j]] = 0;
			}
			countArray[data[i].Font]= obj;
			
			obj.length = 0;
		}
		
		
		
		});

	

}

function generateFontCount(){
		//var file = "colors.csv";
        d3.csv(datafile, function(data) {
        //console.log(countArray);
		
		
		for(var i=0;i<data.length;i++)
		{
			var obj = countArray[data[i].Font];
			
			console.log(i,data[i]);
			for(var j=0;j<semanticLabels.length;j++)
			{
				
				if(String(semanticLabels[j])==String("casual"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].casual);
				if(String(semanticLabels[j])==String("chic"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].chic);
				if(String(semanticLabels[j])==String("classic"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].classic);
				if(String(semanticLabels[j])==String("clear"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].clear);
				if(String(semanticLabels[j])==String("cool casual"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].cool);
				if(String(semanticLabels[j])==String("dandy"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].dandy);
				if(String(semanticLabels[j])==String("dynamic"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].dynamic);
				if(String(semanticLabels[j])==String("elegant"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].elegant);
				if(String(semanticLabels[j])==String("gorgeous"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].gorgeous);
				if(String(semanticLabels[j])==String("modern"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].modern);
				if(String(semanticLabels[j])==String("natural"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].natural);
				if(String(semanticLabels[j])==String("pretty"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].pretty);
				if(String(semanticLabels[j])==String("romantic"))
					obj[semanticLabels[j]] = parseInt(obj[semanticLabels[j]])+ parseInt(data[i].romantic);
				
				if(max<obj[semanticLabels[j]])
					max = obj[semanticLabels[j]];

				if(min > obj[semanticLabels[j]])
					min = obj[semanticLabels[j]];
			}
			
			countArray[data[i].Font] = obj;
		}

		        

    });
	

}
//render();



 $('#filterattr').on('change', function(){
	 filtervalue = $(this).find("option:selected").val();
	 componentCodes = [];
     countArray = [];
     componentArray = [];
	 
	 componentCodes.length=0;
     countArray.length=0;
     componentArray.length=0;
	 if(String(filtervalue) == String("Font"))
	 {
		 
		 codefile = "fontcodes.csv";
		 datafile = "fonts.csv";
		 generateFontBook();
		generateFontCount();
	 }
	 
	else if(String(filtervalue) == String("Color"))
	{
		 
		 codefile = "colorcodes.csv";
		 datafile = "colors.csv";
		 generateColorBook();
			generateColorCount();
	 }	
	 
 });


