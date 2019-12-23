<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <!--[if IE]><meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'><![endif]-->
	<meta charset="<?php esc_attr(bloginfo( 'charset' )); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1"/>
	<link rel="profile" href="http://gmpg.org/xfn/11" />
	<link rel="pingback" href="<?php echo esc_url(get_bloginfo('pingback_url')); ?>" />
	<?php wp_head(); /* this is used by many Wordpress features and for plugins to work proporly */ ?>
</head>

<body <?php body_class(); ?>><div id="fb-root"></div>
	<?php
	if(sunway_gd('is_animsition_active')) echo '<div class="animsition">';
    
	if(sunway_gd('hide_everything_but_content') != 999) {
		include_once(get_parent_theme_file_path('include/primary-menu-classic.php'));
	    include_once(get_parent_theme_file_path('include/google-maps_bg.php')); /* google maps background */ 
	}
    ?>        
    <div class="none-visible">
        <p><a href="#content"><?php esc_attr_e('Skip to Content', 'sunway'); ?></a></p><?php /* used for accessibility, particularly for screen reader applications */ ?>
    </div><!--.none-->
    <?php
		if(sunway_gd('hide_everything_but_content') <= 0): 
	?> 
    
    <div id="main" class="<?php echo esc_attr(sunway_gd('header_slider_class')); echo esc_attr(sunway_gd('footer_slider_class')); ?>">
        <?php
		sunway_ozy_custom_header();
        ?>
        <div class="container <?php echo esc_attr(sunway_gd('_page_content_css_name')); ?>">
	<?php endif; ?>        
            