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
    $('.tech-btn-label:contains("'+keypressed+'")').each(function(){
      if ($(this).text() == keypressed){
        var $btn = $(this).parent();
        if ($btn.is(':disabled')){
          //flash? or shake?
          $btn.addClass('btn-danger');
          setTimeout(function(){$btn.removeClass('btn-danger');}, 100);
          return false;
        }
        $btn.addClass('active').click();
        setTimeout(function(){$btn.removeClass('active');}, 100);
      }
    });
  });
  
  //Load level intro modal
  $('#levelIntroModal').modal('show');
  
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
      .append('<div class="bar used" style="width: 20%"></div>') //set by updateControlMeters()
      .append('<div class="bar available" style="width: 60%"></div') //set by updateControlMeters()
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
    
    //Initiate
    updateControls();
  }
  
  //Initialize game control buttons
  $('.tech-btn').click(function(){
    var parts = this.id.split('-');
    var tech = parts[0],
         val = parts[1];
    GM.mix.tweak(tech,val);
    updateControls();
    techBars.update();
    needle.moveTo(GM.getCurrentSupply());
  });
  
  $('#levelAbort').click(function(){
    //Someday: forget any score accumulated on this level
    document.location.href = 'home';
  });
  
  $('#levelBegin').click(function(){
    $(this).button('loading');
    beginLevelIn(GM.countdown);
  });
  
  $('#levelComplete').click(function(){
    $('#finalScoreModal').modal('hide');
  });
}

function updateControlMeters(){
  var mix = GM.getCurrentMix();
  //Both current supply and available capacity must be set as a percentage
  //of an arbitrary value to make availabilities visually relative.
  var techMaxCapacity = 100;
  var techCurrentSupply = 0;
  for (t in mix){
    if (typeof mix[t] == 'function'){
      continue;
    }
    
    //Set current value for each mix as a percentage of techMaxCapacity
    techCurrentSupply = Math.round(mix[t] / techMaxCapacity * 100) + '%';
    $('.capacity-'+ t +' .bar.used').css('width',techCurrentSupply);
    
    //Set the max available value for each mix as a percentage of techMaxCapacity
    techCurrentCapacity = Math.round(GM.getTechCurrentCapacity(t) / techMaxCapacity * 100) + '%';
    $('.capacity-'+ t +' .bar.available').css('width',techCurrentCapacity);
  }
}

/**
 * Disables or enables control buttons based on resource availability
 */
function updateControlButtons(){
  var mix = GM.getCurrentMix();
  //Restore all buttons by default
  $('.tech-btn').attr('disabled',false);
  for (t in mix){
    if (typeof mix[t] == 'function'){
      continue;
    }
    var currentMix = mix[t];
    var maxCapacity = GM.technologies[t].maxCapacity; //Level-set max capacity
  
    //Disable the tech-up button if the tech has reached its max
    if (currentMix >= maxCapacity){
      $('#'+t+'-up').attr('disabled','used it all');
    }
   
    //Disable the tech-down button if the tech is not currently being used (can't use negative capacity)
    if (currentMix <= 0){
      $('#'+t+'-down').attr('disabled','nothing to use');
    }
  }
}

/**
 * Aggregates update of all control elements
 */
function updateControls(){
  updateControlMeters();
  updateControlButtons();
}

/**
 * Updates the parity and sets the appropriate color
 */
function updateParityAndScore(){
  var $parity = $('.parity > span').text(GM.getCurrentParity()).parent();
  var scoreDelta = GM.incrementScore();
  $('#score').text(GM.getCurrentScore());

  //Remove any previous colorations
  $parity.removeClass('text-success text-error text-warning');
  
  //Show score tick and use the delta to colorize the parity display
  var sign = '';
  var $scoreTick = $('<div class="score-tick"></div>');
  if (scoreDelta > 0){
    sign = '+';
    $parity.addClass('text-success');
    $scoreTick.addClass('text-success');
  }else if (scoreDelta < 0){
    sign = '-';
    $parity.addClass('text-error');
    $scoreTick.addClass('text-error');
  }else{
    $parity.addClass('text-warning');
    $scoreTick.addClass('text-warning');
  }
  $scoreTick.text(sign + Math.abs(scoreDelta))
    .appendTo('.scoreboard');
  //Initiate float away (animation handled in css transition)
  setTimeout(function(){ 
    $scoreTick.css('top','-60px').fadeOut(1300,function(){
      $(this).remove();
    }); 
  }, 13);
}

function beginLevelIn(countdown){
  if (countdown > 0){
    $('.level-countdown').text(countdown);
    setTimeout(function(){ beginLevelIn(countdown - 1); }, 800);
    return false;
  }
  //Start the game!
  $('#levelIntroModal').modal('hide');
  GM.start();
}

function showFinalScore(){
  var $scoreboard = $('#finalScoreModal .modal-body');
  var total = 0;
  //temp
  var scoreElements = GM.getFinalScoreElements();
  
  for (el in scoreElements){
    var score = scoreElements[el];
    var $row = $('<div class="row"></div>');
    if (score.id == 'total'){
      $row.addClass('total-row');
    }
    var scoreSpanSign = (signum(score.val) == 1 && score.id != 'base')? '+':'';
    var scoreSpanClass = (signum(score.val) == -1)? ' text-error':' text-success';
    
    $('<span class="span2 score-value lead' + scoreSpanClass + '"></span>')
      .text(scoreSpanSign + score.val + ' pts')
      .appendTo($row);
    $('<span class="span5 score-desc"></span>')
      .text(score.desc)
      .appendTo($row);
    
    $scoreboard.append($row);
    total += score.val;
  }
  
  //Get score, populate template, then show
  $('#finalScoreModal').modal('show');
}

