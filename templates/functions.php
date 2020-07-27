<?php
function oceanwp_child_enqueue_parent_style() {
	// Dynamically get version number of the parent stylesheet (lets browsers re-cache your stylesheet when you update your theme)
	$theme   = wp_get_theme( 'OceanWP' );
	$version = $theme->get( 'Version' );
	// Load the stylesheet
	wp_enqueue_style( 'pictau-child', get_stylesheet_directory_uri() . '/style.css', array( 'oceanwp-style' ), $version );

}
add_action( 'wp_enqueue_scripts', 'oceanwp_child_enqueue_parent_style',100 );/* custom PHP functions below this line */

add_action( 'wp_enqueue_scripts', 'remove_default_stylesheet', 20 );
function remove_default_stylesheet() {
	wp_deregister_style( 'elementor-icons' );
	//wp_deregister_style( 'simple-line-icons' ); // used by oceanwp like search magnifier and home icon on header breadcrumb...
}
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


/*------------------------------------------------------------------------------------------------------*
						MOBILE MENU WIDGET
\*------------------------------------------------------------------------------------------------------*/
function mobile_menu_widgets_init() {
 register_sidebar( array(
 'name' => 'Mobile Menu Widget',
 'id' => 'widget_area' ) );
}
add_action( 'widgets_init', 'mobile_menu_widgets_init' );




add_filter( 'excerpt_more', function( $more ) {
	return '...';
}, 25 );



/**
 * CHANGE THE "page" slug for pagination
 *
 */

function re_rewrite_rules() {
global $wp_rewrite;
$wp_rewrite->pagination_base = esc_attr__( 'page', 'oceanwp' );
$wp_rewrite->flush_rules();
}
add_action('init', 're_rewrite_rules');


/*------------------------------------------------------------------------------------------------------*
						SHORTCODE FOR RECRUSOS DESCARGABLES
\*------------------------------------------------------------------------------------------------------*/


function recurso_pasti($atts, $content = null) {

    extract(shortcode_atts(array(
	"title"		=> '',
	"img"		=> '',
	"ribbon"	=> '',
	"form"	=> '',
	), $atts));

	$ribbonFront = ($ribbon) ? '<div class="card-ribbon"><span>'. $ribbon .'</span></div>' : '';
	$ribbonBack = ($ribbon) ? '<div class="card-ribbon-back"><span></span></div>' : '';
	$imgOut = '<img src="' . do_shortcode('[myPics]') . $img . '" />';
	$loquiero = esc_attr__( 'Lo quiero', 'oceanwp' );

	$html_out = '<card class="pct-recurso-tile">
		<div class="flip-card">
			<div class="flip-card-front">';

	$html_out.= $ribbonFront;

	$html_out.= '<div class="card-content">
					<div class="card-header">
						<figure>'.  $imgOut .'</figure>
						<h2>'. $title .'</h2>
					</div>
					<div class="card-description">
						<p>'. $content .'</p>
						<a class="button elementor-animation-grow" href="#">
							<span>'. $loquiero .'</span>
						</a>
					</div>
				</div>
			</div>
			<div class="flip-card-back">';
	$html_out.= $ribbonBack;

	$html_out.= '<div class="pct-close-flipped"><a href="#"><i class="sidr-class-icon icon-close" aria-hidden="true"></i></a></div>';

	$html_out.= '<div class="pct-lead-heading"><h2 class="elementor-heading-title elementor-size-default">Te lo envío a tu email</h2>
<p>
Indícame tu email y recibirás el contenido cómodamente en tu buzón.</p></div>';

	$html_out.= do_shortcode('[contact-form-7 id="'. $form .'" title="magnet-descargable" html_class="submit_on_email"]');

	$html_out.= '</div>
		</div>
	</card>';

	return $html_out;
}

add_shortcode('recurso', 'recurso_pasti');



/*------------------------------------------------------------------------------------------------------*
						LEARNDASH + ELEMENTOR
\*------------------------------------------------------------------------------------------------------*/

/**
 * If running Elementor Pro 2.3.0 of higher there is a filter to add custom post types
 */
add_filter( 'elementor_pro/utils/get_public_post_types', function( $post_types ) {
	$post_types['sfwd-courses'] = LearnDash_Custom_Label::get_label( 'courses' );
	$post_types['sfwd-lessons'] = LearnDash_Custom_Label::get_label( 'lessons' );
	$post_types['sfwd-topic'] = LearnDash_Custom_Label::get_label( 'topics' );
	$post_types['sfwd-quiz'] = LearnDash_Custom_Label::get_label( 'quizzes' );

	return $post_types;
} );



/*------------------------------------------------------------------------------------------------------*
						SHORTCODE FOR COURSE LANDING CONDITIONAL (VISTOR vs ENROLLED)
\*------------------------------------------------------------------------------------------------------*/


function landing_curso_content($atts, $content = null) {

    extract(shortcode_atts(array(
	"template"		=> '',
	), $atts));

	return  '<div class="pct-visitor-content">' . do_shortcode('[visitor]'. do_shortcode('[elementor-template id="'. $template .'"]') .'[/visitor]') . '</div>';
}

add_shortcode('landing_curso', 'landing_curso_content');



function ld_student_pictau($atts,$content){
	$text = do_shortcode('[ld_profile]');


	$final = do_shortcode('[student]'. $text . $content . '[/student]');
	$final = strip_tags($final,'<div><ul><li><i><a><table><td><th><tr><style><img><span><form><input><strong><h2>');

	return $final;
}

add_shortcode('student_pct','ld_student_pictau');

/*------------------------------------------------------------------------------------------------------*
						WOOCOMMERCE MI CUENTA UNIFICAMOS PESTAÑAS DIRECCIONES Y EDITAR CUENTA
\*------------------------------------------------------------------------------------------------------*/

/* Unificando contenido de pestañas */
// Primero ocultamos la pestaña a mover (edit-address en este ejemplo)

add_filter( 'woocommerce_account_menu_items', 'mover_micuenta_direcciones', 999 );

function mover_micuenta_direcciones( $items ) {
unset($items['edit-address']);
return $items;
}

// Luego mostramos el contenido de las direcciones en otra pestaña (edit-account en este ejemplo)

add_action( 'woocommerce_account_edit-account_endpoint', 'woocommerce_account_edit_address' );



/*------------------------------------------------------------------------------------------------------*
						REMOVE AUTO <p> + <br> tags on do_shortcodes  --> wpautop
						How it works: We disable wpautop so do_shortcode execs "before", then we re-enable it with a lower priority (11)
\*------------------------------------------------------------------------------------------------------*/
//move wpautop filter to AFTER shortcode is processed
//remove_filter( 'the_content', 'wpautop' );
//remove_filter('the_content', 'wptexturize');
//add_filter( 'the_content', 'wpautop' , 999);




/*
add_action('nav_menu_css_class', 'add_current_nav_class', 10, 2 );

	function add_current_nav_class($classes, $item) {

		// Getting the current post details
		global $post;

		// Getting the post type of the current post
		$current_post_type = get_post_type_object(get_post_type($post->ID));
		$current_post_type_slug = $current_post_type->rewrite[slug];

		// Getting the URL of the menu item
		$menu_slug = strtolower(trim($item->url));

		// If the menu item URL contains the current post types slug add the current-menu-item class
		if (strpos($menu_slug,$current_post_type_slug) !== false) {

		   $classes[] = 'current-menu-item';

		}

		// Return the corrected set of classes to be added to the menu item
		return $classes;

	}
*/

/**
 * Change the Related Posts title "You Might Also Like" ....
 */
/*
 function myprefix_related_posts_title() {
	return esc_attr__( 'You might also like', 'oceanwp' );
}
add_filter( 'ocean_related_posts_title', 'myprefix_related_posts_title' );
*/


?>