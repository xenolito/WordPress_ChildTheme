<?php

/*** CHILD THEME STUFF FROM THEME AUTHOR -- LOAD CHILD THEME STYLES / LANGUAGE / ETC.  ***/

define( 'CHILD_THEME_URBACONTROL_VERSION', '1.0.0' );

function child_enqueue_styles() {

	wp_enqueue_style( 'urbacontrol-theme-css', get_stylesheet_directory_uri() . '/style.css', array('astra-theme-css'), CHILD_THEME_URBACONTROL_VERSION, 'all' );

}

add_action( 'wp_enqueue_scripts', 'child_enqueue_styles', 15 );



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




