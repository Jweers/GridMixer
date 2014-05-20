/* GM game controller (object) */ 
var GM = {
  active: false,
  level: {},
  currentTime: undefined, //starts at midnight and increments by intervalDuration
  
  getCurrentMix: function(){
    return this.mix;
  },
  
  getCurrentSupply: function(){
    var supply = 0,
        mix = this.getCurrentMix();
    for (t in mix){
      if (typeof mix[t] != 'function'){
        supply += mix[t];
      }
    }
    return supply;
  },
  
  getCurrentTime: function(){
    return this.currentTime;
  },
  
  getNumberOfIntervals: function(){
    var timeInADay = 24*60*60*1000;
    return timeInADay / this.intervalDuration;
  },
  
  /**
   * Fetches the data object for level 'id' and loads the level
   * Initiates the loading of all chart and control elements.
   * @param id level id
   * @returns {Array} data (array of objects)
   */
  loadLevel: function(id){
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
        GM.level = levelInfo; // keep? or parse? //!!!!
     
        //load level starting mix and overload max capacity
        for (i in levelInfo.technologies){
          var tech = levelInfo.technologies[i];
          GM.mix[tech.name] = tech.startingVal;
          GM.technologies[tech.name].maxCapacity = tech.maxVal;
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
        buildGameControls(levelInfo.technologies);
      }
    });    
  },
  
  incrementTime: function(){
    this.currentTime += this.intervalDuration;
    return this.currentTime;
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
      //Debug
      console.log(GM.mix);
      return this[tech];
    },
    _incrementFactor: 1 //adjust to handicap the impact of an adjustment click
  },
  
  speed: 300, //Tweak this to control the speed of the level (lower number = faster level)
  
  start: function(){
    this.active = true;
  },
  
  stop: function(){
    this.active = false;
  },
  
  //all technologies available in the game
  //those available per level initiated in the mix from the level data
  technologies: {
    coal: {label:"Coal",
      rampRateDesc: 'slow',
      rampRate: 3,
      maxCapacity: 100, //MW, default (can be set by level or user purchases)
      availabilityDesc: 'constant',
      availableCapacity: [] //set by level
    },
    hydro: {label:"Hydro",
      rampRateDesc: 'medium',
      rampRate: 2,
      maxCapacity: 50, //MW, default (can be set by level or user purchases)
      availabilityDesc: 'constant',
      availableCapacity: [] //set by level
    },
    wind: {label:"Wind",
      rampRateDesc: 'fast',
      rampRate: 1,
      maxCapacity: 15, //MW, default (can be set by level or user purchases)
      availabilityDesc: 'variable',
      availableCapacity: [] //set by level
    },
    solar: {label:"Solar",
      rampRateDesc: 'fast',
      rampRate: 1,
      maxCapacity: 20, //MW, default (can be set by level or user purchases)
      availabilityDesc: 'cycles daily',
      availableCapacity: [] //set by level
    },
    ng: {label:"Natural Gas",
      rampRateDesc: 'fast',
      rampRate: 1,
      maxCapacity: 50, //MW, default (can be set by level or user purchases)
      availabilityDesc: 'constant',
      availableCapacity: [] //set by level
    },
    nuclear: {label:"Nuclear",
      rampRateDesc: 'medium',
      rampRate: 2,
      maxCapacity: 150, //MW, default (can be set by level or user purchases)
      availabilityDesc: 'constant',
      availableCapacity: [] //set by level
    },
    biomass: {label:"Biomass",
      rampRateDesc: 'slow',
      rampRate: 3,
      maxCapacity: 10, //MW, default (can be set by level or user purchases)
      availabilityDesc: 'constant',
      availableCapacity: [] //set by level
    }
  }
};

//Initialize
GM.currentTime = GM.midnight;
