import { Car } from './mod/oreyClass'
import './mod/avif-webp'
import signature from 'console-signature'
;(function ($) {
    ;('use strict')

    /** Global vars defined by functions.php with 'wp_localize_script' @ script enqueue   **/
    var global = pct_globalVars

    /* let Micoche = new Car("Toyota", "RAV4");
  Micoche.ponMarcha("D");
  console.log(
    "Marcha: " +
      Micoche.userGear +
      " \nMarca: " +
      Micoche.marca +
      " \nModelo: " +
      Micoche.modelo
  );
 */
    /*------------------------------------------------------------------------------------------------------*\

							ONLOAD modified for v 3.x+

	\*------------------------------------------------------------------------------------------------------*/

    $(window).on('load', function () {})
    /**----------------------- END ONLOAD SECTION ----------------------------------------------------------*/

    /**
     *  AVIF BACKGROUND IMAGES BY CLASS SELECTOR
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

    /*------------------------------------------------------------------------------------------------------*
            SCROLLSPY: INTERSECTION OBSERVER FOR MENU active node status ==> add "active" class to li menu nodes
  \*------------------------------------------------------------------------------------------------------*/

    /* //! Needed to use/include the smooth-scroll.min.js lib an initialize it, in order to work properly for iOS and Safari.*/
    window.scroll = new SmoothScroll('a[href*="#"]', {
        easing: 'easeOutCubic',
        speed: 600,
        speedAsDuration: true,
        header: '#ast-fixed-header',
    })

    class hoverMenuManager {
        constructor(defNodesSelector, IoOptions) {
            this.markHashLinksonMenu(document.querySelectorAll('header li.current_page_item a[href*="#"]'))
            this.makePageNodeHashed() // avoid page reloading for node menu corresponding for currentpage (replace link href content with #)
            this.markupHover()
            this.currentlyIntArr = new Array()
            this.defNodes = document.querySelectorAll('header li.current_page_item a')
            this.setActiveNode(this.defNodes)
            this._iooptions = IoOptions || null
            this.observer = this.initObserver()
        }

        initObserver(queryToWatch, queryToTarget) {
            // queryToWatch => query selector for elements being watched
            // queryToTarget => query selector for elements being affected (menu nodes);

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    let id = entry.target.getAttribute('id')
                    let targetList = document.querySelectorAll(`header li.menu-item a[href*="#${id}"]`)
                    targetList = Array.from(targetList).length > 0 ? targetList : null
                    if (targetList) {
                        if (entry.isIntersecting && entry.intersectionRatio > 0) {
                            this.addIntersectedElement(entry.target)
                            this.setActiveNode(targetList)
                        } else {
                            this.removeIntersectedElement(entry.target)
                            if (this._activeNodes) {
                                //this.setActiveNode(this.defNodes);
                                this.setActiveNode()
                            }
                        }
                    }
                })
            }, this._iooptions)

            document.querySelectorAll('section[id]').forEach((section) => {
                observer.observe(section)
            })

            return observer
        }

        addIntersectedElement(el) {
            const seen = new Set()
            const arr = this.currentlyIntArr
            arr.push(el)
            const filteredArr = arr.filter((el) => {
                const duplicate = seen.has(el.id)
                seen.add(el.id)
                return !duplicate
            })

            this.currentlyIntArr = filteredArr
        }

        removeIntersectedElement(el) {
            const seen = new Set(this.currentlyIntArr)
            const arr = this.currentlyIntArr
            const elToRemove = el
            const filteredArr = this.currentlyIntArr.filter((el) => {
                return el.id != elToRemove.id
            })
            this.currentlyIntArr = filteredArr
        }

        markupHover() {
            document.querySelectorAll('header li.menu-item').forEach((node) => {
                node.addEventListener('mouseover', (event) => {
                    node.classList.add('hovered')
                })
                node.addEventListener('mouseout', (event) => {
                    node.classList.remove('hovered')
                })
                node.addEventListener('click', (event) => {
                    node.classList.remove('hovered')
                })
            })
        }

        getActiveNode() {
            // ! must review for returning an array in case multiple matchs
            return document.querySelectorAll('header li.active')[0] instanceof Element
                ? document.querySelectorAll('header li.active')[0]
                : null
        }

        setActiveNode(targetList) {
            this.removeActiveNode()

            if (targetList) {
                // element intersected screen, need to mark target menu nodes
                if (this.currentlyIntArr.length) {
                    // sections intersecting screen
                    let lastEntered = this.currentlyIntArr[this.currentlyIntArr.length - 1].id
                }
                targetList.forEach((n) => {
                    n.parentElement.classList.add('active')
                })
                this._activeNodes = targetList
            } else {
                // element out of intersection with screen, need to remove active class from target menu nodes and mark DEFAULT PAGE node
                if (this.currentlyIntArr.length) {
                    this.setActiveNode(
                        this.getMenuNodesFromSection(this.currentlyIntArr[this.currentlyIntArr.length - 1])
                    )
                } else {
                    this.setActiveNode(this.defNodes)
                }
            }
        }

        getMenuNodesFromSection(section) {
            let sectionID = section.id
            let targetList = document.querySelectorAll(`header li.menu-item a[href*="#${sectionID}"]`)
            targetList = Array.from(targetList).length > 0 ? targetList : null
            return targetList
        }

        removeActiveNode() {
            if (this._activeNodes) {
                this._activeNodes.forEach((n) => {
                    n.parentElement.classList.remove('active')
                })
            }
        }

        markHashLinksonMenu(nList) {
            nList.forEach((el) => {
                el.parentElement.classList.add('linkhashed')
                el.parentElement.classList.remove('current_page_item')
                el.parentElement.classList.remove('current-menu-item')
            })
        }

        makePageNodeHashed() {
            document.querySelectorAll('header li.current_page_item a').forEach((el) => {
                el.href = '#'
            })
        }
    }

    let mManager = new hoverMenuManager(null, {
        threshold: 0.2,
    })

    /*------------------------------------------------------------------------------------------------------*
              ASTRA THEME SPECIFIC FIXES (Mobile: Main and Sticky header won't collapse on scroll or after scroll)
  \*------------------------------------------------------------------------------------------------------*/
    document.onscroll = (e) => {
        collapseMobileMenu()
    }

    function collapseMobileMenu() {
        // check if mobile menu is opened
        let navOpened = document.querySelector('body.ast-header-break-point.ast-main-header-nav-open')
        if (navOpened) {
            window.requestAnimationFrame(() => {
                document.querySelectorAll('header .main-header-bar-navigation').forEach((e) => {
                    e.classList.remove('toggle-on')
                    e.style.display = 'none'
                })
                navOpened.classList.remove('ast-main-header-nav-open')
                document.querySelectorAll('header .ast-mobile-menu-buttons button.menu-toggle').forEach((e) => {
                    e.classList.remove('toggled')
                })
            })
        }

        return true
    }

    /*------------------------------------------------------------------------------------------------------*\

							CONTACT FORM 7 EVENTS

	\*------------------------------------------------------------------------------------------------------*/

    // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim

    if (!String.prototype.trim) {
        ;(function () {
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
            String.prototype.trim = function () {
                return this.replace(rtrim, '')
            }
        })()
    }

    // INPUT TYPE FILE --> SHOWING FILE NAME AFTER ATTACHMENT...

    ;[].slice.call(document.querySelectorAll('input[type="file"]')).forEach(function (inputEl) {
        var $input = $(inputEl)
        var $tgt_label = $('label[for="' + $input.attr('id') + '"]')
        var orig_text = $tgt_label.text()

        $tgt_label.parent().css({ position: 'relative' })

        $tgt_label.parent().append('<div class="bt_remove_file"></div>')

        var $btclear = $tgt_label.siblings('.bt_remove_file')

        $input.change(function () {
            var file = $input.val().split('\\').pop()

            if (file) {
                $tgt_label.addClass('file_ready')
                $tgt_label.text(file)
            } else {
                clearFile()
            }
        })

        $btclear.on('tap click', function (e) {
            clearFile()
        })

        function clearFile() {
            if ($input.val()) {
                //ya tiene archivo attacheado...
                $input.val('')
                $tgt_label.removeClass('file_ready')
                $tgt_label.text(orig_text)
            }
        }
    })

    /**   CLICK SUBMIT BUTTON  */
    ;[].slice.call(document.querySelectorAll('.wpcf7 .wpcf7-submit')).forEach(function (el) {
        const $el = $(el)
        const $tgt = $el.find('a')
        const modalContent = '#SAC'

        //addCloseButton_to_modal(modalContent);

        // add Close button to modal

        $el.on('click tap', function (e) {
            e.preventDefault()
            clearTimeout(window.fto)
            $('.ajax-loader').remove()
            var bt = $(this)

            if (bt.hasClass('active') || bt.hasClass('success')) {
                return false
            }

            bt.css('width', bt.outerWidth()) // fijamos el valor inicial de width para que en el css la animación "to:" funcione...

            bt.addClass('active')

            //detectamos final de animacion roundIt para mostrar icono animado...
            bt.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
                bt.find('i').addClass('showIcon')
            })

            window.fto = setTimeout(function () {
                let form = bt.closest('form')
                form.submit()
            }, 750)
        })
    })

    // EMAIL ENVIADO CORRECTAMENTE, REDIRIGIMOS A PÁGINA DE GRACIAS PARA EL FORMULARIO CON ID 3535 (comentado).
    document.addEventListener(
        'wpcf7mailsent',
        function (event) {
            const $form = $("[id^='wpcf7-f" + event.detail.contactFormId + "']")
            const btsubmit = $form.find('.wpcf7-submit')

            btsubmit.css({ display: 'none' })

            btsubmit.removeClass('active')
            btsubmit.find('i').removeClass('showIcon')
            //btsubmit.text("¡Gracias!@@@@@");
            //btsubmit.addClass("success animated pulse");
        },
        false
    )

    //ERROR DE VALIDACIÓN, ALGÚN CAMPO NO ES CORRECTO O ES OBLIGATORIO Y ESTÁ VACÍO

    document.addEventListener(
        'wpcf7invalid',
        function (event) {
            const $form = $("[id^='wpcf7-f" + event.detail.contactFormId + "']")
            const btsubmit = $form.find('.wpcf7-submit')

            btsubmit.removeClass('active')
            btsubmit.find('i').removeClass('showIcon')
            //btsubmit.text("Enviar de nuevo");
            //console.log("ERROR DE VALIDACION: " + event.detail.contactFormLocale);
        },
        false
    )

    // OK, PERO EL SERVIDOR NO HA PODIDO ENVIAR EL MAIL. PROBLEMA EN EL SERVIDOR SMTP¿?
    document.addEventListener(
        'wpcf7mailfailed',
        function (event) {
            const $form = $("[id^='wpcf7-f" + event.detail.contactFormId + "']")
            const btsubmit = $form.find('.wpcf7-submit')

            btsubmit.removeClass('active')
            btsubmit.find('i').removeClass('showIcon')

            btsubmit.text('Volver a enviar')
            /*console.log("NO SE HA PODIDO ENVIAR EL MAIL: " + event.detail.contactFormLocale);*/
        },
        false
    )

    // OK, PERO EL SERVIDOR NO HA PODIDO ENVIAR EL MAIL. PROBLEMA EN EL SERVIDOR SMTP¿?
    document.addEventListener(
        'wpcf7mailfailed',
        function (event) {
            const $form = $("[id^='wpcf7-f" + event.detail.contactFormId + "']")
            const btsubmit = $form.find('.wpcf7-submit')

            btsubmit.removeClass('active')
            btsubmit.find('i').removeClass('showIcon')

            btsubmit.text('Volver a enviar')
            //console.log("NO SE HA PODIDO ENVIAR EL MAIL: " + event.detail.contactFormLocale);
        },
        false
    )

    // ERROR, SPAM ACTIVITY
    document.addEventListener(
        'wpcf7spam',
        function (event) {
            const $form = $("[id^='wpcf7-f" + event.detail.contactFormId + "']")
            const btsubmit = $form.find('.wpcf7-submit')

            btsubmit.removeClass('active')
            btsubmit.find('i').removeClass('showIcon')

            //btsubmit.text("Volver a enviar");
            //console.log("SPAM ACTIVITY: " + event.detail.contactFormLocale);
        },
        false
    )

    // OK, PERO EL SERVIDOR NO HA PODIDO ENVIAR EL MAIL. PROBLEMA EN EL SERVIDOR SMTP¿?
    document.addEventListener(
        'wpcf7mailfailed',
        function (event) {
            const $form = $("[id^='wpcf7-f" + event.detail.contactFormId + "']")
            const btsubmit = $form.find('.wpcf7-submit')

            btsubmit.removeClass('active')
            btsubmit.find('i').removeClass('showIcon')

            btsubmit.text('Volver a enviar')
            //console.log("NO SE HA PODIDO ENVIAR EL MAIL: " + event.detail.contactFormLocale);
        },
        false
    )

    /*------------------------------------------------------------------------------------------------------*\

							CONTACT FORM 7 LEGAL CHECKBOX STYLED

	\*------------------------------------------------------------------------------------------------------*/

    var cId = 0 // to set an unique id for each checkbox...

    ;[].slice.call(document.querySelectorAll('.pct-legal-acceptance')).forEach(function (el) {
        var $legalEl = $(el)
        cId++
        var $check = $legalEl.find('input[type="checkbox"]')
        var $label = $legalEl.parent().parent().find('.pct-label-for-legal')

        //ocultamos el checkbox y su wrapper, incluyendo su pseudo-label
        //check.parent().css({'display': 'none'});

        $check.attr({ id: $label.attr('for') + cId })
        $check.after('<label for="' + $label.attr('for') + cId + '">' + $label.html() + '</label>')
        $check.css({ display: 'none' })

        //eliminamos los elementos innecesarios de CF7
        $label.remove()
        $legalEl.find($('.wpcf7-list-item-label')).remove()
    })

    /*------------------------------------------------------------------------------------------------------*\

								CONTACT FORM 7 PLACEHOLDER AS PERSISTENT LABEL (Google Material like)

	\*------------------------------------------------------------------------------------------------------*/
    ;[].slice.call(document.querySelectorAll('form.placeholder_as_label')).forEach(function (el) {
        const $form = $(el)

        $.each($form.find('[type="text"]:not([name*="ga_clientID"]), [type="email"], textarea'), function () {
            const $elem = $(this)
            const uid = $elem.attr('name') + '_' + Math.floor(Math.random() * 100 + 1)

            $elem.attr({ id: uid })

            $elem.addClass('placeholder-to-label')
            $elem
                .parent()
                .append('<label for="' + uid + '" class="persist-label">' + $elem.attr('placeholder') + '</label>')
            $elem.attr({ placeholder: '' })

            $elem.focus(function (e) {
                $(this).siblings('.persist-label').addClass('show-as-label')
            })

            $elem.blur(function (e) {
                if (!$(this).val()) {
                    $(this).siblings('.persist-label').removeClass('show-as-label')
                }
            })
        })
    })

    /*------------------------------------------------------------------------------------------------------*
                      CONTACT FORM 7 submit_on_email for NEWSLETTERS
  \*------------------------------------------------------------------------------------------------------*/
    ;[].slice.call(document.querySelectorAll('form.submit_on_email')).forEach(function (el) {
        let $form = $(el)
        let $bt_submit = $form.find('button,input[type="submit"]')

        //$bt_submit.append($form.find('[type = "email"]'));
        $form.find('[type = "email"]').parent().append($bt_submit)
        //console.log('clientID= ' + $form.find('input.gacid').attr('value'));
    })

    /*------------------------------------------------------------------------------------------------------*\

							CONTACT FORM 7 ADD CLIENT ID from ANALYTICS COOKIE as input hidden for user

	\*------------------------------------------------------------------------------------------------------*/
    ;[].slice.call(document.querySelectorAll('form.wpcf7-form')).forEach(function (el) {
        var $form = $(el)
        var gaClientID = document.cookie.indexOf('_ga=') > -1 ? get_GAclientID() : null

        if (gaClientID) {
            $form.find('input.gacid').attr({
                value: gaClientID,
            })
        }
        //console.log('clientID= ' + $form.find('input.gacid').attr('value'));
    })

    function get_GAclientID() {
        var gaCookie = document.cookie.split('_ga=')[1].split(';')[0].split('.')
        var clientID = gaCookie[2] + '.' + gaCookie[3]
        //console.log(clientID);
        return clientID
    }
})(jQuery)
