<?php
$uploadFolder = '../uploads';
$allowedExts = [
	"gif", "jpeg", "jpg", "png", 'pptx', "srt", "txt", "zip",
];

if (!is_dir($uploadFolder)) {
	mkdir($uploadFolder);
}

if ($_FILES) {
	foreach ($_FILES as $k => $file) {
		$temp = explode(".", $file["name"]);
		$extension = end($temp);

		if (in_array($extension, $allowedExts)) {
			if ($file["error"] > 0) {
				$error = 'Error : '.$file["error"];
			}
			else {
				move_uploaded_file($file["tmp_name"], $uploadFolder.'/'.$file["name"]);
			}
		}
		else {
			$error = "Forbidden extension";
		}
	}
}
if (isset($error)) {
	echo $error;
}