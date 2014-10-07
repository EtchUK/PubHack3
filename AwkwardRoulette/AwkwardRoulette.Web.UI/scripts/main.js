(function($) {
	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_UK/all.js', function() {
		FB.init({
			appId      : '729058967147863', // test app
			//appId      : '729058753814551', // live app
		});




	});


	$(".js-play").on('click', function() {

		authFacebook().then(function() {
			fbPostToWall("me", "Hi").then(function(response) {
				console.log("posted to your timeline");
			});
		});

		return false;
	});

	function authFacebook() {
		var deferred = $.Deferred();

		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				deferred.resolve();
			}
			else {
				FB.login(function() {
					deferred.resolve();
				}, { scope: 'publish_actions' });

			}
		});

		return deferred;
	}

	function authTwitter() {
		
	}

	function twitterPost() {

	}


	function fbPostToWall(userId, message) {
		var deferred = $.Deferred();
		FB.api(
			"/" + userId + "/feed",
			"POST",
			{
				"message": message
			},
			function (response) {
				if (response && !response.error) {
					deferred.resolve(response);
				} else if (response.error) {
					deferred.reject(response.error);
				}
			}
		);

		return deferred;
	}

	
	
    $('.reveal').click(function(){
    	var reveal = $(this).attr('href');
    	$(this).animate({'opacity':'0'}, 500, function(){
    		$(this).hide();
			$(reveal).css({'opacity':'0'}).show().animate({'opacity':'1'}, 500);
    	});
    	

    	return false;
    });

    var spinning = false;
	var countdown = 0;
	var speed = 0;
    $('.start-spinner').click(function(){
    	if(spinning){

    	} else {
    		spinning = true;
    		$('.result').text('');
    		$('.spinner-item').removeClass('chosen').removeClass('active');
    		speed = 0;
    		$(this).text('Wait...');
    		countdown = Math.floor((Math.random() * 20) + 10);
    		nextItem();
    	}

    	return false;
    });

    function nextItem(){
    	setTimeout(function(){
    		if($('.spinner-item.active').length && $('.spinner-item.active').next('.spinner-item').length){
    			$('.spinner-item.active').removeClass('active').next().addClass('active');
    		} else {
    			$('.spinner-item.active').removeClass('active');
    			$('.spinner-item').first().addClass('active');
    		}
    		countdown = countdown - 1;
	    	if(countdown > 0){
	    		nextItem();
	    	} else {
	    		//Over - This is where we stop, so do stuff.
	    		$('.spinner-item.active').addClass('chosen');
	    		console.log($('.spinner-item.active').data('punishment'));
	    		endSpin();
	    	}
    	}, speed);
    	speed = speed + 25;   	
    }

    function endSpin(){
	    spinning = false;
		$('.start-spinner').text('Play');
		var text = $('.chosen').data('desc');
		$('.result').text(text);
    }

})(jQuery);

