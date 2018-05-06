<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<script type="text/javascript" src="dist/bundle.js"></script>
		<link rel="shortcut icon" href="dist/favicon.png" type="image/vnd.microsoft.icon" />
		<link rel="stylesheet" type="text/css" href="style.css">
		<title>Upload</title>
	</head>
	<body role="document">
		<?php if ($error) : ?>
			<div><?php echo $error; ?></div>
		<?php endif; ?>
		<form name="upload" enctype="multipart/form-data" method="post" action="index.php">
			<input type="file" name="file1">
			<input type="submit" name="validate" value="OK" />
		</form>
	</body>
</html>