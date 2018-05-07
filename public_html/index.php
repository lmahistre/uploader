<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<script type="text/javascript" src="dist/jquery.js"></script>
		<script type="text/javascript" src="dist/jquery.ui.widget.js"></script>
		<script type="text/javascript" src="dist/jquery.fileupload.js"></script>
		<script type="text/javascript" src="dist/app.js"></script>
		<link rel="shortcut icon" href="dist/favicon.png" type="image/vnd.microsoft.icon" />
		<link rel="stylesheet" type="text/css" href="style.css">
		<title>Upload</title>
	</head>
	<body role="document">
		<?php if (isset($error)) : ?>
			<div><?php echo $error; ?></div>
		<?php endif; ?>
		<input id="file_upload" type="file" name="filename_file" multiple>
		<div id="upload_list"></div>
	</body>
</html>