jQuery(function ($) {

    // place script here


    $('.reveal').click(function(){
    	var reveal = $(this).attr('href');
    	$(this).animate({'opacity':'0'}, 500, function(){
    		$(this).hide();
			$(reveal).css({'opacity':'0'}).show().animate({'opacity':'1'}, 500);
    	});
    	

    	return false;
    });
});     //jQuery