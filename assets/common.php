<?php
//Common Functions for use on all pages. (Typically loaded by boot.php)

/**
 * Sanitize a string by removing special characters and extra whitespace.
 * @param $str
 * @return string
 */
function sanitize($str){
  $str = preg_replace("/[^a-zA-Z0-9_ -@\.\/']/", '', $str);
  return trim($str);
}

/**
 * Returns the name of the file running the current script.
 * @param $removeExt Optionally removes the file extension (default: true)
 * @return string filename
 */
function getCurrentPage($removeExt=true){
  $curPage = substr($_SERVER['PHP_SELF'],strrpos($_SERVER['PHP_SELF'],'/')+1);
  if ($removeExt && strrpos($curPage,'.') > 0){
    $curPage = substr($curPage,0,strrpos($curPage,'.'));
  }
  return $curPage;
}

/**
 * Returns the full url of the page that requested the current sript.
 * Great when used with parse_url (http://php.net/manual/en/function.parse-url.php)
 * @return string url
 */
function getCurrentUrl(){
  $s = (@$_SERVER['HTTPS'] == "on")? 's' : '';
  $url = "http$s://".$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
  return $url;
}

/**
 * Returns the root directory of the current script.
 * Often used to resolve clean url resource loading issues
 * @return string path
 */
function getCurrentDir(){
    $thisdir = dirname($_SERVER['SCRIPT_NAME']);
    return ($thisdir == '/')? '': $thisdir;
}

/**
 * Returns the html and javascript to generate a mailto: link on page load
 * hopefully hiding it from bots and scrapers
 * @param string $email email address
 * @param string $linkText clickable text generated (optional, defaults to email)
 * @return string html + js
 */
function getSafeEmailLink($email,$linkText=''){
  if (!$email || $email == ''){
    return '';
  }
  //Handle optional linkText
  if ($linkText == ''){
    $linkText = $email;
  }
  //Assmble html + js
  $emailArr = str_split($email,3);
  $textArr = str_split($linkText,4);
  $html = "\n".'<script type="text/javascript">'."\n";
  $html .= 'var th = "ilto"; em = "'.implode('"+"', $emailArr).'"; tx = "'.implode('"+"', $textArr).'";'."\n";
  $html .= "document.write('<a ' + 'hr' + 'ef=\"ma'+th+':'+em+'\" rel=\"nofollow\">'+tx+'</a>');"."\n";
  $html .= '</script>'."\n";
  return $html;
}

?>
