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
    
    <p>
      <button class="btn btn-success" onclick="GM.start()">Start</button>
      <button class="btn btn-danger" onclick="GM.stop()">Stop</button>
    </p>

  </div>
  <script type="text/javascript">
    var data = GM.getLevel(<?php echo $level; ?>);
  </script>
<?php
  //Render the Footer
  include_once 'templates/footer.php';
?>
