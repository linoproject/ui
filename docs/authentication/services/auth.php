<?php


$oResponse = array();
$oResponse["success"] = true;
$oResponse["roles"] = array ("AMDIN");
$oResponse["username"] = "admin" ;
$oResponse["token"] = $_POST["token"];

header('Content-Type: application/json');
echo json_encode($oResponse);
?>