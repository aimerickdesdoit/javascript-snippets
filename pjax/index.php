<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
		<title>pjax</title>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>
		<script type="text/javascript" src="jquery.pjax.js"></script>
		<style type="text/css">
			body{
				font-family: arial;
				font-size: 12px;
				margin: 10px;
			}
			#target{
				border: 1px solid #cccccc;
				padding: 10px;
				margin: 10px 0px;
			}
			.loading{
				background: url(45.gif) no-repeat 10px 10px;
			}
		</style>
		<script type="text/javascript">
			$(function(){
				$('a').pjax('#target', {cache: true, complete: function(){
				  $('#target').removeClass('loading');
				}}).click(function(){
          $('#target').addClass('loading');
				});
			});
		</script>
	</head>
	<body>
		<a href="lorem.php">lorem</a>
		<a href="morbi.php">morbi</a>
		<a href="sed.php">sed</a>
		<div id="target"><?php echo isset($content) ? $content : ''; ?></div>
	</body>
</html>