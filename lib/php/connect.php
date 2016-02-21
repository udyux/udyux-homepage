<?php
	$dbc = new mysqli('localhost','udy','udyN!ck88','time_tracker') or die('Error ' . mysqli_error($dbc));
	$user_code = $_POST['user_code'];
	$check_code = $dbc->query("SELECT * FROM user WHERE user_code = $user_code");

	if ($check_code->num_rows < 1) {
		echo 'false';
	} else {
		echo 'sessionStorage.setItem("session_auth", "true"); window.location.replace("main.php");';
	}

	mysqli_close($dbc);