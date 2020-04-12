<?php
function oceanwp_child_enqueue_parent_style() {
	// Dynamically get version number of the parent stylesheet (lets browsers re-cache your stylesheet when you update your theme)
	$theme   = wp_get_theme( 'OceanWP' );
	$version = $theme->get( 'Version' );
	// Load the stylesheet
	wp_enqueue_style( 'pictau-child', get_stylesheet_directory_uri() . '/style.css', array( 'osh-styles' ), $version );

}
add_action( 'wp_enqueue_scripts', 'oceanwp_child_enqueue_parent_style' );/* custom PHP functions below this line */


/*------------------------------------------------------------------------------------------------------*\

						WP MAIL FROM CUSTOMIZATION

\*------------------------------------------------------------------------------------------------------*/

function custom_wp_mail_from_name( $original_email_from ) {
	return 'SEJIMENEZ';
}

function custom_wp_email_address( $original_email_address ) {
    return 'contacto@sejimenez.com';
}


add_filter( 'wp_mail_from', 'custom_wp_email_address' );
add_filter( 'wp_mail_from_name', 'custom_wp_mail_from_name' );



/*------------------------------------------------------------------------------------------------------*\

						DEQUEUE ENQUEUE STYLES/SCRIPTS

\*------------------------------------------------------------------------------------------------------*/

function pct_scripts() {
	wp_register_script('pictau', get_stylesheet_directory_uri() . '/js/custom_theme_scripts.min.js',false,'1.0',true);
	wp_localize_script('pictau', 'globalObject', array('homeURL' => esc_url( home_url() ) ) );
	wp_enqueue_script('pictau');



	//wp_register_script('jquerymodal', get_stylesheet_directory_uri() . '/js/jquery.modal.min.js','jquery','1.0',true);
	//wp_enqueue_script('jquerymodal');

	//wp_register_style('jquerymodalStyles', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css',false,'1.0');
	//wp_enqueue_style('jquerymodalStyles');


	//wp_deregister_style( 'iconsmind' );
	//wp_register_style( 'iconsmind', get_template_directory_uri() . '/css/iconsmind.css', '', '7.6' );
	//wp_enqueue_style('iconsmind');

	//wp_register_style('pictau-icons', get_stylesheet_directory_uri() . '/css/pictau-icons.css');
	//wp_enqueue_style('pictau-icons');



/*	wp_register_script('mmodal', get_stylesheet_directory_uri() . '/js/material_modal.js','jquery','1.0',true);
	wp_enqueue_script('mmodal');

	wp_register_style('mmodalStyles', get_stylesheet_directory_uri() . '/css/material_modal.css',false,'1.0');
	wp_enqueue_style('mmodalStyles');
*/


/*	wp_register_style('Roboto', '//fonts.googleapis.com/css?family=Roboto:300,400,700');
	wp_enqueue_style('Roboto');

	wp_register_style('Montserrat', '//fonts.googleapis.com/css?family=Montserrat:400,700,800,800i&display=swap,900');
	wp_enqueue_style('Montserrat');


	//wp_register_style('Poppins', '//fonts.googleapis.com/css?family=Poppins:600,700');
	//wp_enqueue_style('Poppins');


	wp_register_script('scrolltrigger', get_stylesheet_directory_uri() . '/js/ScrollTrigger.min.js',false,'1.0',true);
	wp_enqueue_script('scrolltrigger');
*/
	//Estilos específicos para el template de PICTAU LANDING
	if ( is_page_template(array('landing.php','landing_no_menu.php'))){
		wp_register_style('landing_css', get_stylesheet_directory_uri() . '/css/style_landing_template.css', false, '1.1');
		wp_enqueue_style('landing_css');
		wp_register_script('sticky-kit', get_stylesheet_directory_uri() . '/js/jquery.sticky-kit.min.js',false,'1.0',true);
		wp_enqueue_script('sticky-kit');



		//Quitamos aviso de cookies (cookie-notice plugin)
		wp_dequeue_script('cookie-notice-front');
	}



	//wp_deregister_style( 'dynamic-css-css' );

//	wp_register_style( 'stylesheet', QODE_ROOT . "/css/stylesheet.min.css",array('childstyle'));
//	wp_enqueue_style('stylesheet');




}

add_action('wp_enqueue_scripts', 'pct_scripts',90);





/*------------------------------------------------------------------------------------------------------*\

						CONTACT FORM 7 NEW "on_sent_ok" events

\*------------------------------------------------------------------------------------------------------*/

function cf7_events() {
?>
	<script type="text/javascript">
	document.addEventListener( 'wpcf7mailsent', function( event ) {

	    if ( '730' == event.detail.contactFormId ) { //WATCH OUT!, check form ID to target this specific form: "id == event.detail.contactFromId"
		    //console.log('EVENTO ENVIADO A ANALYTICS: ' + dataLayer);
		    dataLayer.push({
	        'event': 'gaEvent',
	        'eventCategory': 'Formulario',
	        'eventAction': 'formSubmit',
	        'eventLabel': 'Formulario Contacto General'
			});
			//location = 'https://www.pictau.com/gracias';
	    }

	    if ( '1171' == event.detail.contactFormId ) { //WATCH OUT!, check form ID to target this specific form: "id == event.detail.contactFromId"
		    //console.log('EVENTO ENVIADO A ANALYTICS de DESARROLLO WEB: ' + dataLayer);
		    dataLayer.push({
	        'event': 'gaEvent',
	        'eventCategory': 'Formulario',
	        'eventAction': 'Submit',
	        'eventLabel': 'Landing Desarrollo Web'
			});
	    }

	    if ( '1226' == event.detail.contactFormId ) { //WATCH OUT!, check form ID to target this specific form: "id == event.detail.contactFromId"
			//console.log('EVENTO ENVIADO A ANALYTICS de ECOMMERCE: ' + dataLayer);
		    dataLayer.push({
	        'event': 'gaEvent',
	        'eventCategory': 'Formulario',
	        'eventAction': 'Submit',
	        'eventLabel': 'Landing TIENDA ONLINE'
			});
			//location = 'https://www.pictau.com/gracias';
	    }


	}, false );
	</script>
<?php
}

add_action( 'wp_footer', 'cf7_events' );






/*------------------------------------------------------------------------------------------------------*\

						COOKIE NOTICE OUTPUT FRONT-END CUSTOMIZATION

\*------------------------------------------------------------------------------------------------------*/

function pct_frontend_cookie($output, $options) {
			$output = '<div id="cookie-notice" role="banner" class="cn-' . ($options['position']) . ($options['css_style'] !== 'none' ? ' ' . $options['css_style'] : '') . '" style="color: ' . $options['colors']['text'] . '; background-color: ' . $options['colors']['bar'] . ';">'
				. '<div class="cookie-notice-container"><span id="cn-notice-text">'. $options['message_text'] .'</span>'
				. '<a href="#" id="cn-accept-cookie" data-cookie-set="accept" class="cn-set-cookie ' . $options['button_class'] . ($options['css_style'] !== 'none' ? ' ' . $options['css_style'] : '') . '">' . $options['accept_text'] . '</a></div></div>';

			return $output;
}

//add_filter('cn_cookie_notice_output','pct_frontend_cookie',10,2);


/*------------------------------------------------------------------------------------------------------*\

						CUSTOM ADMIN STYLES

\*------------------------------------------------------------------------------------------------------*/

function load_admin_styles() {
	wp_enqueue_style( 'admin_css_pictau', get_stylesheet_directory_uri() . '/css/admin-styles.css', false, '1.0.0' );
}

add_action( 'admin_enqueue_scripts', 'load_admin_styles' );



/*------------------------------------------------------------------------------------------------------*\

						DEQUEUE NATIVE THEME GOOGLE MAPS API AND INCLUDE MY OWN WITH API KEY

\*------------------------------------------------------------------------------------------------------*/
function google_map_api_key_fix(){
//	wp_enqueue_script("google_map_api", "https://maps.googleapis.com/maps/api/js?key=AIzaSyCfp5eHXVq9yxlHaokK_2VFvs5mNPm3p4g",array(),false,true);
	wp_dequeue_script( 'jquery-core' );
}

//add_action('after_setup_theme', 'google_map_api_key_fix');
add_action('wp_enqueue_scripts', 'google_map_api_key_fix');





?>