<?php

/*** Child Theme Function  ***/

function mkd_child_theme_enqueue_scripts() {
	wp_register_style( 'childstyle', get_stylesheet_directory_uri() . '/style.css'  );
	wp_enqueue_style( 'childstyle' );
}
add_action('wp_enqueue_scripts', 'mkd_child_theme_enqueue_scripts', 11);










/*------------------------------------------------------------------------------------------------------*\

						DEQUEUE ENQUEUE STYLES/SCRIPTS

\*------------------------------------------------------------------------------------------------------*/

function pct_scripts() {
	wp_register_script('pictau', get_stylesheet_directory_uri() . '/js/custom_theme_scripts.min.js',false,'1.0',true);
	wp_localize_script('pictau', 'globalObject', array('homeURL' => esc_url( home_url() ) ) );
	wp_enqueue_script('pictau');




	//wp_register_style('pictau-icons', get_stylesheet_directory_uri() . '/css/pictau-icons.css');
	//wp_enqueue_style('pictau-icons');



/*	wp_register_style('Roboto', '//fonts.googleapis.com/css?family=Roboto:300,400,700');
	wp_enqueue_style('Roboto');

	wp_register_style('Montserrat', '//fonts.googleapis.com/css?family=Montserrat:400,700,800,800i&display=swap,900');
	wp_enqueue_style('Montserrat');


	//wp_register_style('Poppins', '//fonts.googleapis.com/css?family=Poppins:600,700');
	//wp_enqueue_style('Poppins');
*/


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




/*------------------------------------------------------------------------------------------------------*\

						DEQUEUE NATIVE THEME GOOGLE MAPS API AND INCLUDE MY OWN WITH API KEY

\*------------------------------------------------------------------------------------------------------*/
function google_map_api_key_fix(){
	wp_dequeue_script( 'google_map_api' );
	wp_deregister_script( 'google_map_api' );
	wp_enqueue_script("google_map_api", "https://maps.googleapis.com/maps/api/js?key=AIzaSyBhzX6xzzN6rihHbAnjf6m6BCEub0ja5p8",array(),false,true);
	//wp_dequeue_script( 'jquery-core' );
}

//add_action('after_setup_theme', 'google_map_api_key_fix');
add_action('wp_enqueue_scripts', 'google_map_api_key_fix',100);


/*------------------------------------------------------------------------------------------------------*\

						DISABLE FEEDS

\*------------------------------------------------------------------------------------------------------*/
function wpb_disable_feed() {
wp_die( __('No feed available,please visit our <a href="'. get_bloginfo('url') .'">homepage</a>!') );
}

add_action('do_feed', 'wpb_disable_feed', 1);
add_action('do_feed_rdf', 'wpb_disable_feed', 1);
add_action('do_feed_rss', 'wpb_disable_feed', 1);
add_action('do_feed_rss2', 'wpb_disable_feed', 1);
add_action('do_feed_atom', 'wpb_disable_feed', 1);
add_action('do_feed_rss2_comments', 'wpb_disable_feed', 1);
add_action('do_feed_atom_comments', 'wpb_disable_feed', 1);



/*------------------------------------------------------------------------------------------------------*\

						DISABLE EMOJI's LIBRARIES

\*------------------------------------------------------------------------------------------------------*/

/**
 * Disable the emoji's
 */
function disable_emojis() {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
	add_filter( 'tiny_mce_plugins', 'disable_emojis_tinymce' );
}
add_action( 'init', 'disable_emojis' );

/**
 * Filter function used to remove the tinymce emoji plugin.
 *
 * @param    array  $plugins
 * @return   array             Difference betwen the two arrays
 */
function disable_emojis_tinymce( $plugins ) {
	if ( is_array( $plugins ) ) {
		return array_diff( $plugins, array( 'wpemoji' ) );
	} else {
		return array();
	}
}


/*------------------------------------------------------------------------------------------------------*\

						PLUGIN UPDATE DISABLING

\*------------------------------------------------------------------------------------------------------*/

function remove_update_notifications($value) {
    if ( isset( $value ) && is_object( $value ) ) {
        unset($value->response[ 'flowplayer5/flowplayer.php' ]);
    }
    return $value;
}
add_filter('site_transient_update_plugins', 'remove_update_notifications');


/*------------------------------------------------------------------------------------------------------*\

						VIDEO SHORTCODE OVERRIDE

\*------------------------------------------------------------------------------------------------------*/
function pct_videoplayer_override($output, $attr, $content, $instance){
	/*
		$attr elements:
			- $attr['width']
			- $attr['height']
			- $attr['mp4']
			- $attr['poster']

	echo '<pre>';
	echo 'code= ' . parse_url($attr['mp4'], PHP_URL_HOST);
	print_r($attr);
	echo '</pre>';
	*/

	$shortcode_id = (string)parse_url($attr['mp4'], PHP_URL_HOST);
	//echo 'shortcode= '. $shortcode_id;
	echo do_shortcode('[flowplayer id="'. $shortcode_id .'"]');
	//echo do_shortcode('[flowplayer id="12450"]');

}

add_filter( 'wp_video_shortcode_override', 'pct_videoplayer_override', 10, 4 );





function my_portfolio_similarTags($atts){

    extract(shortcode_atts(array(
	"postIDcaller" 		=> '',
	), $atts));

	global $post;

	$portfolio_tags = wp_get_post_terms(get_the_ID(),'portfolio_tag');

	if(is_array($portfolio_tags) && count($portfolio_tags)) {

		$portfolio_tags_array = array();

		foreach ($portfolio_tags as $portfolio_tag) {
			$portfolio_tags_array[] = $portfolio_tag->name;
			//echo $portfolio_tag->name . '<br/>';
		}

		$xargs = array(
		'post_type' => 'portfolio_page',
		'nopaging' => true,
		'post_status' => 'publish',
        'tax_query' => array(
                        array( 'taxonomy' => 'portfolio_tag',
                                'field' => 'name',
                                'terms' => $portfolio_tags_array
                              )
                            ),
        'post__not_in'     => array( $post->ID ),
		'orderby' => 'date',
        'order' => 'DESC',
		);


		$loop = new WP_Query( $xargs );

		//echo '<h2>Posts found: '. $loop->found_posts .'</h2>';

		if($loop->found_posts) {

		?>
		<!-- div class="portfolio_main_holder projects_masonry_holder  gs5 " data-parallax_item_speed="0.3" data-parallax_item_offset="0" style="opacity: 1; position: relative; height: auto !important;"-->
		<div class="pct-similar-tags portfolio_main_holder projects_masonry_holder  gs5 " data-parallax_item_speed="0.3" data-parallax_item_offset="0" style="opacity: 1; position: relative; height: auto !important;">

		<?php

		while( $loop->have_posts() ) :
			$loop->the_post();
			$title = get_the_title();
			$feat_image = get_the_post_thumbnail_url(get_the_ID(),'large');
			$link = get_the_permalink();

/*
		echo '<pre>';
		print_r($loop);
		echo '</pre>';
*/




			?>
			   <article class="portfolio_category_98 portfolio_category_93  default">
			      <div class="item_holder upward_hover">
			         <div class="text_holder" style="background-color:#ffffff;">
			            <div class="text_holder_outer">
			               <div class="text_holder_inner">
			                  <h5 class="portfolio_title" style="color: #000000;"><a href="http://localhost/studiocapicua/portfolio/video-animation-waves/" style="color: inherit;"><?php echo $title; ?></a></h5>
			               </div>
			            </div>
			         </div>
			         <a class="portfolio_link_class" href="<?php echo $link; ?>" target="_self"></a>
			         <div class="portfolio_shader"></div>
			         <div class="image_holder"><span class="image"><img src="<?php echo $feat_image; ?>" class="attachment-portfolio-square size-portfolio-square wp-post-image" alt="" ></span></div>
			      </div>
			   </article>

			<?php

		endwhile;

		?>
		</div>

		<?php

	    }
	    else {
		    //No hay posts con la misma etiqueta, mostramos posts de misma categoría...
    		return my_portfolio_similarCat();

	    }

		wp_reset_postdata();

	}
	else {
		//No hay etiquetas, mostramos posts de misma categoría...
		return my_portfolio_similarCat();
	}
}

add_shortcode('similarTags','my_portfolio_similarTags');






function my_portfolio_similarCat(){

	$portfolio_categories = wp_get_post_terms(get_the_ID(),'portfolio_category');

		if(is_array($portfolio_categories) && count($portfolio_categories)){

			$portfolio_categories_array = array();


			$my_sim = '[no_portfolio_list type="masonry" masonry_space="no" hover_type_masonry="upward_hover" hover_box_color_masonry="#ffffff" grid_size="5" show_icons="no" show_title="yes" title_tag="h5" title_color="#000000" portfolio_link_pointer="single" show_categories="yes" category_color="#f86710" category="';
			foreach($portfolio_categories as $portfolio_category) {
				$portfolio_categories_array[] = $portfolio_category->name;
				$my_sim .= $portfolio_category->name . ',';
			}
			$my_sim .= '" number="20"]';
		}

		return do_shortcode($my_sim);
}

add_shortcode('portfolios-similarCat','my_portfolio_similarCat');

