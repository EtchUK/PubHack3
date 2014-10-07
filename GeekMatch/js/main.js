(function($) {
	function fbEnsureInit(callback) {
		if(!window.fbInitDone) {
			setTimeout(function() { fbEnsureInit(callback); }, 50);
		} else {
			if(callback) {
				callback();
			}
		}
	}

	fbEnsureInit(function() {
		load(jQuery, FB);
	});
})(jQuery);


function load($, FB) {

	$(".js-login").on('click', function() {
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				console.log('Logged in.');
				window.location.href = 'matches.html';
			}
			else {
				FB.login(function() {
					FB.api('/me/feed', 'post', { message: 'Hello, world!' });
					window.location.href = 'matches.html';

				}, {scope: 'publish_actions'});

			}
		});
		return false;
	});

	$(".js-logout").on('click', function() {

		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				FB.logout(function(response) {
					
				});
			}
		});
		return false;
	});

	var terms = ["Star Trek", "Science", "Shakespeare", "Doctor Who", "Dinosaur", "Space", "Comic", "Star Wars"]
	function rotateTerm(){
		var ct = $("#rotate").data("term") || 0;
  		$("#rotate").data("term", ct == terms.length -1 ? 0 : ct + 1).text(terms[ct])
              .fadeIn().delay(500).fadeOut(200, rotateTerm);
	}
	rotateTerm();

}