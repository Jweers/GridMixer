<?php
//assets
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title><?php echo $PAGETITLE; ?></title>
  <!-- <link rel="shortcut icon" href="/favicon.ico"/> -->
  
  <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
  <meta name="Keywords" content="<?php echo $META_KEYWORDS; ?>"/>
  <meta name="Description" content="<?php echo $META_DESCRIPTION; ?>"/>
  
  <!-- Core CSS -->
  <link href='http://fonts.googleapis.com/css?family=Open+Sans:400italic,400,300,700' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" href="assets/css/main.css" type="text/css" />
  <!-- <link rel="stylesheet" href="assets/css/usermenu.css" type="text/css" /> -->
  <link rel="stylesheet" href="assets/css/bootstrap.css" type="text/css" />
  <!-- <link rel="stylesheet" href="assets/css/jQuery/jquery-ui-1.8.9.custom.css" type="text/css" /> -->

  <!-- jQuery+Bootstrap+d3 Core -->
  <script type="text/javascript" src="assets/js/jquery-1.11.0.min.js"></script> 
  <!-- <script type="text/javascript" src="assets/js/jQuery/jquery-ui-1.8.9.custom.min.js"></script> -->
  <script type="text/javascript" src="assets/js/bootstrap.js"></script>
  <script type="text/javascript" src="assets/js/d3.js" charset="utf-8"></script>

  <!-- Core JS -->
  <script type="text/javascript" src="assets/js/main.js"></script>
  <script type="text/javascript" src="assets/js/common.js"></script>
  <!-- <script type="text/javascript" src="assets/js/userMenu.js"></script> -->
  <script type="text/javascript" src="assets/js/game.js"></script>
  
  <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
  <![endif]-->
  
<?php
  //Load Google Analytics if enabled in localSettings
  if (Settings::enableGoogleAnalytics) {
    $html ='  <!-- Google Analytics -->'."\n";
    $html.='  <script type="text/javascript">'."\n";
    $html.='    var _gaq = _gaq || [];'."\n";
    $html.='    _gaq.push(["_setAccount", "UA-XXXXX-X"]);'."\n";
    $html.='    _gaq.push(["_trackPageview"]);'."\n";
    $html.='    (function() {'."\n";
    $html.='      var ga = document.createElement("script"); ga.type = "text/javascript"; ga.async = true;'."\n";
    $html.='      ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";'."\n";
    $html.='      var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ga, s);'."\n";
    $html.='    })();'."\n";
    $html.='  </script>'."\n";
    echo $html;
  }
?>
