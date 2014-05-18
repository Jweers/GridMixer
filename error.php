<?php
  //Initialize Key Classes
  require_once 'assets/boot.php';
  
  //Get error message
  $m = isset($_REQUEST['m'])? sanitize($_REQUEST['m']) : 0;
  switch ($m){
    case 401:
      $error_header = "Access Denied";
      $error_message = 'You are not allowed to edit this submission.';
      break;
    case 403:
      $error_header = "Access Forbidden";
      $error_message = 'You are not allowed to browse the root directory of submitted files. <br>';
      $error_message .= 'View the <a href="'.getCurrentDir().'/submissions/all">complete list of submissions</a> to browse available files or use the search at the top of each page.'."\n";
      break;
    //case 0:
    //case 404:
    default:
      $error_header = "Page Unknown";
      $error_message = "The page you are looking for does not exist.";
      break;
  } //End switch
  
  //Render the Header
  $PAGETITLE = Settings::pageTitle;
  $META_KEYWORDS = Settings::metaKeywords;
  $META_DESCRIPTION = Settings::metaDescription;
  require_once 'templates/header.php';
?>
  <div id="app-container" style="position:relative;">
    <h2 class="text-warning"><?php echo $error_header; ?></h2>
    <p class="lead"><?php echo $error_message; ?></p>
    <small>If you feel you have reached this page in error, please contact the site administrator.</small>
  </div>
</div>
<?php
  //Render the Footer
  include_once 'templates/footer.php';
?>
