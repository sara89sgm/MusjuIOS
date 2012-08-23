/** PARSE **/

Parse.initialize("UD2mcikqPwaRl7i4a8erG5wSZvj9XcfAfGNR6vXn",
		"29je5N9Fz4tz7ymc9XcQ4ymStqyfNVQzIIgwtG2J");


	$("#spotify_song_search").autocomplete({
		source : function(request, response) {
			$.get("http://ws.spotify.com/search/1/track.json", {
				q : request.term
			}, function(data) {
                  alert("hello");
				var firsts = new Array();
				firsts[0] = data.tracks[0];
				firsts[1] = data.tracks[1];
				firsts[2] = data.tracks[2];
				firsts[3] = data.tracks[3];
				firsts[4] = data.tracks[4];
				response($.map(firsts, function(item) {
					return {
						label : item.name,
						track : item
					};
				}));
			});
		},
		select : function(el, ui) {
			console.log(ui);
			localStorage.requestSongUri = ui.item.track.href;

		}
	});

var actualPlaylistId = '';
$(document).ready(function() {
	if (actualPlaylistId === '') {
		$("requestSong").hide();
	}
});

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

function getPlaylists() {
	alert("hola");
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

function voteTrack(id) {
	var TrackPlaylistMusju = Parse.Object.extend("TrackPlaylistMusju");
	var query = new Parse.Query(TrackPlaylistMusju);
	query.get(id, {
		success : function(track) {
			votes = track.get("votes");
			alert("Actual:" + votes);
			votes++;
			track.set("votes", votes);
			newVotes = track.get("votes");
			alert("Actual:" + newVotes);
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

function addTrack() {

}
