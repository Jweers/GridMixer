<?php
  //Initialize Key Classes
  require_once 'assets/boot.php';
  //Render the Header
  $PAGETITLE = Settings::pageTitle;
  $META_KEYWORDS = Settings::metaKeywords;
  $META_DESCRIPTION = Settings::metaDescription;
  require_once 'templates/header.php';
  
  $level = isset($_REQUEST['level'])? (int)$_REQUEST['level'] : 1;
?>
  <div id="app-container" style="position:relative;">

    <h1>Grid Mixer</h1>
    
    <h3>Level <span class="level-num">X</span>: <span class="level-name">The X-ening</span></h3>
    
    <div class="scoreboard">
      <div id="score">0</div>
    </div>
    
    <div class="parity text-success"><span>60.00</span> Hz</div>
    
    <svg id="livegrid" class="chart" width="420" height="120">
      <polygon id="needle" fill="lightgreen" stroke="green" stroke-width="2" points="25,30 25,10 40,20" />
      <g id="techBars" transform="translate(0,20)"></g>
    </svg>
    <script type="text/javascript" src="assets/js/chart.js"></script>
    <script type="text/javascript" src="assets/js/controls.js"></script>
    
    <div id="techControls">
      <div class="tech-control">
        <span class="tech-icon wind-icon"></span>
        <button class="btn tech-btn btn-mini" id="wind-up"><i class="icon-chevron-up"></i><span class="tech-btn-label">w</span></button>
        <button class="btn tech-btn btn-mini" id="wind-down"><i class="icon-chevron-down"></i><span class="tech-btn-label">e</span></button>
        <div class="progress capacity-wind">
          <div class="bar used" style="width: 10%"></div>
          <div class="bar available" style="width: 15%"></div>
        </div>
        <div class="tech-label wind-label">Wind</div>
        <div class="tech-description">
          <p><span class="tech-property">Ramp rate</span><span class="value">fast</span></p>
          <p><span class="tech-property">Availability</span><span class="value">variable</span></p>
          <p><span class="tech-property">Max Capacity</span><span class="value">15 MW</span></p>
        </div>
      </div>
      
      <div class="tech-control">
        <span class="tech-icon solar-icon"></span>
        <button class="btn tech-btn btn-mini" id="solar-up"><i class="icon-chevron-up"></i><span class="tech-btn-label">s</span></button>
        <button class="btn tech-btn btn-mini" id="solar-down"><i class="icon-chevron-down"></i><span class="tech-btn-label">d</span></button>
        <div class="progress capacity-solar">
          <div class="bar used" style="width: 10%"></div>
          <div class="bar available" style="width: 20%"></div>
        </div>
        <div class="tech-label solar-label">Solar</div>
        <div class="tech-description">
          <p><span class="tech-property">Ramp rate</span><span class="value">fast</span></p>
          <p><span class="tech-property">Availability</span><span class="value">cycles daily</span></p>
          <p><span class="tech-property">Max Capacity</span><span class="value">20 MW</span></p>
        </div>
      </div>
    </div>
    
    <p style="clear: both;">&nbsp;</p>
    
    <div id="levelIntroModal" class="modal">
      <div class="modal-header">
        <h2>Level <span class="level-num">X</span>: <span class="level-name">Error</span></h2>
      </div>
      <div class="modal-body">
        <p class="lead level-description">Error loading level!</p>
        <p class="lead level-countdown"></p>
      </div>
      <div id="levelControls" class="modal-footer">
        <button class="btn level-btn" id="levelAbort">Abort</button>
        <button class="btn level-btn btn-success" id="levelBegin" data-loading-text="beginning..">Begin!</button>
      </div>
    </div>
    
    <div id="finalScoreModal" class="modal hide" aria-hidden="true" style="display: none;">
      <div class="modal-header">
        <h2>Congratulations!</h2>
      </div>
      <div class="modal-body">
        <!-- Populated by js showFinalScore() -->
      </div>
      <div class="modal-footer">
        <button class="btn level-btn btn-success" id="levelComplete">Continue</button>
      </div>
    </div>
   
    <?php 
      //Debug
      if (false): 
    ?>
    <p class="well" style="margin-top: 1em;"> <!-- Debug! -->
      <button class="btn btn-success" onclick="GM.start()">Start</button>
      <button class="btn btn-danger" onclick="GM.stop()">Stop</button>
    </p>
    <?php endif; ?>

  </div>
  <script type="text/javascript">
    var data = GM.loadLevel(<?php echo $level; ?>);
  </script>
<?php
  //Render the Footer
  include_once 'templates/footer.php';
?>
