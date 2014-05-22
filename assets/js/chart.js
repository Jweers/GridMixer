/* d3: dynamic stacked line chart.js */
var n = 40; //number of points to display at any given time
var needle, techBars;

//Overload d3 with a method to control the zindex of elements
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function loadChart(data){
  var margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
  
  var x = d3.time.scale()
    .domain([GM.currentTime, (n - 2) * GM.intervalDuration + GM.currentTime])
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
  
  //Set up the current mix bars 
  techBars = d3.select('#techBars'); 
  var mix = GM.getCurrentMix();
  for (tech in mix){
    if (typeof mix[tech] == 'function'){
      continue;
    }
    //Set initial zero value for each tech
    techBars.append("rect")
    .attr("class",'tech-bar ' + tech + '-bar')
    .attr("x", 38)
    .attr("y", y(0))
    .attr("width", 7)
    .attr("height", 0);
  }
  techBars.update = function(){
    var mix = GM.getCurrentMix();
    var techBarFoundation = 0;
    for (tech in mix){
      if (typeof mix[tech] == 'function'){
        continue;
      }
      //Set current value for each tech
      var barHeightPx = (y(0) - y(mix[tech]));
      techBars.select('.'+tech+'-bar')
      .attr("y", y(techBarFoundation) - barHeightPx)
      .attr("height", barHeightPx);
      //Inverse Increment foundation so the bars stack
      techBarFoundation += mix[tech];
    }
    return this;
  };
  techBars.update().moveToFront();
  
  
  //Set up the needle, move it to the front, and set it to the appropriate starting value
  needle = d3.select("#needle");
  needle.moveToFront();
  needle.moveTo = function(val){
    var pos = y(val);
    return this.attr('transform','translate(0,'+pos+')');
  };
  needle.moveTo(GM.getCurrentSupply());
  
                  
  
  tick();
  
  
  function tick() {
    if (GM.active){
      // update the domains
      GM.incrementTime();
      x.domain([GM.currentTime, (n - 2) * GM.intervalDuration + GM.currentTime]);
      
      // push a new data point onto the back
      /* Not necessary.  May be able to add end-of-level shading here...
      data.push({
        demand: Math.abs(Math.random()) * 50, 
        time: GM.currentTime + (n * GM.intervalDuration)
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
        .attr("transform", "translate(" + x(GM.currentTime - GM.intervalDuration) + "," + x(GM.currentTime) + ")");

      // redraw the area and slide it left
      demandarea.attr("d", area)
        .attr("transform", null)
        .transition()
          .duration(GM.speed)
          .ease("linear")
          .attr("transform", "translate(" + x(GM.currentTime - GM.intervalDuration) + "," + x(GM.currentTime) + ")")
          .each("end", tick);    

      
      // pop the old data point off the front
      data.shift();      
    } else {
      setTimeout(tick, GM.speed);
    }

  }
}

