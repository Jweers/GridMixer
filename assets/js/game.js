/* GM game controller (object) */ 
var GM = {
  active: false,
  level: {},
  
  getCurrentMix: function(){
    return this.mix;
  },
  
  /**
   * Returns the data object for level 'n'
   * ! For now, just randomly generates a level 
   * @param id level id
   * @returns {Array} data (array of objects)
   */
  getLevel: function(id){
    //fetch level from database
    $.ajax({
      url: 'api',
      type:"POST",
      dataType: 'json',
      data: {
        action: 'getLevel',
        id: id,
        format: 'json'
      },
      success: function(response){
        if (response.error){
          //showAlert('#gameAlert', response.errorMsg);
          alert('Failed to load level: ' + errorMsg);
          return;
        }
        var levelInfo = response.result;
        GM.level = levelInfo; // keep? or parse?
        //load level starting mix
        for (i in levelInfo.technologies){
          var tech = levelInfo.technologies[i];
          GM.mix[tech.name] = tech.startingVal;
        }
        //load level data
        var levelData =  levelInfo.demand;
        for (i in levelData){
          //Convert time string to current datetime objects
          var time = levelData[i].time.split(':');
          levelData[i].time = new Date().setHours(time[0],time[1],time[2],0);
        }
        GM.level.demand = levelData;
        loadChart(levelData);
      }
    });    
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
  
  mix: {
    coal: 0,
    hydro: 0,
    wind: 0,
    solar: 0,
    ng: 0,
    //Support functions
    tweak: function(tech,dir){
      if (!tech){
        return null;
      }
      if (dir == "up"){
        this[tech] += this._incrementFactor;  
      }
      if (dir == "down"){
        this[tech] -= this._incrementFactor;
      }
      console.log(GM.mix);
      return this[tech];
    },
    _incrementFactor: 1 //adjust to handicap the impact of an adjustment click
  }, 
  
  needle: undefined, //starts at midnight and increments by intervalDuration
  
  speed: 250, //Tweak this to control the speed of the level (lower number = faster level)
  
  start: function(){
    this.active = true;
  },
  
  stop: function(){
    this.active = false;
  },
  
  technologies: [] //technologies available to this level
};

//Initialize
GM.needle = GM.midnight;
