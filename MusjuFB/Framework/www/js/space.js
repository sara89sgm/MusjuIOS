


var idSongObj='';

var availablePlaces=new Array(); 

function showMap(){
navigator.geolocation.getCurrentPosition(function(data) {
                                         localStorage.lat = data['coords']['latitude'];
                                         localStorage.lng = data['coords']['longitude']; 
                                         getPlacesMap();
                                         });
}


function getPlacesMap(){
   
    
    var map_object;
    function initialize() {
        var myOptions = {
        zoom: 15,
        center: new google.maps.LatLng(37.7879938,-122.4074374),
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
                           alert("encontrado pero calculando");
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

function saveSong(name, href, artistID){
    
     localStorage.nameSongSelected=name;
     localStorage.trackID=href;
    localStorage.artistID=artistID;
  
    getLocations();
}





function getLocations()
{
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(data) {
                                                  localStorage.lat = data['coords']['latitude'];
                                                 localStorage.lng = data['coords']['longitude'];
                                                 alert("Lat"+localStorage.lat+"Long"+localStorage.lng);
                                                 getPlaces();}
                                                 );
      
    } else {
        error('Geolocation is not supported.');
    }
}



function getPlaces(){
    
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

function savePlaceSel(p){
   
    localStorage.venueID=availablePlaces[p].id;
    localStorage.venueName=availablePlaces[p].name;
     $("#finalMusic").append("<p>"+localStorage.nameSongSelected+"at "+localStorage.venueName);
}


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




