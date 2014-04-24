<?php
  /*
   * API.php
   * Handles status update requests for the GDR
   */

  //Initialize Key Classes
  require_once 'assets/boot.php';
  require_once 'assets/gdrFunctions.php';


  $action = isset($_REQUEST['action'])? $_REQUEST['action'] : 'help';

  switch ($action){
    case 'submit':
      //Sanitize Inputs
      $submissionType = isset($_REQUEST['o'])? sanitize($_REQUEST['o']) : 'individual';
      $submissionObj = isset($_REQUEST['subJson'])? @json_decode($_REQUEST['subJson']) : '';
      $gdrId = isset($_REQUEST['gdrId'])? intval(sanitize($_REQUEST['gdrId'])) : -1;
      //Formulate Response
      if ($submissionType == 'edit'){
        $response = updateSubmission($gdrId, $submissionObj);
      }else{
        $response = saveSubmission($submissionType, $submissionObj);
      }
      $responseType = 'application/json';
      break;
    case 'load':
    case 'getSubmissionById':
      //Sanitize Inputs
      $submissionId = isset($_REQUEST['id'])? sanitize($_REQUEST['id']) : -1;
      //Formulate Response
      $response = loadSubmission($submissionId);
      $responseType = 'application/json';
      break;
    case 'getSubmissionsForUser':
      //Sanitize Inputs
      $userId = isset($_REQUEST['id'])? sanitize($_REQUEST['id']) : -1;
      //Formulate Response
      $response = getSubmissionsForUser($userId);
      $responseType = 'application/json';
      break;
    case 'delete':
      //Sanitize Inputs
      $gdrId = isset($_REQUEST['id'])? intval(sanitize($_REQUEST['id'])) : -1;
      //Formulate Response
      $response = removeSubmission($gdrId);
      $responseType = 'application/json';
      break;
    case 'searchIdx':
      $lastModified = isset($_REQUEST['lastModified'])? sanitize($_REQUEST['lastModified']) : 0;
      $response = searchIdx($lastModified);
      $responseType = 'application/json';
      break;
    case 'help':
    default:
      $response = "No help available for this service.";
      $responseType = 'text/html';
      break;
  }
  //Publish JSON
  header("Content-type: $responseType");
  header('Cache-Control: no-store, no-cache, must-revalidate');
  echo ($responseType == 'application/json')? json_encode($response) : $response;

  //End API Logic
  die;

?>
