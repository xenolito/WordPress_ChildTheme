import Swiper from 'swiper'
import SwiperCore, { Pagination, Autoplay, EffectFade } from 'swiper/core'
import './mod/avif-webp'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import signature from 'console-signature'
import './mod/contactForm7'
import './mod/mapa_asociados'
;(function ($) {
    ;('use strict')

    /** Global vars defined by functions.php with 'wp_localize_script' @ script enqueue   **/
    var global = pct_globalVars
    signature()

    const winDim = () => {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        }
    }

    /*------------------------------------------------------------------------------------------------------*\

							ONLOAD modified for v 3++

	\*------------------------------------------------------------------------------------------------------*/

    // $(window).on('load', function () {})
    window.addEventListener('load', function (event) {
        // console.log('page loaded')
        this.document.querySelector('#main-content').classList.add('pageloaded')
    })
    /**----------------------- END ONLOAD SECTION ----------------------------------------------------------*/

    /*------------------------------------------------------------------------------------------------------*
                            PARALLAX
    \*------------------------------------------------------------------------------------------------------*/
    gsap.registerPlugin(ScrollTrigger)

    if (document.querySelector('.pct-parallax')) {
        // Set any <figure> tag with class '.pct-is-background' as background-image of its parent width class '.pct-parallax-bg'
        document.querySelectorAll('.pct-parallax').forEach((el) => {
            const imgEl = el.querySelector('.pct-is-background img')
            const imgSrc = imgEl.getAttribute('src')
            imgEl.parentElement.style.cssText += 'display:none;'
            el.style.cssText += `background-image:url(${imgSrc});background-position: center center; background-repeat:no-repeat; background-size: cover `
        })

        const enteredViewport = () => {
            // console.log('triggered!!')
        }

        //! Genearl parallaxed elements
        const parall1 = gsap.timeline({
            scrollTrigger: {
                trigger: '.pct-parallax',
                start: 'center center',
                end: 'center +=100',
                scrub: true,
                onEnter: enteredViewport,
            },
        })

        gsap.utils.toArray('.pct-parallax .is-parallax').forEach((layer) => {
            const depth = layer.dataset.depth
            const movement = layer.offsetHeight * depth
            parall1.to(
                layer,
                {
                    y: movement,
                    opacity: 0,
                    ease: 'none',
                },
                0
            )
        })

        //! Parallax background
        gsap.utils.toArray('.pct-parallax').forEach((container) => {
            const movement = -(container.offsetHeight * 0.7)

            gsap.to(container, {
                backgroundPositionY: movement + 'px',
                ease: 'none',
                scrollTrigger: {
                    trigger: container,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            })
        })
    }

    //! SWIPER with parallax: ej. Pág Ficha Asociados
    const updatingST = (el) => {
        // console.log(el.trigger.offsetHeight)
    }

    if (document.querySelectorAll('.pct-header-slider').length) {
        // console.log('hay slider de cabecera de página')

        gsap.utils.toArray('.pct-header-slider').forEach((container) => {
            gsap.to(container, {
                y: parseInt(container.offsetHeight * 0.3),
                // y: container.offsetHeight * 0.3,
                ease: 'none',
                scrollTrigger: {
                    trigger: container,
                    start:
                        winDim().width < 980
                            ? 'top ' + document.querySelector('#ast-mobile-header').offsetHeight
                            : 'top top', // document.querySelector('#ast-mobile-header').offsetHeight ---> for mobile
                    end: 'bottom top',
                    scrub: true,
                    // onUpdate: updatingST,
                },
            })
        })
    }

    // //! SWIPER with parallax: ej. Pág Ficha Asociados
    // if (document.querySelectorAll('.pct-header-slider, [class*="nextend-smartslider3"] > div').length) {
    //     console.log('hay slider de cabecera de página')

    //     gsap.utils.toArray('.pct-header-slider, [class*="nextend-smartslider3"] > div').forEach((container) => {
    //         gsap.to(container, {
    //             y: container.offsetHeight * 0.3,
    //             ease: 'none',
    //             scrollTrigger: {
    //                 trigger: container,
    //                 start:
    //                     winDim().width < 980
    //                         ? 'top ' + document.querySelector('#ast-mobile-header').offsetHeight
    //                         : 'top top', // document.querySelector('#ast-mobile-header').offsetHeight ---> for mobile
    //                 end: 'bottom top',
    //                 scrub: true,
    //             },
    //         })
    //     })
    // }

    /*------------------------------------------------------------------------------------------------------*
                            ! Swiper sliders
    \*------------------------------------------------------------------------------------------------------*/
    // SwiperCore.use([Navigation, Pagination, Autoplay])
    SwiperCore.use([Pagination, Autoplay, EffectFade])

    const swiper = new Swiper('.slider-logos', {
        loop: true,
        slidesPerView: 2,
        spaceBetween: 10,
        centeredSlides: true,
        preventClicks: true,
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

    if (document.querySelectorAll('.pct-header-slider').length) {
        // console.log('hay header slider')
        const headerSwiper = new Swiper('.pct-header-slider', {
            loop: true,
            effect: 'fade',
            // slidesPerView: 1,
            spaceBetween: 0,
            // centeredSlides: true,
            preventClicks: false,
            autoplay: {
                delay: 3000,
                pauseOnMouseEnter: false,
                disableOnInteraction: false,
            },
            speed: 2000,
        })
    }

    /**
     * Customize language switcher
     */

    const switcherContDom = document.querySelectorAll(
        '.site-header-primary-section-right #polylang-3, #ast-mobile-header #polylang-3'
    )
    const menuLangSwitcherDom = document.querySelectorAll(
        '.site-header-primary-section-right #polylang-3 nav ul li a, #ast-mobile-header #polylang-3 nav ul li a'
    )

    menuLangSwitcherDom.forEach((el) => {
        switch (el.getAttribute('hreflang')) {
            case 'es-ES':
                el.setAttribute('title', 'Español')
                break

            case 'en-GB':
                el.setAttribute('title', 'English')
                break
        }
    })

    menuLangSwitcherDom.forEach((el) => {
        el.text = el.text.substring(0, 2)
    })

    switcherContDom.forEach((el) => {
        el.classList.add('enabled')
    })

    // switcherContDom.classList.add('enabled')

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

    // astra mobile menu icon
    const mtoggleReplace = (target) => {
        const el = document.querySelector(target)
        const newContent = document.createElement('figure')
        newContent.classList.add('mobile-menu-icon')
        newContent.innerHTML = '<span>&nbsp;</span>' + '<span>&nbsp;</span>' + '<span>&nbsp;</span>'

        el.parentNode.replaceChild(newContent, el)
    }

    mtoggleReplace('.mobile-menu-toggle-icon')

    // Google Map ASOCIADOS
})(jQuery)
