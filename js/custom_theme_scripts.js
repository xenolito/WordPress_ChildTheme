import Swiper from 'swiper'
import SwiperCore, { Pagination, Autoplay } from 'swiper/core'
import './mod/avif-webp'
import signature from 'console-signature'
import './mod/contactForm7'
;(function ($) {
    ;('use strict')

    /** Global vars defined by functions.php with 'wp_localize_script' @ script enqueue   **/
    var global = pct_globalVars
    signature()
    /*------------------------------------------------------------------------------------------------------*\

							ONLOAD modified for v 3++

	\*------------------------------------------------------------------------------------------------------*/

    $(window).on('load', function () {})
    /**----------------------- END ONLOAD SECTION ----------------------------------------------------------*/

    /*------------------------------------------------------------------------------------------------------*
                            ! Swiper sliders
    \*------------------------------------------------------------------------------------------------------*/
    // SwiperCore.use([Navigation, Pagination, Autoplay])
    SwiperCore.use([Pagination, Autoplay])

    const swiper = new Swiper('.slider-logos', {
        loop: true,
        slidesPerView: 2,
        spaceBetween: 0,
        centeredSlides: true,
        preventClicks: false,
        autoplay: {
            delay: 2500,
            pauseOnMouseEnter: true,
            disableOnInteraction: true,
        },
        speed: 700,
        breakpoints: {
            // when window width is >= 480px
            480: {
                slidesPerView: 2,
            },
            // when window width is >= 640px
            700: {
                slidesPerView: 4,
            },
            1120: {
                slidesPerView: 5,
            },
            1550: {
                slidesPerView: 6,
            },
        },
        // navigation: {
        //     nextEl: '.swiper-button-next',
        //     prevEl: '.swiper-button-prev',
        // },
    })

    /**
       //!AVIF BACKGROUND IMAGES BY CLASS SELECTOR
     *  if not AVIF capabilities, then use a .jpg instead
     * AVIF capabilities checked by avif-webp.js, adding a webp/avif class to <html> tag.
     */
    ;[].slice.call(document.querySelectorAll('[class*="pct-avif-bg-"]')).forEach(function (el) {
        var $el = $(el)
        var fileName = $el
            .attr('class')
            .match(/pct-avif-bg-(.*)+/)[0]
            .split(' ')[0]
            .split('pct-avif-bg-')[1]
        var filePath = global.mediaURL + '/' + fileName + '.' + ($('html').hasClass('avif') ? 'avif' : 'jpg')

        $el.prepend('<div class="pct-bgimg"></div>')
        var $bg = $el.find('.pct-bgimg')
        $bg.css({
            'background-image': 'url(' + filePath + ')',
            'background-size': 'cover',
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
        })
    })

    /* //! Needed to use/include the smooth-scroll.min.js lib an initialize it, in order to work properly for iOS and Safari.*/
    window.scroll = new SmoothScroll('a[href*="#"]', {
        easing: 'easeOutCubic',
        speed: 600,
        speedAsDuration: true,
        header: '#ast-fixed-header',
    })

    /**
     //! google map disable on scroll
     */
    $('.external-map')
        .click(function () {
            $(this).find('iframe').addClass('clicked')
        })
        .mouseleave(function () {
            $(this).find('iframe').removeClass('clicked')
        })
})(jQuery)
