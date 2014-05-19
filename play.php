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
    
    <svg id="livegrid" class="chart" width="420" height="120"></svg>
    <script type="text/javascript" src="assets/js/chart.js"></script>
    <script type="text/javascript" src="assets/js/controls.js"></script>
    
    <p>
      <button class="btn btn-success" onclick="GM.start()">Start</button>
      <button class="btn btn-danger" onclick="GM.stop()">Stop</button>
    </p>
    
    <div id="techControls">
      <div class="tech-control">
        <span class="tech-label">Wind</span>
        <span class="tech-icon"></span>
        <button class="btn tech-btn" id="wind-up"><i class="icon-arrow-up"></i><span class="tech-btn-label">w</span></button>
        <button class="btn tech-btn" id="wind-down"><i class="icon-arrow-down"></i><span class="tech-btn-label">e</span></button>
      </div>
      
      <div class="tech-control">
        <span class="tech-label">Solar</span>
        <span class="tech-icon"></span>
        <button class="btn tech-btn" id="solar-up"><i class="icon-arrow-up"></i><span class="tech-btn-label">s</span></button>
        <button class="btn tech-btn" id="solar-down"><i class="icon-arrow-down"></i><span class="tech-btn-label">d</span></button>
      </div>
    </div>

  </div>
  <script type="text/javascript">
    var data = GM.getLevel(<?php echo $level; ?>);
  </script>
<?php
  //Render the Footer
  include_once 'templates/footer.php';
?>
