(function($) {
	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_UK/all.js', function() {
		FB.init({
			appId      : '729058967147863', // test app
			//appId      : '729058753814551', // live app
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


		function fbMe() {
			var deferred = $.Deferred();
			FB.api(
				"/me",
				"GET",
				{},
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



		$(".js-login").on('click', function() {

			authFacebook().then(function() {
				window.location.href = "entry.html";
			});

			return false;
		});

		$(".js-play").on('click', function() {

			localStorage.setItem("lovedOneName", $("#loved-one-name").val());
			localStorage.setItem("lovedOnePhone", $("#loved-one-phone").val());

			window.location.href = "game.html";	

			return false;
		});

		var $yourName = $(".js-your-name");
		if ($yourName.length) {
			authFacebook().then(function (argument) {
				fbMe().then(function(me) {
					$yourName.text(me.first_name);
				});
			});
		}

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
		    		var punishment = $('.spinner-item.active').data('punishment');
	    			if (punishment === "phone") {
	    				endSpin();
	    			} else if (punishment === "written") {
	    				authFacebook().then(function() {
	    					fbPostToWall("me", "this is the message").then(function() {
		    					endSpin();
	    					});
	    				});
	    				
	    			} else if (punishment === "photo") {
	    				endSpin();
	    			} else if (punishment === "none") {
	    				endSpin();
	    			}

		    		$('.spinner-item.active').addClass('chosen');
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

	});
})(jQuery);

