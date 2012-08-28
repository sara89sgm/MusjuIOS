
	/** authParse contains the function related with the login and signUp in PArse **/
	
	function loginParse(){
		
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
	
	
	
	