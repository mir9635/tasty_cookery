// WINDOW WIDTH DETECT
let currentWidth = $(window).width();
$(window).resize(function () {
  currentWidth = $(window).width();
});

const Application = {
  init: function init() {
    this.events();
  },
  events: function events() {
    this.eventList.scrollToElement();
    this.eventList.responceOwls();
    this.eventList.validation();
  },
  eventList: {
    responceOwls: function responceOwls() {

      $('.js-owl-mobile').each(function () {
        var $mobileOwl = $(this),
            $margin = Number($(this).attr('data-margin'));
        responceOwl($mobileOwl, 767, $margin);
        $(window).resize(function () {
          responceOwl($mobileOwl, 767, $margin);
        });
      });

      function responceOwl($mobileOwl, $screenWidth, $margin) {
        if (currentWidth > $screenWidth) {
          $mobileOwl.removeClass('owl-carousel').removeClass('owl-theme');
          $mobileOwl.trigger('destroy.owl.carousel');
        } else {
          $mobileOwl.addClass('owl-carousel').addClass('owl-theme');
          $mobileOwl.owlCarousel({
            loop: false,
            navText: ['<span></span>', '<span></span>'],
            nav: false,
            dots: true,
            margin: $margin,
            items: 1,
            autoWidth: false,
            autoHeight: true
          });
          $mobileOwl.trigger('init.owl.carousel');
        }
      }
    },
    scrollToElement: function scrollToElement() {
      $('.js-scroll').on('click', function () {
        let block = $(this).attr('data-to');
        $('html, body').animate({
          scrollTop: $('.' + block).offset().top
        }, 1400, 'swing');
      });
    },
    validation: function mask() {
      let pattern = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
      let mail = $('#email');
      mail.on('input',function(){
        if(mail.val() != ''){

          if(mail.val().search(pattern) == 0){
            mail.removeClass('error');
            $('#valid').text('');
            $('#submit').attr('disabled', false).removeClass('disabled');
          }else{
            mail.addClass('error');
            $('#valid').text('Не подходит');
            $('#submit').attr('disabled', true).addClass('disabled');
          }

        }else{
          $('#valid').text('Поле e-mail не должно быть пустым!');
          mail.addClass('error');
          $('#submit').attr('disabled', true).addClass('disabled');
        }
      });
    }
  }
};
$(function () {
  'use strict';

  Application.init();
});