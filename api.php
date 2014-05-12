<?php
  /*
   * API.php
   * Handles ajax requests and other API calls
   */

  //Initialize Key Classes
  require_once 'assets/boot.php';

  $action = isset($_REQUEST['action'])? $_REQUEST['action'] : 'help';

  switch ($action){
    case 'getLevel':
      //Sanitize Inputs
      $id = isset($_REQUEST['id'])? sanitize($_REQUEST['id']) : 1;
      //Formulate Response
      $response = getLevel($id);
      $responseType = 'application/json';
      break;
    case 'help':
    default:
      $response = "No help available for this service.";
      $responseType = 'text/html';
      break;
  }
  //Publish Response
  header("Content-type: $responseType");
  header('Cache-Control: no-store, no-cache, must-revalidate');
  echo ($responseType == 'application/json')? json_encode($response) : $response;

  //End API Logic
  die;
  
  //Support Functions
  
  /**
   * Get level by level id
   * Returns the level object in $reponse->result
   * @param integer $levelId
   * @return stdClass $response
   */
  function getLevel($id){
    $id = intval($id);
    $response = new stdClass();
    $response->result = false;
    //Fetch from db
    $db = Database::obtain();
    try {
      $response->result = $db->levels->findOne(array('id'=>$id));
    } catch (Exception $e){
      $response->error = true;
      $response->errorMsg = "Unable to find level $id";
      global $logger;
      if ($logger instanceof Logger){
        $logger->error("Unable to find level $id\n$e");
      }
    }
    return $response;
  }
?>
