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

})(jQuery);

