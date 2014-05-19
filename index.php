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

    <h1>Grid Mixer</h1>
    
    <p>Main landing page...</p>

    <a href="level-1" class="btn btn-primary btn-large">Play <i class="icon-play icon-white"></i></a>
    
    <p>About the game...</p>
    
  </div>
<?php
  //Render the Footer
  include_once 'templates/footer.php';
?>
