/*
 * Grid Mixer game play controls, dependent on chart.js and game.js 
 */

var needle;

var keyboardControls = {
  coal: ['x','c'],
  hydro: ['h','j'],
  wind: ['w','e'],
  solar: ['s','d'],
  ng: ['n','m'],
  nuclear: ['i','o'],
  biomass: ['j','k']
};

$(function(){
  
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


function buildGameControls(technologies){
  //Build Controls
  for (i in technologies){
    var tech = technologies[i];
    var $control = $('<div class="tech-control"></div>')
        .append('<span class="tech-icon ' + tech.name + '-icon"></span>');
    for (k in keyboardControls[tech.name]){
      var dir = (k == 0)? 'up' : 'down';
      var key = keyboardControls[tech.name][k];
      //Assemble each button and add to control
      $('<button class="btn tech-btn btn-mini" id="' + tech.name + '-' + dir + '"></button>')
        .append('<i class="icon-chevron-'+dir+'"></i>')
        .append('<span class="tech-btn-label">'+key+'</span>')
        .appendTo($control);  
    }
    //Assemble capacity meters
    $('<div class="progress capacity-' + tech.name + '"></div')
      .append('<div class="bar used" style="width: 20%"></div>') //set by refreshTechMeters()
      .append('<div class="bar available" style="width: 60%"></div') //set by refreshTechMeters()
      .appendTo($control);
    //Assemble tech label
    $('<div class="tech-label ' + tech.name + '-label">' + GM.technologies[tech.name].label + '</div>')
      .appendTo($control);
    //Assemble tech descriptions
    var $description = $('<div class="tech-description"></div>');
    var propertyLabels = {
        rampRateDesc: 'Ramp rate',
        availabilityDesc: 'Availability',
        maxCapacity: 'Max capacity'
    };
    for (prop in propertyLabels){
      var label = propertyLabels[prop];
      var units = (prop == 'maxCapacity')? ' MW' : '';
      $('<p></p>')
      .append('<span class="tech-property">' + label + '</span>')
      .append('<span class="value">' + GM.technologies[tech.name][prop] + units + '</span>')
      .appendTo($description);
    }
    $description.appendTo($control);

    //Add to main controls area
    $('#techControls').append($control);
  }
  
  //Initialize game control buttons
  $('.tech-btn').click(function(){
    var parts = this.id.split('-');
    var tech = parts[0],
         val = parts[1];
    GM.mix.tweak(tech,val);
    needle.moveTo(GM.getCurrentSupply());
  });
}