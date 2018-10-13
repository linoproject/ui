<?php


$oResponse = array();
$oResponse["success"] = true;
$oResponse["roles"] = array ("AMDIN");
$oResponse["username"] = $_POST["username"];
$oResponse["token"] = "123";

header('Content-Type: application/json');
echo json_encode($oResponse);
?>