(function($) {
	var writtenPunishments = [
		"is it wrong that I find squirrels attractive?",
		"these piles sting",
		"Someone help me please? I met this guy last night and he came back to mine, he liked the dominatrix sorta stuff. He handcuffed me to my bed and put things in places that I don't even wanna talk about, but lets just say it hurts to poo now... anyway he ended up leaving, and left me handcuffed and I can't reach the keys. Someone please come and help!?",
		"How do you tell your best friend that you are in love with him?",
		"Farting in public and blaming it on the old people around me is the highlight of my day.",
		"If anyone has a bottle of breast milk I can have, that would be great. The stuff from cows just isn't as good.",
	];

	var photoPunishments = [
		{
			"text": "",
			"img": "img/baby.jpg"
		},
		{
			"text": "thought I had outgrown pimples",
			"img": "img/boil.jpg"
		},
		{
			"text": "been ages since I had boils on my bum",
			"img": "img/bum_boil.jpg"
		},
		{
			"text": "need to get that pedicure in",
			"img": "img/feet.jpg"
		},
		{
			"text": "last night...",
			"img": "img/lastnight.jpg"
		}
	];



	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_UK/all.js', function() {
		FB.init({
			//appId      : '729058967147863', // test app
			appId      : '729058753814551' // live app
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


		var me;
		function fbMe() {
			var deferred = $.Deferred();

			if (me) {
				deferred.resolve(me);
			} else {
				authFacebook().then(function() {
					FB.api(
						"/me",
						"GET",
						{},
						function (response) {
							if (response && !response.error) {
								me = response;
								deferred.resolve(response);
							} else if (response.error) {
								deferred.reject(response.error);
							}
						}
					);
				});
			}

			return deferred;
		}

		function fbPostToWall(userId, params) {
			var deferred = $.Deferred();

			authFacebook().then(function() {
				FB.api(
					"/" + userId + "/feed",
					"POST",
					params,
					function (response) {
						if (response && !response.error) {
							deferred.resolve(response);
						} else if (response.error) {
							deferred.reject(response.error);
						}
					}
				);
			});

			return deferred;
		}

		function fbPostPhotoToWall(photoUrl, message) {
			var deferred = $.Deferred();

			authFacebook().then(function() {
				FB.api(
					"/me/photos",
					"POST",
					{
						"url": photoUrl,
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
			});

			return deferred;
		}

		function twilioPrankCall (name, targetName, targetNumber) {
			return $.post("/api/twilio", {
				name: name,
				target: targetName,
				number: targetNumber
			});
		}


		$(".js-login").on('click', function() {
			authFacebook().then(function() {
				window.location.href = "entry.html";
			});

			return false;
		});

		$(".js-play").on('click', function() {
			if ($.trim($("#loved-one-name").val()) === "" || $.trim($("#loved-one-phone").val()) === "") {
		        alert('You did not fill out one of the fields!');
		        return false;
		    }
			localStorage.setItem("lovedOneName", $("#loved-one-name").val());
			localStorage.setItem("lovedOnePhone", $("#loved-one-phone").val());

			window.location.href = "game.html";	

			return false;
		});

		var $yourName = $(".js-your-name");
		if ($yourName.length) {
			fbMe().then(function(me) {
				$yourName.text(me.first_name);
			});
		}

		var clickSound = new Audio('sounds/click.wav');
		var chimeSound = new Audio('sounds/chime.wav');
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
	    			clickSound.play();
	    			clickSound.currentTime = 0;
		    		nextItem();
		    	} else {
	    			chimeSound.play();
		    		var punishment = $('.spinner-item.active').data('punishment');
	    			if (punishment === "phone") {
	    				fbMe().then(function(me) {
		    				var targetName = localStorage.getItem("lovedOneName");
		    				var targetNumber = localStorage.getItem("lovedOnePhone");
		    				twilioPrankCall(me.first_name, targetName, targetNumber).then(function() {
		    					endSpin("We've prank called your loved one.");
		    				}, function(error) {
		    					endSpin("There was an error calling your loved one.");
	    						console.log(error);
		    				});
	    				});
	    			} else if (punishment === "written") {

	    				var message = writtenPunishments[Math.floor(Math.random() * writtenPunishments.length)];

    					fbPostToWall("me", { "message": message }).then(function() {
    						fbMe().then(function(me) {
	    						endSpin("We've <a href='" + me.link + "' target='_blank'>written on your Facebook wall</a>");
    						});
	    				}, function(error) {
	    					endSpin("There was an error writing on your Facebook wall");
	    					console.log(error);
	    				});
	    				
	    			} else if (punishment === "photo") {

	    				var message = photoPunishments[Math.floor(Math.random() * photoPunishments.length)];

    					fbPostPhotoToWall(window.location.protocol + "//" + window.location.hostname + "/" + message.img, message.text).then(function() {
    						fbMe().then(function(me) {
	    						endSpin("We've <a href='" + me.link + "' target='_blank'>posted a photo on your Facebook wall</a>");
    						});
	    				}, function(error) {
	    					endSpin("There was an error posting to your Facebook wall");
	    					console.log(error);
	    				});


	    			} else if (punishment === "none") {
	    				endSpin("You got lucky this time! No punishment.");
	    			}

		    		$('.spinner-item.active').addClass('chosen');
		    	}
	    	}, speed);
	    	speed = speed + 25;   	
	    }

	    function endSpin(text){
		    spinning = false;
			$('.start-spinner').text('PLAY');
			$('.result').html(text);
	    }

	});

})(jQuery);



