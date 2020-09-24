<?php

/*** CHILD THEME STUFF FROM THEME AUTHOR -- LOAD CHILD THEME STYLES / LANGUAGE / ETC.  ***/

function pictau_child_theme_enqueue_scripts() {
	wp_register_style( 'childstyle', get_stylesheet_directory_uri() . '/style.css'  );
	wp_enqueue_style( 'childstyle' );
}
add_action('wp_enqueue_scripts', 'pictau_child_theme_enqueue_scripts', 11);




/*------------------------------------------------------------------------------------------------------*\

						WP MAIL FROM CUSTOMIZATION

\*------------------------------------------------------------------------------------------------------*/
<!-- build:wpmailfrom_name -->
function custom_wp_mail_from_name( $original_email_from ) {
	return 'PICTAU';
}
<!-- endbuild -->

<!-- build:wpmailfrom_email -->
function custom_wp_email_address( $original_email_address ) {
    return 'contacto@pictau.com';
}
<!-- endbuild -->

add_filter( 'wp_mail_from', 'custom_wp_email_address' );
add_filter( 'wp_mail_from_name', 'custom_wp_mail_from_name' );




