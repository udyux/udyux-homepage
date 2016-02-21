<?
	$filename = $_POST['filename'];
	$content = $_POST['content'];

	// write to file
	//	| creates new file if it does not exist, otherwise it appends to file
	//	| lock file from being written to while open

	file_put_contents($filename, $content, FILE_APPEND | LOCK_EX);
