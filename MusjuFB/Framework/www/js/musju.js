/** Main file, config value for database Parse and main functions for the app **/

/** PARSE **/

Parse.initialize("UD2mcikqPwaRl7i4a8erG5wSZvj9XcfAfGNR6vXn",
		"29je5N9Fz4tz7ymc9XcQ4ymStqyfNVQzIIgwtG2J");




var actualPlaylistId = '';
$(document).ready(function() {
	if (actualPlaylistId === '') {
		$("requestSong").hide();
	}
});

//Function to set a Playlist in the app and get the data from it, showing the list of tracks 

function joinPlaylist(url) {
	var TrackPlaylistMusju = Parse.Object.extend("TrackPlaylistMusju");
	var query = new Parse.Query(TrackPlaylistMusju);
	localStorage.urlPlaylist = url;
	query.equalTo("urlPlaylist", url);
	query.find({
		success : function(playlistArray) {

			var i = 0;

			while (i < playlistArray.length) {

				id = "'" + playlistArray[i].id + "'";

				$("#tracksPlaylist").append(
						'<li data-theme="c"><a href="#" data-transition="slide" onclick="voteTrack('
								+ id + ')" >'
								+ playlistArray[i].get("nameTrack") + '('
								+ playlistArray[i].get("nameArtist")
								+ ') &raquo;</a> </li>');
				i++;
			}

			$("#tracksPlaylist").listview('refresh');

		},
		error : function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

//Function to get all the available Playlists from the database.

function getPlaylists() {
	
	var PlaylistMusju = Parse.Object.extend("PlaylistMusju");
	var query = new Parse.Query(PlaylistMusju);
	query
			.find({
				success : function(playlistArray) {
					var i = 0;

					while (i < playlistArray.length) {

						url = "'" + playlistArray[i].get("url") + "'";

						$("#playlistsShowList")
								.append(
										'<li data-theme="c"><a href="#playlist" data-transition="slide" onclick="joinPlaylist('
												+ url
												+ ')" >'
												+ playlistArray[i].get("name")
												+ ' &raquo;</a> </li>');
						i++;
					}

					$("#playlistsShowList").listview('refresh');
					return true;
					// The object was retrieved successfully.
				},
				error : function(object, error) {
					alert("error");
					return false;
					// The object was not retrieved successfully.
					// error is a Parse.Error with an error code and description.
				}
			});
}

//Function to add a vote for a specific track

function voteTrack(id) {
	var TrackPlaylistMusju = Parse.Object.extend("TrackPlaylistMusju");
	var query = new Parse.Query(TrackPlaylistMusju);
	query.get(id, {
		success : function(track) {
			votes = track.get("votes");
		
			votes++;
			track.set("votes", votes);
			newVotes = track.get("votes");
			alert("You have voted the track! Wait to listen to it! :)");
			track.save();
			// The object was retrieved successfully.
		},
		error : function(object, error) {
			alert("Error");
			// The object was not retrieved successfully.
			// error is a Parse.Error with an error code and description.
		}
	});
}

//Function to add a track to the actual Playlist selected by the user

function addTrack(uri) {

    var RequestTrack = Parse.Object.extend("RequestTrack");
    var newtrack = new RequestTrack();
    alert("hello");
    newtrack.set("urlTrack", uri);
    newtrack.set("urlPlaylist", localStorage.urlPlaylist);
    newtrack.set("idUser", sessionStorage.idUser);
  
    
    newtrack.save(null, {
                  success : function(newplaylist) {
                  alert("You have added the song succesfully :) ");
                  },
                  error : function(newplaylist, error) {
                  // The save failed.
                  // error is a Parse.Error with an error code and
                  // description.
                  }
                  });

}

//Function to search a track in the Spotify library


function searchSongRequest(){ 
    var name= $("#spotify_song_search").val();
    
    var url="http://ws.spotify.com/search/1/track.json?q="+name;
    url=encodeURI(url);
    $.ajax({
           url: url,
           dataType: "json",
           success: function(data, textStatus, jqXHR){
           
           fillResultsRequest(data);
           },
           error: function(jqXHR, textStatus, errorThrown){
           alert('login error: ' + textStatus);
           }
           });
    
}

//function to show the results from the Spotify's search


function fillResultsRequest(data){
    $("#listResultsSpotify").empty();
    var track=data.tracks[0];
    var i=0;
    
    while(((typeof(track)) != 'undefined') && (i<10)){
        var uriT="'"+track.href+"'";
        
       $("#listResultsSpotify").append('<li><a href="#playlist" onclick="addTrack('+uriT+');"><h3>'+track.name+' ('+track.artists[0].name+') </h3></a></li>');
        i++;
        track=data.tracks[i];
        
    }
    $("#listResultsSpotify").listview('refresh');
    
    
}
