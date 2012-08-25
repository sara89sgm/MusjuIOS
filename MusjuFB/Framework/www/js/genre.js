var genres; //array[] of the first 5 genres for every artist

//require venueID
//returns nothing because calculateTopGenre() does
function getTopGenreForSpecificVenue(venueID) {
	
	genres=null;
	genres=new Array();
	//empty genres...? or not? what is the scope and durability of the global variable genres?

	getArtistsForSpecificVenue(venueID);	
}

//require venueID
//returns nothing but will call calculateTopGenre() when it's finished (if the first AJAX call to Parse is not an error).
function getArtistsForSpecificVenue(venueID) {
	alert("artist");
	//do some magic with the database and get the list of artists played in a specific venue
	var venuesTracks = Parse.Object.extend("VenuesTracksTest");
	var query = new Parse.Query(venuesTracks);
	query.equalTo("venueID", venueID); //add to the query "only the last 20 songs"
	
	query.find({
  		success: function(results) {
    		//alert("Successfully retrieved " + results.length + " scores.");
    		
    		//for every artist
    		var i = 0;
    		var j = 0; //to know when all the fillGenresArray() calls are finished
    		while(i<results.length) {
    			
    			var currentArtist = results[i].get("artistID"); //MAGIC
    			//console.log( currentArtist );
    			
    			//get the artist's genres
    			var url="http://developer.echonest.com/api/v4/artist/terms?api_key=MXG5OCMN63QJ1C5OM&id=spotify-WW:artist:"+currentArtist+"&format=jsonp";
				url=encodeURI(url);
               nameVenue=results[i].get("venueName");
				$.ajax({
					url: url,
					dataType: "jsonp",
					success: function(data, textStatus, jqXHR){
    					//add the artist's genres to the global genre array
 						fillGenresArray(data);
 						
 						//j gets incremented only when the ajax calls are finished
 						j++;
 						
 						//when the artists are finished calculate the top genre above all
 						if (j==(results.length)) {
                       
    						calculateTopGenre(venueID,nameVenue);
    					}

					},
					error: function(jqXHR, textStatus, errorThrown){
						alert('login error: ' + textStatus);
					}
				});
					
    			i++;
    		}
    		
  		},
  		error: function(error) {
    		alert("Error: " + error.code + " " + error.message);
  		}
	});

}


function fillGenresArray(data) {

	//console.log("---fillGenresArray called!");
	
	var terms=data.response.terms;
	//console.log("terms length: "+terms.length);
	
	var i=0;
	while (i<5 && i<terms.length) {
		genres.push(terms[i].name);
		i++;
	}
	
}

//uses global genres array
//stores the most common genre accross all the artists in a specific venue in the VenuesGenre table
function calculateTopGenre(venueID,venueName) {
   
	var availableGenres = new Array();
	
	availableGenres["pop"]=0;
	availableGenres["rock"]=0;
	availableGenres["punk"]=0;
	availableGenres["rap"]=0;
	availableGenres["country"]=0;
	availableGenres["techno"]=0;
	availableGenres["jazz"]=0;
	availableGenres["dance"]=0;
	
	//count which genre has more occurrences

	String.prototype.contains = function(it) { return this.indexOf(it) != -1; }; //hacky.
	var i=0;
	//for all the genres in the big array
	while (i<genres.length) {
			
		if (genres[i].contains("pop"))
			availableGenres["pop"]++;
		if (genres[i].contains("rock"))
			availableGenres["rock"]++;
		if (genres[i].contains("punk"))
			availableGenres["punk"]++;
		if (genres[i].contains("rap"))
			availableGenres["rap"]++;
		if (genres[i].contains("country"))
			availableGenres["country"]++;
		if (genres[i].contains("techno"))
			availableGenres["techno"]++;
		if (genres[i].contains("dance"))
			availableGenres["dance"]++;
		if (genres[i].contains("dance"))
			availableGenres["dance"]++;
		if (genres[i].contains("jazz"))
			availableGenres["jazz"]++;

		i++;	
	}
	
	//find the maximum in the array
	var i=0;
	var maxkey="pop";
	var maxnumber=availableGenres["pop"];
	
	for (i in availableGenres) {
		if (availableGenres[i] > maxnumber) {
			maxnumber = availableGenres[i];
			maxkey = i;
		}
			
	}
	var genre = maxkey;

	
		
	//put it into VenuesGenre table (venueID, genre, time)
	var time = new Date().getTime();
	
	var VenuesGenre = Parse.Object.extend("VenuesGenre");
	var venuesGenre = new VenuesGenre();

	venuesGenre.set("venueID", venueID);
    venuesGenre.set("venueName", venueName);
	venuesGenre.set("genre", genre);
	venuesGenre.set("time", time);

	venuesGenre.save(null, {
  		success: function(venuesGenre) {
                    
  		},
  		error: function(venuesGenre, error) {
    		console.log("save to VenuesGenre failed :(!");
  		}
	});
}

function testGenreForVenue() {
	getTopGenreForSpecificVenue("3fd66200f964a520daf11ee3");
	
}
