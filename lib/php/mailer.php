<?php
	$recipient = "dev@udy.io";
	$subject = "New message from udy.io";
	$sender = $_POST["sender"];
	$senderEmail = $_POST["reply"];
	$message = $_POST["message"];
	$mailBody = "Name: $sender\nEmail: $senderEmail\n\n$message";

	mail($recipient, $subject, $mailBody, "From: $sender <$senderEmail>");
