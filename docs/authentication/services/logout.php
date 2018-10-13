<?php


$oResponse = array();
$oResponse["success"] = true;


header('Content-Type: application/json');
echo json_encode($oResponse);
?>