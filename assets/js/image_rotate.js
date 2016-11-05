$(document).ready(function () {

  var images = ['um_psu_stack.jpg', 'stmifb.jpg', 'seafb.jpg', 'pudfb.jpg', 'gibrfb.jpg', 'bepafb.jpg'];
  $('.signin-page').css({'background-image': 'url(images/' + images[Math.floor(Math.random() * images.length)] + ')'});

});
