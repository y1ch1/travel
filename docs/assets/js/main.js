jQuery(document).ready(function( $ ){

$('.go-to-top').each(function(){
  $(this).click(function(){
    $('html,body').animate({ scrollTop: 0 }, 'slow');
    return false; 
  });
});

});
