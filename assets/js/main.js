/**
 * Main JS
 */

/* Document Ready */
$(document).ready(function(){
  
  //Initialize Info Button
  $('#info-icon').click(function(e){
    e.stopImmediatePropagation();
    toggleInfoPanel();
  });
  
  //Initialize Close Button
  $('.close-icon').click(function(){
    closePanel(this);
  });
  
  //Initialize Search in NavBar (IE8 Only)
  if (browser.isIE8){
    $('div.navbar input.search-query').val('Search').addClass('muted').focus(function(){
      $(this).val('').removeClass('muted');
    });
  }
  
});

function showAlert(alert, msg){
  $(alert+' span').html(msg).parent().fadeIn(200);
}

function hideAlert(alert){
  $(alert).fadeOut(250, function(){
    $(this).find('span').empty();
  });
}

function showFormError(errMsg){
  var $err = $('.formContainer:visible .formError');
  if ($err.length <= 0){
    return false;
  }
  $err.stop()
    .css({backgroundColor:"#f3f383"})
    .html('Error: '+errMsg)
    .animate({backgroundColor: "#f3f3f3"},300);
  return true;
}

/* Panel Display Functions */
function toggleInfoPanel(){
  if (!$('#info-innards').is(':visible')){
    //Show
    $('#info').animate({width: 300}, 200, function(){
      $('#info-innards').fadeIn(350);
      $('#info > .close-icon').fadeIn(150);
    });
  }else{
    //Hide
    $('#info').find('.close-icon').fadeOut(150);
    $('#info-innards').fadeOut(200,function(){
      $('#info').animate({width: 21}, 250);
    });
  }
}

function closePanel(obj){
  var $parent = $(obj).parent();
  if ($parent.attr('id') == 'info'){
    //Info Panel
    toggleInfoPanel();
  }else{
    $parent.find('.formError').html('&nbsp;');
    $parent.fadeOut(300);
  }
}

function showMessagePanel(msg,spinner){
  var $msg = $('#message');
  var display = (spinner)? 'inline':'none';
  $msg.find('img#loading').css('display',display);
  return $msg.find('span').html(msg).parent().fadeIn(200);
}
