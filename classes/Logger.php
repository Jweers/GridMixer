<?php
/**
 * Class: Logger.php - Clean, simple basic logging for PHP.
 * @author jon weers
 * Example Usage: 
 *   $logger = new Logger();
 *   $logger->debug('This will show up as a debug message in the log');
 */
class Logger {
  //Basic Settings
  private $logFilePath = Settings::logFilePath;
  private $logFileName = Settings::logFileName;
  private $maxFileSize = 10485760; //10 mb
  //Rotate Settings
  private $rotateLogFile = true;
  private $numberOfRotations = 3;
  
  function __construct(){
    //Check to make sure the directory exists.
    if (!file_exists($this->logFilePath)){
      if (!mkdir($this->logFilePath, 0777)){
        trigger_error("Unable to make directory $this->logFilePath, most likely due to permissions", E_USER_NOTICE);
      }
    }
    $fileName = $this->logFilePath . '/' . $this->logFileName;
    if (!file_exists($fileName)){
      $file = fopen($fileName, 'w');
      if ($file){
        fwrite($file, "Logger.php initialized on " . date('y/m/d H:i:s', time()) . ".\n");
        fclose($file);
      }else{
        trigger_error("Unable to create log file $fileName", E_USER_NOTICE);
      }
    }
  }

  //print formatStackTrace(debug_backtrace());
  static function formatStackTrace($stacktrace) {
      $retval = str_repeat("=", 50) ."\n";
      $i = 1;
      foreach($stacktrace as $node) {
          $retval .= "$i. ".basename($node['file']) .":" .$node['function'] ."(" .$node['line'].")\n";
          $i++;
      }
      return $retval;
  }

  // return a string version of var_export
  static function dumpToStr($var) {
      ob_start();
      var_export($var);
      $result = ob_get_clean();
      return $result;
  }
  
  private function writeToLog($level,$msg){
    $fileName = $this->logFilePath . '/' . $this->logFileName;
    //Roll file if necessary
    if (filesize($fileName) > $this->maxFileSize){
      $this->rotateLogFile();
    }
    //Write to the Log
    $file = fopen($fileName, 'a');
    if ($file){
      fseek($file, 0, SEEK_END);
      fwrite($file, "[$level] " . date('y/m/d H:i:s', time()) . " $msg\n");
      fclose($file);
    }else{
      trigger_error("Unable to write to log file $fileName", E_USER_NOTICE);
    }
  }
  
  private function rotateLogFile(){
    //TODO: Make number of logs to roll configurable.
    $fileName = $this->logFilePath . '/' . $this->logFileName;
    if ($this->rotateLogFile){
      $i = 1;
      $allFilesExist = true;
      //Build roll files if they don't exist
      while ($i <= $this->numberOfRotations){
        $rollFile = $fileName.'.'.$i;
        if (!file_exists($rollFile)){
          $allFilesExist = false;
          copy($fileName,$rollFile);
          break;
        }
        $i++;
      }
      //Replace the oldest roll file
      if ($allFilesExist){
        //Find the oldest file
        $ageIndex = array();
        for ($i=1; $i<=$this->numberOfRotations; $i++){
          $rollName = $fileName.'.'."$i";
          $age = filemtime($rollName);
          $ageIndex[$rollName] = $age;
        }
        asort($ageIndex, SORT_NUMERIC);
        reset($ageIndex);
        //Replace the oldest file
        $oldestFile = key($ageIndex);
        copy($fileName,$oldestFile);
        touch($oldestFile);
      }
    }
    //Truncate the original and reset the pointer.
    $file = fopen($fileName, 'w');
    ftruncate($file, 0);
    rewind($file);
  }
  
  public function debug($msg){
    $this->writeToLog('DEBUG',$msg);
  }
  public function error($msg){
    $this->writeToLog('ERROR',$msg);
  }
  public function info($msg){
    $this->writeToLog('INFO',$msg);
  }
  public function custom($level,$msg){
    $this->writeToLog($level,$msg);
  }
}
?>