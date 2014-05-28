/* GM game controller (object) */ 
var GM = {
  active: false,
  levelData: {},
  countdown: 3, //The number of "seconds" before a level starts
  currentTime: undefined, //starts at midnight and increments by intervalDuration
  
  getCurrentDemand: function(){
    for (i in this.levelData){
      if (this.levelData[i].time == this.currentTime){
        return this.levelData[i].demand;
      }
    }
    return null;
  },
  
  getCurrentDisparity: function(){
    return Math.abs(this.idealParity - this.getCurrentParity());
  },
  
  getCurrentMix: function(){
    return this.mix;
  },
  
  /**
   * Calculates the current parity from the difference in the current supply and demand
   * Ideal parity: 60.00 Hz (this.idealParity)
   * p = +/-d^2 * t - d * t
   * @returns float Parity
   */
  getCurrentParity: function(){
    var difference = (this.getCurrentSupply() - this.getCurrentDemand());
    var parity = (this.idealParity + (Math.pow(difference,2) * this.tolerance * signum(difference)) - (difference * this.tolerance)).toFixed(2);
    return parity;
  },
  
  getCurrentScore: function(){
    return this.score;
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
  
  getFinalScoreElements: function(){
    var scoreElements = [
      {val:this.getCurrentScore(),desc:"Base Score",id:'base'},
      {val:-400,desc:"A few brownouts rolled through the system preventing a few angry citizens from watching the latest Gamer of Thrones"},
      {val:(this.getCurrentScore() - 400),desc:"Total Points Earned",id:'total'}
    ];
    
    return scoreElements;
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
        //load level starting mix and overload max capacity
        for (i in levelInfo.technologies){
          var tech = levelInfo.technologies[i];
          GM.mix[tech.name] = tech.startingVal;
          GM.technologies[tech.name].maxCapacity = tech.maxVal;
        }
        //load level meta info (loads into multiple places)
        $('.level-num').text(levelInfo.id);
        $('.level-name').text(levelInfo.name);
        $('.level-description').text(levelInfo.desc);
        //load level data
        var levelData =  levelInfo.demand;
        for (i in levelData){
          //Convert time string to current datetime objects
          var time = levelData[i].time.split(':');
          levelData[i].time = new Date().setHours(time[0],time[1],time[2],0);
        }
        GM.levelData = levelData;
        loadChart(levelData);
        buildGameControls(levelInfo.technologies);
      }
    });    
  },
  
  idealParity: 60.00,
  
  incrementScore: function(){
    //Get disparity and use to calculate score
    var scoreDelta = 0;
    var disparity = GM.getCurrentDisparity();
    if (disparity <= GM.tolerance){
      scoreDelta += 100;
    }else if (disparity > (GM.tolerance * 2)){
      scoreDelta -= Math.round(disparity * 100) * 10;
    }
    this.score += scoreDelta;
    return scoreDelta;
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
    nuclear: 0,
    //Support functions
    tweak: function(tech,dir){
      var incrementFactor = 1; //MW ... adjust to handicap the impact of an adjustment click
      if (!tech){
        return null;
      }
      if (dir == "up"){
        this[tech] += incrementFactor;  
      }
      if (dir == "down"){
        this[tech] -= incrementFactor;
      }
      return this[tech];
    }
  },
  
  outOfTime: function(){
    if (this.levelData[this.levelData.length-1].time == this.currentTime){
      //Stop the game if the last tick has arrived
      this.stop();
      return true;
    }
    return false;
  },
  
  score: 0, //Overridden with players base score at load (or at least it should be)
  
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
      rampRateDesc: 'very slow',
      rampRate: 5,
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
  },
  
  tolerance: 0.02 //Adjust to tweak scoring
};

//Initialize
GM.currentTime = GM.midnight;
