<?php
  $logoTitle = $valueManager->getTranslator()->st('website_logo_hover');
?>
<div id="logo">
<a target="_blank"
   title="<?php echo $logoTitle; ?>"
   href="http://www.eva.mpg.de/lingua/"
   ><img src="img/logo.png"></a>
</div>
<?php unset($logoTitle); ?>
