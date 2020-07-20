(function ($) {
  ("use strict");

  /*------------------------------------------------------------------------------------------------------*\

							ONLOAD

	\*------------------------------------------------------------------------------------------------------*/

  $(window).on("load", function () {
    $("html").addClass("pct-ready");
    $("#xen-loader").addClass("removed");

    /*
    $("#site-header").css("display", "none!important");

    $("#site-header").attr("style", "position: relative !important;");
    */

    $("#site-header-sticky-wrapper:not(.is-sticky) #site-header").css(
      "position",
      "relative"
    );
    $("#site-header").css("display", "block");

    setTimeout(function () {
      $("#site-header").css("opacity", "1");
    }, 1);

    /**   FLIP CARDS    */
    [].slice
      .call(document.querySelectorAll(".pct-recurso-tile"))
      .forEach(function (el) {
        let $el = $(el);
        let $card = $el.find("flip-card");
        let $bt = $el.find(".card-content .button");
        let $close = $el.find(".pct-close-flipped a");

        $bt.on("tap click", function (e) {
          e.preventDefault();
          $el.addClass("is-flipped");

          $el
            .find(".flip-card")
            .one(
              "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
              function (e) {
                setTimeout(function () {
                  $el.find(".wpcf7").addClass("showing");
                  //$el.find(".wpcf7").css("display", "flex");
                }, 10);
              }
            );
          $el.find('form [type="email"]').focus();
        });

        $close.on("tap click", function (e) {
          e.preventDefault();
          $el.removeClass("is-flipped");
          $el.find(".flip-card-back").css("backface-visibility", "hidden");
          $el.find(".wpcf7").removeClass("showing");
        });

        //console.log($el.attr("class"));
      });

    /*    let card = document.querySelector(".flip-card");
    card.addEventListener("click", function () {
      card.classList.toggle("is-flipped");
    });*/
  });

  /**----------------------- END ONLOAD SECTION ----------------------------------------------------------*/

  /*------------------------------------------------------------------------------------------------------*
              LEARNDASH GRID ADDON FIXES
  \*------------------------------------------------------------------------------------------------------*/
  if ($("#ld_course_list")) {
    [].slice
      .call(document.querySelectorAll(".ld_course_grid article"))
      .forEach(function (el) {
        let $el = $(el);
        let $tgt = $el.find("a[rel=bookmark]").first();
        let $obj = $el.find(".caption h3");

        $tgt.append($obj);

        //console.log($tgt.html());
      });
  }

  /*------------------------------------------------------------------------------------------------------*
              LEARNDASH 3.2 BUGFIX: COURSE CLOSED STILL SHOWING BUTTON TO "enroll now",
              including with shortcode [learndash_payment_buttons]
  \*------------------------------------------------------------------------------------------------------*/
  if ($("body.sfwd-courses-template")) {
    [].slice
      .call(document.querySelectorAll("#btn-join"))
      .forEach(function (el) {
        let $el = $(el);
        let url = new URL(window.location);
        let host = url.host;
        let btLink = $el.attr("href").split("//")[1]; // eliminamos el protocolo para poder comparar con host

        /*
        console.log("Host url: " + url.host);
        console.log("LINK url: " + btLink);
        console.log("bt parent class = " + $el.parent().attr("class"));
        */
        if (host === btLink) {
          if ($el.parent().attr("class") == "ld-course-status-action") {
            $el.replaceWith(
              "<span>Este curso está cerrado temporalmente.</span>"
            );
          } else {
            $el.css("display", "none");
          }
        }
      });

    function getLastDirname(url) {
      let pathsplitted = url.split("/");
      return pathsplitted[pathsplitted.length - 2];
    }

    function getHostName(url) {
      let pathsplitted = url.split("/");
      return pathsplitted[pathsplitted.length - 2];
    }
  }

  /*------------------------------------------------------------------------------------------------------*
              FICHA DE PRODUCTO PARA CURSOS ONLINE (COLOCANDO TÍTULO SOBRE IMAGEN)
  \*------------------------------------------------------------------------------------------------------*/

  if ($("body.single-product")) {
    //console.log("FICHA DE PRODUCTO");
    let $tgt = $(
      ".woocommerce-product-gallery .woocommerce-product-gallery__wrapper"
    );
    let $tit = $("h1.product_title");

    $tgt.append($tit);

    /*
    [].slice
      .call(document.querySelectorAll(".woocommerce-product-gallery"))
      .forEach(function (el) {
        let $el = $(el);
        let $tgt = $el.find("a[rel=bookmark]").first();
        let $obj = $el.find(".caption h3");

        $tgt.append($obj);

        //console.log($tgt.html());
      });
      */
  }

  /*------------------------------------------------------------------------------------------------------*
              LEARNDASH COURSE PAGE: FIX LEARNDASH COURSE HEADER NOT SHOWING BG IMAGE --> BUILD HEADER WITH ELEMENTOR: Need to flip ld-course-status into elementor content
  \*------------------------------------------------------------------------------------------------------*/
  /*  Movemos el "course status dentro del contenido del template de elementor"  */
  if ($("body.sfwd-courses-template")) {
    //$(".ld-course-status").prepend($(".ld-tab-content > .elementor"));
    let selector =
      ".ld-tab-content > [data-elementor-type=wp-post] > .elementor-inner > .elementor-section-wrap > section:nth-of-type(2)";

    if ($(selector)) {
      $(selector).prepend($(".ld-course-status"));
    }

    /* Movemos seccion CTA si existe ANTES de el "Contenido del curso"  */
    if ($("section.pct-bg-cta-a").length) {
      $(".pct-ld-course-desc > .elementor-column-wrap > div").append(
        $(".ld-item-list")
      );
      //$("#main > .learndash").prepend($("section.pct-bg-cta-a"));
    }
  }

  [].slice
    .call(
      document.querySelectorAll(
        "pct-footer-cta .button, .oew-call-to-action .button"
      )
    )
    .forEach(function (el) {
      let $el = $(el);
      $el.addClass("elementor-animation-grow");
      //console.log($el.attr("class"));
    });

  /*------------------------------------------------------------------------------------------------------*
              SECCIONES: GENERACIÓN DE BORDES PERSONALIZADOS SUPERIOR E INFERIOR
  \*------------------------------------------------------------------------------------------------------*/
  /*
  [].slice
    .call(document.querySelectorAll('[class*="section-border"]'))
    .forEach(function (el) {
      let $section = $(el);

      let bgcolor = $section.css("background-color")
        ? $section.css("background-color")
        : "#fff";
      let vwBreakMobile = 479; // vw below which we make the top&bottom height smaller...
      let vw = window.innerWidth;
      let svgH = vw > vwBreakMobile ? 70 : 35;

      let border;

/
      if ($section.hasClass("section-border-top-buz-dcha")) {
        //let svgH = 70;
        border = {
          borderPos: "top",
          svgH: svgH,
          svgData: `<polygon points="0,0 1000,${svgH} 0,${svgH}" style="fill:${bgcolor};stroke-width:0" />`,
        };
        let $border = $section
          .prepend(applySVG(border))
          .find('[class*="pct-section-' + border.borderPos + '"]');

        $border.css("top", 0);
        $border.css("margin-top", -svgH + "px");
      }

      if ($section.hasClass("section-border-bottom-buz-izq")) {
        //let svgH = 70;
        border = {
          borderPos: "bottom",
          svgH: svgH,
          svgData: `<polygon points="0,0 1000,0 0,${svgH}" style="fill:${bgcolor};stroke-width:0" />`,
        };
        let $border = $section
          .prepend(applySVG(border))
          .find('[class*="pct-section-' + border.borderPos + '"]');

        $border.css("bottom", 0);
        $border.css("margin-bottom", -svgH + "px");
      }

      function applySVG(borderDef) {
        let borderPos = borderDef.borderPos; // string top|bottom
        let svgH = borderDef.svgH ? borderDef.svgH : 70;
        let svgData = borderDef.svgData; // svg poligon, paths, etc. => svg content.
        return `<div class="pct-section-${borderPos}-border"><svg viewBox="0 0 1000 ${svgH}" preserveAspectRatio="none" width="100%" height="${svgH}">${svgData}</svg></div>`;
      }
    });
*/
  /*------------------------------------------------------------------------------------------------------*\

							CONTACT FORM 7 EVENTS

	\*------------------------------------------------------------------------------------------------------*/

  // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim

  if (!String.prototype.trim) {
    (function () {
      // Make sure we trim BOM and NBSP
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      String.prototype.trim = function () {
        return this.replace(rtrim, "");
      };
    })();
  }

  // INPUT TYPE FILE --> SHOWING FILE NAME AFTER ATTACHMENT...

  [].slice
    .call(document.querySelectorAll('input[type="file"]'))
    .forEach(function (inputEl) {
      var $input = $(inputEl);
      var $tgt_label = $('label[for="' + $input.attr("id") + '"]');
      var orig_text = $tgt_label.text();

      $tgt_label.parent().css({ position: "relative" });

      $tgt_label.parent().append('<div class="bt_remove_file"></div>');

      var $btclear = $tgt_label.siblings(".bt_remove_file");

      $input.change(function () {
        var file = $input.val().split("\\").pop();

        if (file) {
          $tgt_label.addClass("file_ready");
          $tgt_label.text(file);
        } else {
          clearFile();
        }
      });

      $btclear.on("tap click", function (e) {
        clearFile();
      });

      function clearFile() {
        if ($input.val()) {
          //ya tiene archivo attacheado...
          $input.val("");
          $tgt_label.removeClass("file_ready");
          $tgt_label.text(orig_text);
        }
      }
    });

  /**   CLICK SUBMIT BUTTON  */
  [].slice
    .call(document.querySelectorAll(".wpcf7 .wpcf7-submit"))
    .forEach(function (el) {
      const $el = $(el);
      const $tgt = $el.find("a");
      const modalContent = "#SAC";

      //addCloseButton_to_modal(modalContent);

      // add Close button to modal

      $el.on("click tap", function (e) {
        e.preventDefault();
        clearTimeout(window.fto);
        $(".ajax-loader").remove();
        var bt = $(this);

        if (bt.hasClass("active") || bt.hasClass("success")) {
          return false;
        }

        bt.css("width", bt.outerWidth()); // fijamos el valor inicial de width para que en el css la animación "to:" funcione...

        bt.addClass("active");

        //detectamos final de animacion roundIt para mostrar icono animado...
        bt.one(
          "webkitAnimationEnd oanimationend msAnimationEnd animationend",
          function (e) {
            bt.find("i").addClass("showIcon");
          }
        );

        window.fto = setTimeout(function () {
          let form = bt.closest("form");
          form.submit();
        }, 500);
      });
    });

  // EMAIL ENVIADO CORRECTAMENTE, REDIRIGIMOS A PÁGINA DE GRACIAS PARA EL FORMULARIO CON ID 3535 (comentado).
  document.addEventListener(
    "wpcf7mailsent",
    function (event) {
      const $form = $("[id^='wpcf7-f" + event.detail.contactFormId + "']");
      const btsubmit = $form.find(".wpcf7-submit");

      btsubmit.css({ display: "none" });

      btsubmit.removeClass("active");
      btsubmit.find("i").removeClass("showIcon");
      //btsubmit.text("¡Gracias!@@@@@");
      //btsubmit.addClass("success animated pulse");
    },
    false
  );

  //ERROR DE VALIDACIÓN, ALGÚN CAMPO NO ES CORRECTO O ES OBLIGATORIO Y ESTÁ VACÍO

  document.addEventListener(
    "wpcf7invalid",
    function (event) {
      const $form = $("[id^='wpcf7-f" + event.detail.contactFormId + "']");
      const btsubmit = $form.find(".wpcf7-submit");

      btsubmit.removeClass("active");
      btsubmit.find("i").removeClass("showIcon");
      //btsubmit.text("Enviar de nuevo");
      console.log("ERROR DE VALIDACION: " + event.detail.contactFormLocale);
    },
    false
  );

  // OK, PERO EL SERVIDOR NO HA PODIDO ENVIAR EL MAIL. PROBLEMA EN EL SERVIDOR SMTP¿?
  document.addEventListener(
    "wpcf7mailfailed",
    function (event) {
      const $form = $("[id^='wpcf7-f" + event.detail.contactFormId + "']");
      const btsubmit = $form.find(".wpcf7-submit");

      btsubmit.removeClass("active");
      btsubmit.find("i").removeClass("showIcon");

      btsubmit.text("Volver a enviar");
      console.log(
        "NO SE HA PODIDO ENVIAR EL MAIL: " + event.detail.contactFormLocale
      );
    },
    false
  );

  // OK, PERO EL SERVIDOR NO HA PODIDO ENVIAR EL MAIL. PROBLEMA EN EL SERVIDOR SMTP¿?
  document.addEventListener(
    "wpcf7mailfailed",
    function (event) {
      const $form = $("[id^='wpcf7-f" + event.detail.contactFormId + "']");
      const btsubmit = $form.find(".wpcf7-submit");

      btsubmit.removeClass("active");
      btsubmit.find("i").removeClass("showIcon");

      btsubmit.text("Volver a enviar");
      //console.log("NO SE HA PODIDO ENVIAR EL MAIL: " + event.detail.contactFormLocale);
    },
    false
  );

  // ERROR, SPAM ACTIVITY
  document.addEventListener(
    "wpcf7spam",
    function (event) {
      const $form = $("[id^='wpcf7-f" + event.detail.contactFormId + "']");
      const btsubmit = $form.find(".wpcf7-submit");

      btsubmit.removeClass("active");
      btsubmit.find("i").removeClass("showIcon");

      //btsubmit.text("Volver a enviar");
      console.log("SPAM ACTIVITY: " + event.detail.contactFormLocale);
    },
    false
  );

  // OK, PERO EL SERVIDOR NO HA PODIDO ENVIAR EL MAIL. PROBLEMA EN EL SERVIDOR SMTP¿?
  document.addEventListener(
    "wpcf7mailfailed",
    function (event) {
      const $form = $("[id^='wpcf7-f" + event.detail.contactFormId + "']");
      const btsubmit = $form.find(".wpcf7-submit");

      btsubmit.removeClass("active");
      btsubmit.find("i").removeClass("showIcon");

      btsubmit.text("Volver a enviar");
      //console.log("NO SE HA PODIDO ENVIAR EL MAIL: " + event.detail.contactFormLocale);
    },
    false
  );

  /*------------------------------------------------------------------------------------------------------*\

							CONTACT FORM 7 LEGAL CHECKBOX STYLED

	\*------------------------------------------------------------------------------------------------------*/

  var cId = 0; // to set an unique id for each checkbox...

  [].slice
    .call(document.querySelectorAll(".pct-legal-acceptance"))
    .forEach(function (el) {
      var $legalEl = $(el);
      cId++;
      var $check = $legalEl.find('input[type="checkbox"]');
      var $label = $legalEl.parent().parent().find(".pct-label-for-legal");

      //ocultamos el checkbox y su wrapper, incluyendo su pseudo-label
      //check.parent().css({'display': 'none'});

      $check.attr({ id: $label.attr("for") + cId });
      $check.after(
        '<label for="' +
          $label.attr("for") +
          cId +
          '">' +
          $label.html() +
          "</label>"
      );
      $check.css({ display: "none" });

      //eliminamos los elementos innecesarios de CF7
      $label.remove();
      $legalEl.find($(".wpcf7-list-item-label")).remove();
    });

  /*------------------------------------------------------------------------------------------------------*\

								CONTACT FORM 7 PLACEHOLDER AS PERSISTENT LABEL (Google Material like)

	\*------------------------------------------------------------------------------------------------------*/
  [].slice
    .call(document.querySelectorAll("form.placeholder_as_label"))
    .forEach(function (el) {
      const $form = $(el);

      $.each(
        $form.find(
          '[type="text"]:not([name*="ga_clientID"]), [type="email"], textarea'
        ),
        function () {
          const $elem = $(this);
          const uid =
            $elem.attr("name") + "_" + Math.floor(Math.random() * 100 + 1);

          $elem.attr({ id: uid });

          $elem.addClass("placeholder-to-label");
          $elem
            .parent()
            .append(
              '<label for="' +
                uid +
                '" class="persist-label">' +
                $elem.attr("placeholder") +
                "</label>"
            );
          $elem.attr({ placeholder: "" });

          $elem.focus(function (e) {
            $(this).siblings(".persist-label").addClass("show-as-label");
          });

          $elem.blur(function (e) {
            if (!$(this).val()) {
              $(this).siblings(".persist-label").removeClass("show-as-label");
            }
          });
        }
      );
    });

  /*------------------------------------------------------------------------------------------------------*
                      CONTACT FORM 7 submit_on_email for NEWSLETTERS
  \*------------------------------------------------------------------------------------------------------*/
  [].slice
    .call(document.querySelectorAll("form.submit_on_email"))
    .forEach(function (el) {
      let $form = $(el);
      let $bt_submit = $form.find('button,input[type="submit"]');

      //$bt_submit.append($form.find('[type = "email"]'));
      $form.find('[type = "email"]').parent().append($bt_submit);
      //console.log('clientID= ' + $form.find('input.gacid').attr('value'));
    });

  /*------------------------------------------------------------------------------------------------------*\

							CONTACT FORM 7 ADD CLIENT ID from ANALYTICS COOKIE as input hidden for user

	\*------------------------------------------------------------------------------------------------------*/

  [].slice
    .call(document.querySelectorAll("form.wpcf7-form"))
    .forEach(function (el) {
      var $form = $(el);
      var gaClientID =
        document.cookie.indexOf("_ga=") > -1 ? get_GAclientID() : null;

      if (gaClientID) {
        $form.find("input.gacid").attr({
          value: gaClientID,
        });
      }
      //console.log('clientID= ' + $form.find('input.gacid').attr('value'));
    });

  function get_GAclientID() {
    var gaCookie = document.cookie.split("_ga=")[1].split(";")[0].split(".");
    var clientID = gaCookie[2] + "." + gaCookie[3];
    //console.log(clientID);
    return clientID;
  }
})(jQuery);
