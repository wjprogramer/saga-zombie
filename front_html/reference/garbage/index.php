<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>首頁</title>

	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 

	<style>
		html, body {
			height: 100%;
			margin: 0;
		}

		body {
			background: url("img/bg.jpg");
		}

		#logo {
			background: url("img/logo.png");
            background-repeat: no-repeat;
            background-size: 20%;
            background-position: center; /* Center the image */
            /*background-size: cover;*/ /* Resize the background image to cover the entire container */
            background-attachment: fixed;
		}

		.animate-opacity {
		    animation: opac 4s;
		}

		.search_button {
			padding: 4px;
			/*display: block;*/
			border: none;
		    border-bottom-color: currentcolor;
		    border-bottom-style: none;
		    border-bottom-width: medium;
			/*border-bottom: 1px solid #ccc;*/
			/*width: 100%;*/
		}
	</style>

</head>
<body>

	<div id="logo" class="w3-container animate-opacity w3-display-container" style="height: 100%">
		<div  class="w3-display-bottommiddle" style="margin-bottom: 150px;">
			<span class="w3-text-white">搜尋ID：</span>
			<form action="result.php" method="post">
				<input type="text" name="search_id" style="height: 30px">
				<input type="submit" value="Search" class="search_button w3-blue w3-hover-pale-blue">
			</form>
		</div>
	</div>
</body>
</html>