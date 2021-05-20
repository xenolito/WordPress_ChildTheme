<?php

/*** CHILD THEME STUFF FROM THEME AUTHOR -- LOAD CHILD THEME STYLES / LANGUAGE / ETC.  ***/

define( 'CHILD_THEME_PICTAU_VERSION', '1.0.0' );

function child_enqueue_styles() {

	wp_enqueue_style( 'mld-theme-css', get_stylesheet_directory_uri() . '/style.css', array('astra-theme-css'), CHILD_THEME_PICTAU_VERSION, 'all' );

}

add_action( 'wp_enqueue_scripts', 'child_enqueue_styles', 15 );


function pct_scripts() {
	wp_register_script('pictau', get_stylesheet_directory_uri() . '/js/custom_theme_scripts.min.js',false,'1.0',true);
	wp_localize_script('pictau', 'pct_globalVars', array('homeURL' => esc_url( home_url() ), 'mediaURL' => wp_upload_dir()['baseurl'] ) );
	wp_enqueue_script('pictau');
}

add_action('wp_enqueue_scripts', 'pct_scripts',90);


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




