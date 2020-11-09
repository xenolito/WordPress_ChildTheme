<?php
/*
Plugin Name: PICTAU's essentials
Plugin URI: https://www.pictau.com/
Description: Plugin para la configuración, optimización y personalización del tema / WordPress
Version: 1.1
Author: Oscar Rey Tajes
Author URI: http://www.pictau.com
License: GPLv2 o posterior
*/


/*------------------------------------------------------------------------------------------------------*
						CONDITIONAL PLUGIN LOAD
\*------------------------------------------------------------------------------------------------------*/

if(!is_admin())
	add_filter( 'option_active_plugins', 'pictau_option_active_plugins', 1);

function pictau_option_active_plugins ( $plugin_list ){
	$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

	$is_homepage = false;

	$my_url_arr = explode('/',parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));


	if( ($_SERVER['HTTP_HOST'] === 'localhost' && $my_url_arr[2] ==='') || $my_url_arr[1] ==='' ) {
		$is_homepage = true;
	}

	// CONTACT FORM 7 SELECTOR
	$is_cf7_needed = (strpos($request_uri,'/contacto')!== false || strpos($request_uri,'/seguros')!== false || strpos($request_uri,'/landing')!== false || strpos( $request_uri, '/wp-json/contact-form-7/v1/contact-forms/') !== false || $is_homepage);
    //Lo quitamos cuando no es necesario
    if (!$is_cf7_needed)
        unset( $plugin_list[array_search( 'contact-form-7/wp-contact-form-7.php', $plugin_list)]);



	//THRIVE ARCHITECT SELECTOR
	/*
	$is_tve_needed = (strpos($request_uri,'/landing')!== false);
	if (!$is_tve_needed){
	    unset( $plugin_list[array_search( 'thrive-visual-editor/thrive-visual-editor.php', $plugin_list)]);
		unset($plugin_list[array_search('thrive-product-manager/thrive-product-manager.php', $plugin_list)]);
		unset($plugin_list[array_search('thrive-leads/thrive-leads.php', $plugin_list)]);

	}
	*/

   //Y aquí devolvemos a WordPress el listado de plugins que queremos cargar
   return $plugin_list;
}



/*------------------------------------------------------------------------------------------------------*
						LOGIN PAGE CUSTOMIZATION
\*------------------------------------------------------------------------------------------------------*/


/* PÁGINA DE LOGIN: CORREJIMOS LOGO Y LINKS */

function custom_login_logo() {
	echo '<style type="text/css">h1 a { background: url(' . myImageLink() . '/login-logo-excess.svg) 50% 50% no-repeat !important; width:100% !important; }</style>';
}
add_action('login_head', 'custom_login_logo');

function my_login_logo_url() {
	return get_bloginfo( 'url' );
}

add_filter( 'login_headerurl', 'my_login_logo_url' );

function my_login_logo_url_title() {
	return 'Powered by PICTAU';
}

add_filter( 'login_headertext', 'my_login_logo_url_title' );

function my_custom_login() {
	echo '<link rel="stylesheet" type="text/css" href="' . get_bloginfo('stylesheet_directory') . '/css/custom-login-styles.css" />';
}

add_action('login_head', 'my_custom_login');



function login_checked_remember_me() {
	add_filter( 'login_footer', 'rememberme_checked' );
}
add_action( 'init', 'login_checked_remember_me' );

function rememberme_checked() {
	echo "<script>document.getElementById('rememberme').checked = true;</script>";
}

/*------------------------------------------------------------------------------------------------------*\

						SETTING PICTAU's CUSTOM SHORTCODES

\*------------------------------------------------------------------------------------------------------*/

//Shortcode API images
function myImageLink() {
	return wp_upload_dir()['baseurl'];
}
add_shortcode('myPics', 'myImageLink');
// end shortcode images


//Shortcode API images
function myImageSRCsets($atts) {

    extract(shortcode_atts(array(
	"id" 		=> '',
	"size"		=> 'full'
	), $atts));

	return wp_get_attachment_image( $id, $size );
}
add_shortcode('myImg', 'myImageSRCsets');
// end shortcode images



//Shortcode API baseURL
function myBaseURL() {
	return get_option('home');
}
add_shortcode('myBaseURL', 'myBaseURL');


//Shortcode API baseURL
function getThemeURL() {
	return get_stylesheet_directory();
}

add_shortcode('myThemeURL', 'getThemeURL');


//shortcode for current year in footer

function myYearCredits(){
	return date('Y');
}

add_shortcode('myYear','myYearCredits');

function siteDomainURL(){
	return site_url();
}

add_shortcode( 'siteURL', 'siteDomainURL' );


function pictau_custom_icon($atts, $content) {
    extract(shortcode_atts(array(
	"icon" 		=> '',
	"class"		=> '',
	), $atts));

	$ico_svg = '<svg class="pct_custom_icon '. $class .'" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><use xlink:href="'. PICTAU_ICON_SPRITE .'#'. $icon .'"></use></svg>';

	return $ico_svg;

//	return PICTAU_ICON_SPRITE . '|' . get_stylesheet_directory_uri();
}

add_shortcode( 'pct_icon', 'pictau_custom_icon' );


// ! AVIF IMAGES WITH fallback to choose (svg, png, jpg)
/*
@param fallback [jpg,png,svg,webp]
*/
function mediaFallback($atts) {
    extract(shortcode_atts(array(
	"filename" 		=> '',
	"fallback"		=> 'jpg',
	"class"			=> false,
	), $atts));

	$clss = ($class) ? ' class="' . $class . '"' : '';

	$media = '<picture>
<source type="image/avif" srcset="'. wp_upload_dir()['baseurl'] . '/' . $filename .'.avif">';
	$media .= ($fallback == 'webp') ? '<source type="image/webp" srcset="'. wp_upload_dir()['baseurl'] . '/' . $filename .'.webp">' : '';
	$media .= ($fallback == 'svg') ? '<source type="image/svg+xml" srcset="'. wp_upload_dir()['baseurl'] . '/' . $filename .'.svg">' : '';
	$media .= ($fallback == 'png') ? '<source type="image/png" srcset="'. wp_upload_dir()['baseurl'] . '/' . $filename .'.png">' : '';
	$media .= '<img src="'. wp_upload_dir()['baseurl'] . '/' .$filename . '.jpg"' . $clss . '>';
	$media .= '</picture>';

	return $media;
}

add_shortcode( 'pct_avif_img', 'mediaFallback' );


/*------------------------------------------------------------------------------------------------------*\

						REMOVE JQMIGRATE JS

\*------------------------------------------------------------------------------------------------------*/
add_filter( 'wp_default_scripts', 'dequeue_jquery_migrate' );

function dequeue_jquery_migrate( &$scripts){
	if(!is_admin()){
		$scripts->remove( 'jquery');
		$scripts->add( 'jquery', false, array( 'jquery-core' ), '1.10.2' );
	}
}


/*------------------------------------------------------------------------------------------------------*\

						PLUGIN UPDATE DISABLING

\*------------------------------------------------------------------------------------------------------*/

function pct_remove_update_notifications($value) {
    if ( isset( $value ) && is_object( $value ) ) {
        unset($value->response[ 'revslider/revslider.php' ]);
    }
    return $value;
}

add_filter('site_transient_update_plugins', 'pct_remove_update_notifications');


/*------------------------------------------------------------------------------------------------------*\

						DISABLE EMOJIs

\*------------------------------------------------------------------------------------------------------*/
function disable_wp_emojicons() {

  // all actions related to emojis
  remove_action( 'admin_print_styles', 'print_emoji_styles' );
  remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
  remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
  remove_action( 'wp_print_styles', 'print_emoji_styles' );
  remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
  remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
  remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );

  // filter to remove TinyMCE emojis
  add_filter( 'tiny_mce_plugins', 'disable_emojicons_tinymce' );
}
add_action( 'init', 'disable_wp_emojicons' );

function disable_emojicons_tinymce( $plugins ) {
  if ( is_array( $plugins ) ) {
    return array_diff( $plugins, array( 'wpemoji' ) );
  } else {
    return array();
  }
}

/*------------------------------------------------------------------------------------------------------*\

						ALLOW SVG UPLOADS TO MEDIA LIBRARY (SAFELY)

\*------------------------------------------------------------------------------------------------------*/

function cc_mime_types($mimes) {
  $mimes['svg'] = 'image/svg+xml';
  return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');





/*------------------------------------------------------------------------------------------------------*\

						WIDGET ARCHIVOS: CUSTOMIZED

\*------------------------------------------------------------------------------------------------------*/
// Function to get archives list with limited months
function wpb_limit_archives() {

$my_archives = wp_get_archives(array(
    'type'=>'monthly',
    'limit'=>6,
    'echo'=>0
));

return '<ul>' . $my_archives . '</ul>';

}

// Create a shortcode
add_shortcode('pct_wdgt_custom_archives', 'wpb_limit_archives');

// Enable shortcode execution in text widget
add_filter('widget_text', 'do_shortcode');



/*------------------------------------------------------------------------------------------------------*\

						ELIMINAMOS GOOGLE MAPS .js PARA AQUELLAS PÁGINAS QUE NO TENGAN MAPA

\*------------------------------------------------------------------------------------------------------*/

add_action( 'wp_print_scripts', 'my_deregister_javascript', 100 );

function my_deregister_javascript() {
	$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

	if( !(strpos($request_uri,'/contacto') !== false) ) {
		wp_deregister_script( 'google_map_api' );
	}
}


/*------------------------------------------------------------------------------------------------------*\

						RETRIEVE LOGGED IN USER ROLE

\*------------------------------------------------------------------------------------------------------*/

function get_user_role() {
	if( is_user_logged_in() ) {
		$user = wp_get_current_user();
		$role = ( array ) $user->roles;
		return $role[0];
	}
	else {
		return false;
	}
}



/*------------------------------------------------------------------------------------------------------*\

						ADD CLASS TO BODY (usr-ga-excluded) TO IDENTIFY USER ROLES (This will be used to exclude logged in admins, editors... anyone except subscriber or customer) TO BE EXCLUDED FROM  GA tracking)

\*------------------------------------------------------------------------------------------------------*/


add_filter('body_class','addUserRole_BodyClass');

function addUserRole_BodyClass( $classes ) {
	$user_role = get_user_role();


	if($user_role && $user_role !== 'subscriber' && $user_role !== 'customer') {
		$classes[] = 'usr-ga-excluded';
	}
	// return the $classes array
	return $classes;
}


/*------------------------------------------------------------------------------------------------------*
                        DISABLE AUTOUPDATE TRANSLATIONS
\*------------------------------------------------------------------------------------------------------*/

add_filter( 'auto_update_translation', '__return_false' );
add_filter( 'async_update_translation', '__return_false' );



?>
