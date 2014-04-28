/* GM game controller (object) */ 
var GM = {
  active: false,
  
  /**
   * Returns the data object for level 'n'
   * ! For now, just randomly generates a level 
   * @param id level id
   * @returns {Array} data (array of objects)
   */
  getLevel: function(id){
    //randomly generated level 'n'
    var data = [];
    var demand = 13;
    var intervals = this.getNumberOfIntervals();
    for (var i=0; i < intervals; i++){
      demand += Math.abs(Math.random()) * 2 - 1;
      if (i > parseInt(intervals/4) && i < (intervals / 2)){
        demand += Math.abs(Math.random()) * 3;
      }else if (i > intervals/2){
        demand -= Math.abs(Math.random()) * 1;
      }
      data.push({
        demand: demand,
        time: this.midnight + (i * this.intervalDuration)
      });
    }
    return data;
  },
  
  getNeedle: function(){
    return this.needle;
  },
  
  getNumberOfIntervals: function(){
    var timeInADay = 24*60*60*1000;
    return timeInADay / this.intervalDuration;
  },
  
  incrementNeedle: function(){
    this.needle += this.intervalDuration;
    return this.needle;
  },
  
  intervalDuration: 15*60*1000, //15 minutes
  
  midnight: new Date().setHours(0,0,0,0),
  
  needle: undefined, //starts at midnight and increments by intervalDuration
  
  speed: 100, //Tweak this to control the speed of the level
  
  start: function(){
    this.active = true;
  },
  
  stop: function(){
    this.active = false;
  }
};

//Initialize
GM.needle = GM.midnight;
