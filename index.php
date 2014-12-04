<?php
  $startTime = microtime(true);
  /* Constants: */
  define('FLAGS_ENABLED', false);
  /* Requirements: */
  require_once 'config.php';
  require_once 'valueManager/RedirectingValueManager.php';
  /* Startup: */
  $dbConnection = Config::getConnection();
  require_once 'shortlink.php';
  $valueManager = RedirectingValuemanager::getInstance();
  $index = array(
    'hidelinkLeft'  => $valueManager->getTranslator()->st('hidelink_left')
  , 'hidelinkRight' => $valueManager->getTranslator()->st('hidelink_right')
  );
  //Building the head:
  require_once 'head.php';
  $index['head'] = $head;
  unset($head);
  //Making sure we get our appSetup:
  $index['appSetup'] = true;
  //Processing the Content-type:
  $headers = getallheaders();
  if(!array_key_exists('Accept', $headers)){
    $headers['Accept'] = 'text/html';
  }
  $cType = $headers['Accept'];
  switch($cType){
    case (preg_match('/application\/json/i', $cType) ? true : false):
      header('Content-type: application/json');
      echo json_encode($index);
    break;
    case (preg_match('/text\/html/i', $cType) ? true : false):
    default:
      //Rendering:
      echo Config::getMustache()->render('index', $index);
      //Done :)
      $endTime = microtime(true);
      echo "<!-- Page generated in ".round(($endTime - $startTime), 4)."s -->";
      echo "<!-- ".$valueManager->show(false)." -->";
  }
?>
