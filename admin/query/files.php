<?php
  /* Setup and session verification */
  require_once 'dbimport/Importer.php';
  chdir('..');
  require_once 'common.php';
  session_validate() or Config::error('403 Forbidden');
  session_mayEdit()  or Config::error('403 Forbidden');
  //Parsing client data, and using Importer:
  $uId = $dbConnection->escape_string(session_getUid());
  $merge = false;
  $fs = array();
  $uploads = $_FILES['upload'];
  if(count($uploads['name']) === 1 && $uploads['name'][0] === ''){
    Config::error('No file given.');
    echo '<h1>You need to select a file first.</h1>';
  }else{
    while(count($uploads['name']) > 0){
      array_push($fs, array(
        'name' => array_pop($uploads['name'])
      , 'path' => array_pop($uploads['tmp_name'])
      ));
    }
    $log = Importer::processFiles($fs, $uId, $merge);
    echo '<ul><li>'.implode($log,'</li><li>').'</li></ul>';
  }
?>
