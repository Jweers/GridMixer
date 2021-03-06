<?php
  //Initialize Key Classes
  require_once 'assets/boot.php';
  //Render the Header
  $PAGETITLE = Settings::pageTitle;
  $META_KEYWORDS = Settings::metaKeywords;
  $META_DESCRIPTION = Settings::metaDescription;
  require_once 'templates/header.php';
?>
  <div id="app-container" style="position:relative;">

    <h1>Grid Mixer Test</h1>
    
    <svg id="livegrid" class="chart" width="420" height="120"></svg>
    <script type="text/javascript" src="assets/js/chart2.js"></script>

  </div>
<?php
  //Render the Footer
  include_once 'templates/footer.php';
?>
