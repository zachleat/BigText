<?php
sleep(2);
header('Content-Type: text/css');
echo file_get_contents('stylesheet.css');