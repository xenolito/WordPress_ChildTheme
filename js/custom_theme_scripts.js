(function ($) {
  "use strict";

  /*------------------------------------------------------------------------------------------------------*\

							ONLOAD SECTION

	\*------------------------------------------------------------------------------------------------------*/

  $(window).on("load", function () {
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
    }, 10);

    console.log("position: " + $("#site-header").css("position"));
  });

  /**----------------------- END ONLOAD SECTION ----------------------------------------------------------*/

  /*------------------------------------------------------------------------------------------------------*\



	\*------------------------------------------------------------------------------------------------------*/

  $(".show_form").on("click tap", function (e) {
    e.preventDefault();
    const $bt = $(this);
    const $tgt = $("#" + $bt.attr("href").split("#")[1]);

    $bt.addClass("hided");

    $tgt.slideDown(300, function () {
      /*const $ipt = $($tgt.find('.wpcf7-form-control-wrap > input')[0]); // primer input de usuario del formulario
			$ipt.focus();*/
      $bt.slideUp(100);
    });
  });

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

  [].slice
    .call(document.querySelectorAll(".wpcf7 .wpcf7-submit"))
    .forEach(function (el) {
      const $el = $(el);
      const $tgt = $el.find("a");
      const modalContent = "#SAC";

      addCloseButton_to_modal(modalContent);

      // add Close button to modal

      $el.on("click tap submit", function (e) {
        $(".ajax-loader").remove();
        var bt = $(this);

        if (bt.hasClass("active") || bt.hasClass("success")) {
          return false;
        }

        bt.addClass("active");

        setTimeout(function () {
          bt.addClass("loader");
        }, 300);
      });
    });

  // EMAIL ENVIADO CORRECTAMENTE, REDIRIGIMOS A PÁGINA DE GRACIAS PARA EL FORMULARIO CON ID 3535 (comentado).
  document.addEventListener(
    "wpcf7mailsent",
    function (event) {
      const $form = $("[id^='wpcf7-f" + event.detail.contactFormId + "']");
      const btsubmit = $form.find(".wpcf7-submit");

      btsubmit.css({ display: "none" });

      console.log($form.attr("id"));

      btsubmit.removeClass("loader active");
      btsubmit.text("¡Gracias!@@@@@");
      btsubmit.addClass("success animated pulse");

      //if ( '3535' == event.detail.contactFormId ) {location = 'http://www.motorvillagemadrid.com/gracias';}
      //console.log('FORMULARIO ENVIADO: todo OK: From ID--> ' + event.detail.contactFormId);
    },
    false
  );

  // ERROR DE VALIDACIÓN, ALGÚN CAMPO NO ES CORRECTO O ES OBLIGATORIO Y ESTÁ VACÍO
  document.addEventListener(
    "wpcf7invalid",
    function (event) {
      const $form = $("[id^='wpcf7-f" + event.detail.contactFormId + "']");
      const btsubmit = $form.find(".wpcf7-submit");

      btsubmit.removeClass("loader active");
      btsubmit.text("Enviar de nuevo");
    },
    false
  );

  // OK, PERO EL SERVIDOR NO HA PODIDO ENVIAR EL MAIL. PROBLEMA EN EL SERVIDOR SMTP¿?
  document.addEventListener(
    "wpcf7mailfailed",
    function (event) {
      const $form = $("[id^='wpcf7-f" + event.detail.contactFormId + "']");
      const btsubmit = $form.find(".wpcf7-submit");

      btsubmit.removeClass("loader active");
      btsubmit.text("Volver a enviar");
      //console.log('NO SE HA PODIDO ENVIAR EL MAIL: ' + event.detail.contactFormLocale);
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

  /* SVG IE EDGE FIX FOR <text> transform (positioning) */
  [].slice
    .call(document.querySelectorAll("svg text"))
    .forEach(function (element) {
      const txt = $(element);
      if (
        txt.css("transform") &&
        txt.css("transform").indexOf("matrix") !== -1 &&
        !txt.attr("transform")
      ) {
        var newMatrix = txt
          .css("transform")
          .replace(/ /g, "")
          .replace(/,/g, " ");
        txt.attr({ transform: newMatrix });
      }
    });

  // replace links with this string "http://./"   for local base site URL
  [].slice
    .call(document.querySelectorAll('[href*="//./"]'))
    .forEach(function (inputEl) {
      var $el = $(inputEl);
      var homeURL = globalObject.homeURL; // via wp_localize_script on functions.php

      $el.attr("href", homeURL + $el.attr("href").replace("http://./", "/"));

      if ($el.attr("onclick")) {
        var href = $el.attr("onclick");
        if (href.indexOf("//***") > -1) {
          $el.attr(
            "onclick",
            "window.location='" + homeURL + href.replace(/^.*\/\/[^\/]+/, "")
          );
        }
      }
    });
})(jQuery);
