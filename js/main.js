var SEARCH_BASE_URL = 'https://api.spotify.com/v1/';
var TRACKS_BASE_URL = 'https://api.spotify.com/v1/artists/{id}/top-tracks';
var YOUTUBE_SEARCH_BASE_URL = 'https://www.googleapis.com/youtube/v3/search?part=';
var SEARCH_LIMIT = 5;
// var RELATED_LIMIT = 6;
var api_key = "WJR9NGGDMNXGWXXAW";
var youtube_api_key = "AIzaSyDJ2uOGMzzshx3VCZQ3bxI0wz-E4STB3bU";


// EVENTS ------------------------------------------------------------------------------------

// ========== Abe's Stuff ====================================================================
// Below is the parallax function for img card 
$(document).ready(function(){
    $('.parallax').parallax();
    // revealing the background images
    $('.background-group').addClass('reveal');
});
// ===========================================================================================

$('#txtArtistSearch').keydown(function (e) {
  var query = $('#txtArtistSearch').val();

  if (e.which != 13) return;

  e.preventDefault();

  if (query.length > 2) {
    //styling
    $('#content').height('16%');
    $('.container').addClass('height');
    $('.background-group').fadeOut();

    searchArtists(query);
    $('.songs, .interviews, #readmore-btn, .artistBio').css('display', 'block');
  }
});

//Autocomplete 
$('body').on('click', '.artist', function(e) {
  e.preventDefault();

  // selectedIndex = $(this).attr('data-selected-index'); //by selecting artist in list assigns an index # to whichever one you chose
  selectedID = $(this).attr('href'); //get the href of the a tag embedded in the li which is the artist ID (i think)

  renderArtistBio(selectedID);
  top25Tracks(selectedID);

  $('#searchcard').addClass('hidden');
  $('#hiddenrow').removeClass('hidden').addClass('animated bounceInDown');
});

//Search again button 
$('body').on('click', '#searchagainbutton', function(e) {
  $('#searchcard').removeClass('hidden').addClass('animated bounceInDown');
  $('#hiddenrow').removeClass('animated bounceInDown').addClass('hidden'); 
});

$('#txtArtistSearch').on('input', function() {
    autocompleteLookUp($(this).val());
});


// API ---------------------------------------------------------------------------------------

function searchArtists(query) {
  // console.log('search artists entered...');
  var url = 'https://api.spotify.com/v1/search?q=' + query + '&type=artist&market=US';
  $.get(url, function(data) {
    // console.log('search artists success entered!');
    // console.log('search artists data success:', data);
    var artists = data.artists.items; //object of top 10 artists related to query name

    if (artists.length === 0) {
      $('#artist-name').text("Oh no! We don't have that artist in our records. Please try another one!");
      $('.songs, .interviews, #readmore-btn, .artistBio').css('display', 'none');
      $('#artist-picture-test').attr('src', 'images/opps.jpg');

    } else {
      var artistName = artists[0].name;
      $('#artist-name').html(artistName);

      var artistID = artists[0].id;
      var artistPic = artists[0].images[0].url;
      var picDiv = $('#artist-picture-test');
      picDiv.attr('src', artistPic);

      top25Tracks(artistID);
      renderArtistBio(artistID);
      renderYoutubeSearch(artistName);
    }
  });
}

function top25Tracks (artistID) {
  var url = "https://api.spotify.com/v1/artists/" + artistID + "/top-tracks?country=US";

  $.get(url, function (relatedArtists) {
    var tracks = relatedArtists.tracks;
    var tracksResult = '';

    for (var i = 0; i < tracks.length; i++){
      var trackName = tracks[i].name; 
      var previewUrl = tracks[i].preview_url;
      var durationMs = tracks[i].duration_ms;
      var formatDurationMins;

      var durationSecs = Math.round(durationMs/1000);
      var durationMins = Math.floor(durationSecs/60); 
      formatDurationMins = durationMins + ":" + durationSecs%60;

      //if song is 3:06 then puts an 0 before the 6
      if (formatDurationMins.length == 3) {
        formatDurationMins = durationMins + ":0" + durationSecs%60;
      }

      tracksResult +=
        '<tr id="play-preview">' + 
          '<td>' + 
            '<a class="artist" data-selected-index="' + i + '" data-artist-name="' + trackName + '">' + 
              trackName + 
            '</a>' + 
          '</td>' +
          '<td>' +
            '<a class="artist" data-selected-index="' + i + '" data-artist-name="' + formatDurationMins + '">' + 
              formatDurationMins +
            '</a>' +
          '</td>' +
          '<td>' +
            '<audio controls><source src='+previewUrl+'></audio>' +
          '</td>' +
        '</tr>';
    }

    $('#top25Tracks').html(tracksResult);
  });
}

function renderArtistBio(query) {
  var url = "http://developer.echonest.com/api/v4/artist/biographies?api_key=" + api_key + "&id=spotify:artist:" + query;
  $.get(url, function (relatedArtists, status, xhr) {
    // to get status code -> xhr.status
    for (var i=0; i<relatedArtists.response.biographies.length; i++){
      if (relatedArtists.response.biographies[i].text.length > 100) {
        var bioText = relatedArtists.response.biographies[i].text;
        $('#bioText').html('<p class="artistBio">' + bioText + '</p>');
        break;

      } else {
        $('#bioText').html("<p>Oops - it looks like we don't have a bio for this artist! If you'd like to write one, please visit <a href=www.wikipedia.com>our friends at wikipedia</a></p>");
      }
    }
  });
}

function autocompleteLookUp(query){
  var url = "http://developer.echonest.com/api/v4/artist/suggest?api_key=" + api_key + "&name=" + query + "&results=5";
  var autocompleteArray = [];

  $.get(url, function(response){
    for (i=0; i<response.response.artists.length; i++) {
      autocompleteArray.push(response.response.artists[i].name);
    }
    // AUTO COMPLETE - from jQuery UI autocomplete
    $( "#txtArtistSearch" ).autocomplete({
      source: autocompleteArray
    });
  });
}

// YOUTUBE -----------------------------------------------------------------------------------

function renderYoutubeSearch (query){
  // TODO: add a bit of code that limits search results to 3 or 5
  var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + query + '%20%20interview&key='+ youtube_api_key;
  $.get(url, function (response) {
    if ($('#player-container').find('iframe')) {
      $('#player-container').empty();
    }

    for (var i = 0; i < 3; i++) {
      var srcLink = "http://www.youtube.com/embed/" + response.items[i].id.videoId;
      $('#player-container').append('<iframe id="player' + i + ' frameborder="0" allowfullscreen src="' + srcLink + '"></iframe>');
    }
  });
}