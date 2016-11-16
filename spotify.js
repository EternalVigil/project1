$(document).ready(function(){

var config = {
    apiKey: "AIzaSyCCFSxU2igdVBU_credabLSalOMiBrP7HU",
    authDomain: "spotify-54c8e.firebaseapp.com",
    databaseURL: "https://spotify-54c8e.firebaseio.com",
    storageBucket: "spotify-54c8e.appspot.com",
    messagingSenderId: "776346113193"
};
firebase.initializeApp(config);

var database = firebase.database();

var trackList = [];
var trackKeyList = [];
var thumbsUpList = [];
var thumbsDownList = [];
var thumbsUpCount = 0;
var thumbsDownCount = 0;
var thiscount = 0;
//var randomNumber = Math.floor(Math.random() * trackList.length);
var randomNumber;

//    console.log(randomNumber);

function queryTrack(trackEntered){

    $("#albumCover").empty();
    $("#soundBar").empty();
    $("#songName").empty();
    $("#artistName").empty();
    $("#trackView").empty();
        
    // upVote
    // downVote
    var track = trackEntered;
    var queryURL = "https://api.spotify.com/v1/search?q=" + track + "&type=track&limit=1";   

    $.ajax({url: queryURL, method: "GET"}).done(function(response) {    

    //    console.log(response);

        var trackDiv = $("<div>");
        trackDiv.addClass("trackHolder");

        var trackImage = $("<img>");
        trackImage.attr("src", response.tracks.items[0].album.images[0].url);
        trackImage.attr("class", "jpg");
        $("#albumCover").append(trackImage);

        var trackAudio = $("<audio>");
        trackAudio.attr("controls", true);
        trackAudio.attr("src", response.tracks.items[0].preview_url)
        $("#soundBar").append(trackAudio);

        var title = response.tracks.items[0].name;
        var trackTitle = $("<h3>").text("Title: " + title);
        $("#songName").append(trackTitle);

        var artist = response.tracks.items[0].artists[0].name;
        var trackArtist = $("<h3>").text("Artist: " + artist);
        $("#artistName").append(trackArtist);

        var playTrack = $("<iframe>");
        playTrack.attr("src", response.tracks.items[0].external_urls.spotify);
        playTrack.attr("width", "300");
        playTrack.attr("height", "380");
  //    playTrack.attr("frameborder", 0);
  //    playTrack.attr("allowtransparency", false);
        playTrack.attr("class", "play");
        playTrack.attr("scrolling", "no");
        $("#trackView").append(playTrack);

        purchaseTrack(title, artist);    
    });
}

function purchaseTrack(tTitle, tArtist){
        
    var iTunesTitle = tTitle;
//  var iTunesArtist = tArtist;
//  var queryURLItunes = "https://itunes.apple.com/search?term=" + iTunesTitle + iTunesArtist + "&limit=1";
    var queryURLItunes = "https://itunes.apple.com/search?term=" + iTunesTitle + "&limit=1";

    $.ajax({url: queryURLItunes, jsonp: "callback", dataType: "jsonp", method: "GET"}).done(function(response1){

//  console.log(response1);

        var iTunesTitleDiv = $("<div>");
        iTunesTitleDiv.addClass("iTunesTitleHolder");  

        var link = response1.results[0].trackViewUrl;
        var trackLink = $("<a>").text("Purchase Link: " + link);
        trackLink.attr("href", link);
        iTunesTitleDiv.append(trackLink);   

        var cost = response1.results[0].trackPrice;
        var trackCost = $("<h3>").text("Price: " + cost);
        iTunesTitleDiv.append(trackCost);   

        $("#trackView").append(iTunesTitleDiv);  
    });
}
        
$("#addTrack").on("click", function(){

    var tName = $("#track-input").val().trim();
    var userLike = 0;
    var userDislike = 0; 
    queryTrack(tName);
    
    var newTrack = {
        name: tName,
        thumbsUp: userLike,
        thumbsDown: userDislike
    }

    database.ref().push(newTrack);
//    database.ref()

    $("#track-input").val("");

    thiscount++;
    // Save new value to Firebase
    database.ref().set({
        thiscount: thiscount
    });

    return false;

});

$("#nextTrack").on("click", function(){
    randomNumber = Math.floor(Math.random() * trackList.length); 
    console.log("random number: " + randomNumber); 
    queryTrack(trackList[randomNumber]);


});

database.ref().on("value", function(childSnapshot){
    thiscount = childSnapshot.val().thiscount;

    // console.log("childSnapshot",childSnapshot.val());
    var childSnapshotObj = childSnapshot.val();
    for(var key in childSnapshotObj){
        console.log("snapshot key",key);

        if(childSnapshotObj.hasOwnProperty(key)){
            // console.log(childSnapshotObj[key].name);
            trackList.push(childSnapshotObj[key].name)
        }

    }
    console.log("trackList",trackList)
    randomNumber = Math.floor(Math.random() * trackList.length); 
    console.log("random number: " + randomNumber);

    queryTrack(trackList[randomNumber]);


    // random numb
    // var currentTrack = tracklist{randomNumber}
    // queryTrack(currentTrack)
//  console.log(childSnapshot.val());
//     thiscount++
//     console.log("thiscount",thiscount);


//     var trackName = childSnapshot.val().name;
//     thumbsUpCount = childSnapshot.val().thumbsUp;
//     thumbsDownCount = childSnapshot.val().thumbsDown; 

//     var trackKey = childSnapshot.key;
//     console.log(trackKey);

// //  console.log(trackName);

//     trackList.push(trackName);
//     trackKeyList.push(trackKey);
//     thumbsUpList.push(thumbsUpCount);
//     thumbsDownList.push(thumbsDownCount);  

//     console.log(trackKeyList);

    
    /*

    console.log("track list length: " + trackList.length);
    console.log("track list: " + trackList);  

    randomNumber = Math.floor(Math.random() * trackList.length);  
    console.log("random number: " + randomNumber);
    */    


    
});




});
