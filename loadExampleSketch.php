<?php
  if(isset($_GET["src"])) {
    $curlSession = curl_init();
    curl_setopt($curlSession, CURLOPT_URL, 'https://arduinode.net/Examples/' . $_GET["src"]);
    curl_setopt($curlSession, CURLOPT_BINARYTRANSFER, true);
    curl_setopt($curlSession, CURLOPT_RETURNTRANSFER, true);

    $data = curl_exec($curlSession);
    curl_close($curlSession);

    echo $data;
  }
?>
