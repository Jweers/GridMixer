/*
 * Grid Mixer game play controls, dependent on chart.js and game.js 
 */

var needle;

var keyboardControls = {
  coal: ['c','v'],
  hydro: ['h','j'],
  wind: ['w','e'],
  solar: ['s','d'],
  ng: ['n','m']
}; //Necessary?

$(function(){
  
  //Initialize game control buttons
  $('.tech-btn').click(function(){
    var parts = this.id.split('-');
    var tech = parts[0],
         val = parts[1];
    GM.mix.tweak(tech,val);
    needle.moveTo(GM.getCurrentSupply());
  });
  
  //Initialize coresponding key commands
  $(document).keypress(function(e){
    var keypressed = String.fromCharCode(e.charCode);
    console.log(keypressed);
    $('.tech-btn-label:contains("'+keypressed+'")').each(function(){
      if ($(this).text() == keypressed){
        var id = $(this).parent().addClass('active').click().attr('id');
        setTimeout(function(){$('#'+id).removeClass('active');}, 100);
      }
    });
  });
});