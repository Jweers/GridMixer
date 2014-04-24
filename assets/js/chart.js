/* d3: dynamic stacked line chart.js */
var parseDate = d3.time.format("%d-%b-%y").parse;
var midnight = new Date().setHours(0, 0, 0, 0);

//Randomly generate data
var count = 1;
var n = 40, //number of points to display at any given time
    data = d3.range(n).map(function(n){
      return {
        demand: Math.abs(Math.random()), 
        time: n};
    });


$(function(){
  var margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
  
  var x = d3.scale.linear()
    .domain([count, n - 2 + count])
    .range([0, width]);
  
  var y = d3.scale.linear()
    .domain([0, 1])
    .range([height, 0]);
  
  var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.demand); });
  
  var area = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.time); })
    .y0(height)
    .y1(function(d) { return y(d.demand); });
  
  var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);
  
  var axis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(x.axis = d3.svg.axis().scale(x).orient("bottom"));
  
  svg.append("g")
    .attr("class", "y axis")
    .call(d3.svg.axis().scale(y).orient("left"));
  
  var demandcurve = svg.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
  
  var demandarea = svg.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);
  
  tick();
  
  
  function tick() {
  
    // update the domains
    count++;
    x.domain([count, n - 2 + count]);
    
    // push a new data point onto the back
    data.push({
      demand: Math.abs(Math.random()), 
      time: n + count
    });
    
    // slide the x-axis left
    axis.transition()
        .duration(500)
        .ease("linear")
        .call(x.axis);
    
    
    // redraw the line slide it left
    demandcurve.attr("d", line)
    .attr("transform", null)
    .transition()
      .duration(500)
      .ease("linear")
      .attr("transform", "translate(" + x(count-1) + "," + x(count) + ")");

    // redraw the area and slide it left
    demandarea.attr("d", area)
      .attr("transform", null)
      .transition()
        .duration(500)
        .ease("linear")
        .attr("transform", "translate(" + x(count-1) + "," + x(count) + ")")
        .each("end", tick);    

    
    // pop the old data point off the front
    data.shift();
  
  }
});