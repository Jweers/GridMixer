/* d3: dynamic stacked line chart.js */
var n = 40; //number of points to display at any given time

function loadChart(data){
  var margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
  
  var x = d3.time.scale()
    .domain([GM.needle, (n - 2) * GM.intervalDuration + GM.needle])
    .range([0, width]);
  
  var y = d3.scale.linear()
    .domain([0, 50])
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
    if (GM.active){
      // update the domains
      GM.incrementNeedle();
      x.domain([GM.needle, (n - 2) * GM.intervalDuration + GM.needle]);
      
      // push a new data point onto the back
      /* Not necessary.  May be able to add end-of-level shading here...
      data.push({
        demand: Math.abs(Math.random()) * 50, 
        time: GM.needle + (n * GM.intervalDuration)
      }); */
      
      // slide the x-axis left
      axis.transition()
          .duration(GM.speed)
          .ease("linear")
          .call(x.axis);
      
      
      // redraw the line slide it left
      demandcurve.attr("d", line)
      .attr("transform", null)
      .transition()
        .duration(GM.speed)
        .ease("linear")
        .attr("transform", "translate(" + x(GM.needle - GM.intervalDuration) + "," + x(GM.needle) + ")");

      // redraw the area and slide it left
      demandarea.attr("d", area)
        .attr("transform", null)
        .transition()
          .duration(GM.speed)
          .ease("linear")
          .attr("transform", "translate(" + x(GM.needle - GM.intervalDuration) + "," + x(GM.needle) + ")")
          .each("end", tick);    

      
      // pop the old data point off the front
      data.shift();      
    } else {
      setTimeout(tick, GM.speed);
    }

  }
}
