(function($){
    "use strict";

	/*------------------------------------------------------------------------------------------------------*\

							ONLOAD SECTION

	\*------------------------------------------------------------------------------------------------------*/
	/* TODO: auto animaciones fadein, zoomin, etc. activadas por css class y delay para secuencias de animación por data-anim-delay="" attribute
	*/


	$(window).on('load',function(){

	});

	 /*------------------------------------------------------------------------------------------------------*\

	 						STICKY FORM LEAD

	 \*------------------------------------------------------------------------------------------------------*/

	 // NEEDS THE FOLLOWING LIBRARY: "jquery.sticky-kit.min.js"
	var $formFloat = $('#lead-form-float');



	 //var $formFloat = $('#lead-form-float .section-content');


	 $formFloat.stick_in_parent({offset_top: 120});
	 //console.log('form stick in parent');


	 /*------------------------------------------------------------------------------------------------------*\

	 						MAKE AUTOMATIC BACKGROUND FROM IMG

	 \*------------------------------------------------------------------------------------------------------*/
	[].slice.call( document.querySelectorAll( '[isbackground]' ) ).forEach( function( element ) {
		var el = $(element);
		var bg = el.attr('src');
		el.css({
			'opacity' : '0',
		});

		el.parent().css({
			'background-image' : 'url("'+ bg +'")',
			'background-size' : 'cover',
		});

	});



	/*------------------------------------------------------------------------------------------------------*\

							FIX Z-INDEX FOR ELEMENTS WITH DIV-BACKGROUNDS

	\*------------------------------------------------------------------------------------------------------*/



	[].slice.call( document.querySelectorAll( '.bg-full' ) ).forEach( function( element ) {
		var el = $(element);




	});




})(jQuery);



