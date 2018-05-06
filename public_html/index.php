<?php

$uploadFolder = '../uploads';
$allowedExts = [
	"gif", "jpeg", "jpg", "png", "srt",
];

if (!is_dir($uploadFolder)) {
	mkdir($uploadFolder);
}

if ($_POST) {
	
	if ($_FILES['file1']) {
		$temp = explode(".", $_FILES["file1"]["name"]);
		$extension = end($temp);

		if (in_array($extension, $allowedExts)) {
			if ($_FILES["file1"]["error"] > 0) {
				$error = 'Error : '.$_FILES["file1"]["error"];
			}
			else {
				move_uploaded_file($_FILES["file1"]["tmp_name"], $uploadFolder.$_FILES["file1"]["name"]);
			}
		}
		else {
			$error = "Forbidden extension";
		}
	}
}

require '../view.php';
