<?php
/**
 * Class: Database.php - Clean, simple, basic singelton mongo connection for PHP.
 * @author jon weers
 * Example Usage: 
 *   $db = Database::obtain('localhost','root','','','dbName'); //Connect to Mongo and use 'dbName' db
 *   $db = Database::obtain('dbName') //Connect with defaults and use 'dbName' db, or selectDB if already connected
 *   $cursor = $db->collection->find('{name:"foo", bar:{$exists:true}}'); //Query where collection is the name of your collection
 *   $db = Database::selectDB('dbName') //Use 'dbName' db
 *   
 * @see http://php.net/manual/en/mongo.tutorial.php for more info on using the cursor.
 *
 */
class Database {

  // Singleton instance of Database
  private static $instance;
  
  //Singleton connection to Database
  private static $dbCon;

  /**
   * Obtain the singleton instance of the database connection
   * @param $dbHost
   * @param $dbUser
   * @param $dbPass
   * @param $dbName
   * @return MongoDB $db
   */
  public static function obtain($dbName=null, $dbHost='localhost', $dbUser=null, $dbPass='',$dbPort=27017){
    
    if (!self::$dbCon){
      $usrStr = ($dbUser !== null)? $dbUser.':'.$dbPass.'@' : '';
      $conStr = "mongodb://{$usrStr}$dbHost:$dbPort";
      try {
        self::$dbCon = new Mongo($conStr);
      }catch (MongoConnectionException $e){
        self::throwError("Could not connect to database on $dbHost \n".$e->getMessage());
      }
      
    }
    if ($dbName !== null){
      return self::selectDB($dbName);
    }
    
    return self::$instance; 
  }
  
  /**
   * Switch databases
   * @param $dbName
   * @return MongoDB $db
   */
  public static function selectDB($dbName){
    if (!self::$dbCon){
      self::throwError("Must be connection to database before you can selectDB!");
      return;
    }
    self::$instance = self::$dbCon->$dbName;
    return self::$instance;
  }
  
  /**
   * Log Errors
   * If Logger.php is present, use the in-house logger
   * @param string $msg
   */
  private static function throwError($msg=''){
    global $logger;
    if ($logger instanceof Logger){
      $logger->error("Database Error: $msg");
    }else{
      error_log("Database Error: $msg",0);
    }
  }
}
?>