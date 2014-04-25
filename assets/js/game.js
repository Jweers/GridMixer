/* GM game controller (object) */ 
var GM = {
  active: false,
  speed: 100, //Tweak this to control the speed of the level
  start: function(){
    this.active = true;
  },
  stop: function(){
    this.active = false;
  }
};
