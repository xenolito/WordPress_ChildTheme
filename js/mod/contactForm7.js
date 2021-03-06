;(function ($) {
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
            }, 500)
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
            console.log('ENVIADO CORRECTAMENTE: ' + event.detail.contactFormLocale)
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
            console.log('ERROR DE VALIDACION: ' + event.detail.contactFormLocale)
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
            console.log('NO SE HA PODIDO ENVIAR EL MAIL: ' + event.detail.contactFormLocale)
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
            console.log('SPAM ACTIVITY: ' + event.detail.contactFormLocale)
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

    var cId = 1 // to set an unique id for each checkbox...

    ;[].slice.call(document.querySelectorAll('.pct-legal-acceptance')).forEach(function (el) {
        var $legalEl = $(el)
        cId++
        var $check = $legalEl.find('input[type="checkbox"]')
        var $label = $legalEl.parent().parent().find('.pct-label-for-legal')
        //ocultamos el checkbox y su wrapper, incluyendo su pseudo-label
        //check.parent().css({'display': 'none'});

        $check.attr({ id: $label.attr('for') + cId.toString() })
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
})(jQuery)
