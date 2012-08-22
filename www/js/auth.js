//Initialize Facebook
	var accessTokenFB='';
	//var idUser='';
	window.onload = function() {
        /* Instantiate the global sp object; include models */
       
        /* Set the permissions you want from the user. For more
         * info, check out http://bit.ly/A4KCW3 */
        var permissions = ['user_about_me'];
        var app_id = '403799456325756';
        var fbButtonHTML = document.getElementById('fb-login');

        fbButtonHTML.addEventListener('click', authFB);

        /*function authFB() {
            auth.authenticateWithFacebook(app_id, permissions, {
                onSuccess: function(accessToken, ttl) {
                	accessTokenFB=accessToken;
                	
                	$("#login").hide();
                	$("#restApp").show();
                	
                	//getUserInfor();
                	window.location.href = 'home';
                    
                },
                onFailure: function(error) {
                    console.log('Authentication failed with error: ' + error);
                },
                onComplete: function() { }
            });
        }*/
    }
	
	
	function login(){
		
		Parse.User.logIn($("#loginUserName").val(), $("#loginPass").val(), {
			  success: function(user) {
				  localStorage.idUser=user.id;
				
					alert("logged");
					return true;
			  },
			  error: function(user, error) {
				  alert("error login");
				  return false;
			    // The login failed. Check error to see why.
			  }
			});
	
	    
	}
	
	function singUp(){
		username=$("#singupUserName").val();
		email=$("#email").val();
		pass=$("#singupPass").val();
		
		var user = new Parse.User();
		user.set("username", username);
		user.set("password", pass);
		user.set("email", email);
		

	

		user.signUp(null, {
			  success: function(user) {
				  localStorage.idUser=user.id;
			   alert("Congratulations, you are already registered, check your email! Now, log in to start your Music Juice!");
			   return true;
			  },
			  error: function(user, error) {
			    // Show the error message somewhere and let the user try again.
			    alert("Error: " + error.code + " " + error.message);
			    return false;
			  }
			});
	}
	
	
	function getUserInfor(){
		$.ajax({
	        type: 'GET',
	        contentType: 'application/json',
	        url: 'https://graph.facebook.com/me?access_token=' + accessTokenFB,
	        dataType: "json",
	        
	        success: function(data, textStatus, jqXHR){
	        	
	        	localStorage.idUser=data.id;
	    		getPlaylistUser(localStorage.idUser);
	        	
	            
	        },
	        error: function(jqXHR, textStatus, errorThrown){
	            alert('login error: ' + textStatus);
	        }
	    });
	    
		
	}
	
	
	