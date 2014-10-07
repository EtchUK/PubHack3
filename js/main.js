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
					//FB.api('/me/feed', 'post', {message: 'Hello, world!'});
					window.location.href = 'matches.html';

				}, {scope: 'publish_actions'});

			}
		});
		return false;
	});



}