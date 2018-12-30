<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>結果 <?php echo($_POST['search_id']); ?></title>

	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 

	<link rel="stylesheet" href="css/result.css" />

	<!-- sankey -->
	<script src="js/sankey/jquery.js" type="text/javascript"></script>
	<script src="js/sankey/raphael.js" type="text/javascript"></script>
	<script src="js/sankey/sankey.js" type="text/javascript"></script>
	<script src="js/sankey/user_ip.js" type="text/javascript"></script>
	<script src="js/sankey/control.js" type="text/javascript"></script>

</head>
<body onload="searchID('<?php echo($_POST['search_id'])?>')">

	<div id="main_content" class="w3-container w3-light-grey w3-padding" style="">
		<h1 style="margin-left: 20px;"><?php echo($_POST['search_id'])?></h1>
		
		<hr>

		<h3>分析結果</h3>

		<hr>

		<h3>使用IP狀況</h3>
		<div id='sankey' style="width:1000px; margin-right: auto; margin-left: auto;"></div>

		<hr>

		<h3>文字雲</h3>

		<hr>

		<h3>作息圖</h3>
	</div>

    
	
</body>
</html>