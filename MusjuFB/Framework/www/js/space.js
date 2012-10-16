
/**SPACE.JS contains all the functions that manages the "Pubs" recommendations except the getGenre from a pub and it also contains the MusicIn (checkIn +track) functions **/

var idSongObj='';


var availablePlaces=new Array(); //Array to store the places found near the user

//Function that get the Geolocalitation from HTML5 or from the GPS in case of a device and call getPlaceMap to get the places near that location.
function showMap(){
navigator.geolocation.getCurrentPosition(function(data) {
                                         localStorage.lat = data['coords']['latitude'];
                                         localStorage.lng = data['coords']['longitude']; 
                                         getPlacesMap();
                                         });
}

//get the Facebook Places near the location of the user 
// it is called from ShowMap()
function getPlacesMap(){
   
    
    var map_object;
    function initialize() {
        var myOptions = {
        zoom: 15,
        center: new google.maps.LatLng(localStorage.lat,localStorage.lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map_object = new google.maps.Map(document.getElementById('map_object'), myOptions);
    }
    google.maps.event.addDomListener(window, 'load', initialize);
   
    
    FB.api('search?center='+localStorage.lat+','+localStorage.lng, { limit: 10, type: 'place', distance : 1000 }, function(response) {
           
           var place=response.data[0];
           var i=0;
           
           while(((typeof(place)) != 'undefined') && (i<10)){
           
           
     
           
                      
           showGenre(place.id, place.name);
      
           
           
           i++;
           place=response.data[i];
           
           }
        
           
           }); 
    
    
    
}

//require venueID, placeName

//function to get the genre of the pub and show a list of them. If it doesn't have enough data about a puba it doesn't list it, and if it detect that there is data but the genre is not calculated, the getTopGenreForSpecificVenue(venueID); is called.

function showGenre(venueID, placeName){
   
    var VenuesGenre = Parse.Object.extend("VenuesGenre");
    var query = new Parse.Query(VenuesGenre);
    query.equalTo("venueID", venueID);
    query.find({
                success: function(results) {
                
                if(results.length>0){
               
                $("#listPlacesNow").append('<li><a href="#" ><h3>'+results[0].get("genre")+' - '+results[0].get("venueName")+'</h3></a></li>');
               $("#listPlacesNow").listview('refresh');
                }else{
                var venuesTracks = Parse.Object.extend("VenuesTracksTest");
                var query = new Parse.Query(venuesTracks);
                query.equalTo("venueID", venueID); //add to the query "only the last 20 songs"
                
                query.find({
                           success: function(results) {
                           if(results.length>0){
                           
                           getTopGenreForSpecificVenue(venueID);
                           setTimeout('showGenre('+venueID+','+placeName+')', 1000);
                           }else{
                           
                           //$("#listPlacesNow").append('<li><a href="#" ><h3>'+placeName+'</h3></a></li>');
                             //$("#listPlacesNow").listview('refresh');
                           }
                           
                           },
                           error: function(error) {
                           alert("Error: " + error.code + " " + error.message);
                           }
                           });
                }
                
                },
                error: function(error) {
                
                
                
                

                }
                });
    
    
    
    
    
}

//Search a song in the Spotify library to do the Music In
function searchSong(){ 
    var name= $("#songName").val();
    
    var url="http://ws.spotify.com/search/1/track.json?q="+name;
    url=encodeURI(url);
    $.ajax({
           url: url,
           dataType: "json",
           success: function(data, textStatus, jqXHR){
           
           fillResults(data);
           },
           error: function(jqXHR, textStatus, errorThrown){
           alert('login error: ' + textStatus);
           }
           });
    
}


//Show the results from the Spotify search
function fillResults(data){
    $("#listResults").empty();
    var track=data.tracks[0];
    var i=0;
    
    while(((typeof(track)) != 'undefined') && (i<10)){
       
        var artistString= track.artists[0].href;
       
       artistStringA=artistString.split(":");
       
        artistID=artistStringA[2];
        
        var pars="'"+track.name+"','"+track.href+"','"+artistID+"'";
        $("#listResults").append('<li><a href="#location" onclick="saveSong('+pars+');"><h3>'+track.name+' ('+track.artists[0].name+') </h3></a></li>');
        i++;
        track=data.tracks[i];
        
    }
    $("#listResults").listview('refresh');
    
    
}

//require name, href and artistID from the track
//function to save the track selected by the user
function saveSong(name, href, artistID){
    
     localStorage.nameSongSelected=name;
     localStorage.trackID=href;
    localStorage.artistID=artistID;
  
    getLocations();
}



// Get the current position again and call the getPlaces() function

function getLocations()
{
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(data) {
                                                  localStorage.lat = data['coords']['latitude'];
                                                 localStorage.lng = data['coords']['longitude'];
                                                 alert("Lat"+localStorage.lat+"Long"+localStorage.lng);
                                                 getPlacesSpa();}
                                                 );
      
    } else {
        error('Geolocation is not supported.');
    }
}

// function to get the facebook places near the location of the user

function getPlacesSpa(){
    
    FB.api('search?center='+localStorage.lat+','+localStorage.lng, { limit: 10, type: 'place', distance : 1000 }, function(response) {
          
           var place=response.data[0];
           var i=0;
        while(((typeof(place)) != 'undefined') && (i<10)){
           var idP="'"+place.id+"'";
          var nameP=place.name;
           nameP=nameP.replace("'","");
           
           availablePlaces[i]=place;
         
          
           $("#listResultsLocations").append('<li><a href="#presend" onclick="savePlaceSel('+i+');"><h3>'+place.name+' </h3></a></li>');
        
           i++;
           place=response.data[i];
           
           }
           $("#listResultsLocations").listview('refresh');
           
           });
}

//store the data about the place selected by the user

function savePlaceSel(p){
   
    localStorage.venueID=availablePlaces[p].id;
    localStorage.venueName=availablePlaces[p].name;
     $("#finalMusic").append("<p>"+localStorage.nameSongSelected+"at "+localStorage.venueName);
}

//Save the track and place selected by the user in the database (Music In)
function saveTrackMusic(){
    var VenuesTracksTest = Parse.Object.extend("VenuesTracksTest");
    var venueTrack = new VenuesTracksTest();
    venueTrack.set("artistID", localStorage.artistID);
    venueTrack.set("trackID", localStorage.trackID);
    venueTrack.set("venueID", localStorage.venueID);
    venueTrack.set("venueName", localStorage.venueName);
    
    venueTrack.save(null, {
                   success: function(venueTrack) {
                    return true;
                   },
                   error: function(venueTrack, error) {
                    alert("error");
                    return false;
                   }
                   });
}




