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

    <h1>Grid Mixer Test</h1>
    
    <svg id="livegrid" class="chart" width="420" height="120">
      <polygon id="needle" fill="lightgreen" stroke="green" stroke-width="2" points="20,30 20,10 35,20" />
    </svg>
    <script type="text/javascript" src="assets/js/chart.js"></script>
    <script type="text/javascript" src="assets/js/controls.js"></script>
    
    <p>
      <button class="btn btn-success" onclick="GM.start()">Start</button>
      <button class="btn btn-danger" onclick="GM.stop()">Stop</button>
    </p>
    
    <div id="techControls">
      <div class="tech-control">
        <span class="tech-icon wind-icon"></span>
        <button class="btn tech-btn btn-mini" id="wind-up"><i class="icon-chevron-up"></i><span class="tech-btn-label">w</span></button>
        <button class="btn tech-btn btn-mini" id="wind-down"><i class="icon-chevron-down"></i><span class="tech-btn-label">e</span></button>
        <div class="progress capacity-wind">
          <div class="bar used" style="width: 10%"></div>
          <div class="bar available" style="width: 20%"></div>
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
        <button class="btn tech-btn btn-mini" id="solar-up"><i class="icon-arrow-up"></i><span class="tech-btn-label">s</span></button>
        <button class="btn tech-btn btn-mini" id="solar-down"><i class="icon-arrow-down"></i><span class="tech-btn-label">d</span></button>
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

  </div>
  <script type="text/javascript">
    var data = GM.loadLevel(<?php echo $level; ?>);
  </script>
<?php
  //Render the Footer
  include_once 'templates/footer.php';
?>
