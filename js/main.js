  
  var SEARCH_BASE_URL = 'https://api.spotify.com/v1/';
  var TRACKS_BASE_URL = 'https://api.spotify.com/v1/artists/{id}/top-tracks';
  var YOUTUBE_SEARCH_BASE_URL = 'https://www.googleapis.com/youtube/v3/search?part=';
  var SEARCH_LIMIT = 5;
  var RELATED_LIMIT = 6;
  var api_key = "WJR9NGGDMNXGWXXAW";
  var youtube_api_key = "AIzaSyDJ2uOGMzzshx3VCZQ3bxI0wz-E4STB3bU";
  var $ajaxlog = $('#ajaxlog');  
  var $searchResults = $('#searchresults');
  var $top25Tracks = $('#top25Tracks');
  var $selectedArtistTemplate = $('#selectedartisttemplate');
  var $relatedArtistTemplate = $('#relatedartisttemplate');
  var $spotifyResults = $('#spotifyresults');  
  var searchResultData = {};
  var $bioText = $('#bioText');
  var $videoDisplay = $('#videoDisplay');
  var videoID;

  //load youtube player api asynchronously 
  // var player;
  // var tag = document.createElement('iframe');
  // // tag.src = "http://www.youtube.com/player_api";
  // tag.src = "http://www.youtube.com/embed/";//id goes after /
  // var firstScriptTag = document.getElementById('player');
  // var firstScriptTag = document.getElementById('.youtube-player')[0];
  
  $('.modal-trigger').leanModal();
  
  $('#btnsearchartists').on('click', function(e) {
    var query = $('#txtArtistSearch').val();
    if (query.length > 2) {
      $searchResults.html('');   
      searchArtists(query);
      getYoutubeSearch(query);
      //switched the order and the query worked for echo nest
    }
  });

  $('body').on('click', '.artist', function(e) {
    e.preventDefault();
    selectedIndex = $(this).attr('data-selected-index');
    selectedID = $(this).attr('href');
    console.log("searchResultData "+searchResultData.artists);
    selectedArtistData = searchResultData.artists.items[selectedIndex];
    var $renderedTemplate = $selectedArtistTemplate.tmpl(selectedArtistData);
    $spotifyResults.html($renderedTemplate);
    top25Tracks(selectedID);
    getArtistBio(selectedID);

    $('#searchcard').addClass('hidden');
    $('#hiddenrow').removeClass('hidden').addClass('animated bounceInDown');
  });
  
  
  $('body').on('click', '#searchagainbutton', function(e) {
    $('#searchcard').removeClass('hidden').addClass('animated bounceInDown');
    $('#hiddenrow').removeClass('animated bounceInDown').addClass('hidden'); 
  });
  
  
searchArtists('Dave Matthews');
  
  function getArtistId(artistID) {
    // console.log("getArtistId...");
    // console.log(artistID);
    return $.get(SEARCH_BASE_URL+'artists/'+artistID) //artist object 
      .pipe(top25Tracks);
  }

  function renderRelatedTemplate(relatedArtists) {
    var tracks = relatedArtists.tracks;
    var tracksResult = ''; 
    for (var i = 0; i < tracks.length; i++){
      var trackName = tracks[i].name; 
      tracksResult += '<li><a class="artist" data-selected-index="'+i+'" data-artist-name="'+trackName+'">'+trackName+'</a></li>';
    }
    $top25Tracks.html(tracksResult); 
  } 
  
  function searchArtists(query) {
    var oData = {
      q: query,
      type: 'artist',
      limit: SEARCH_LIMIT,
      offset: 0,
      market: 'US'
    };
    var url = SEARCH_BASE_URL + 'search';
    return $.get(url, oData)
      .pipe(renderSearchResults);
  }

  function renderSearchResults(response) {
    searchResultData = response;
    var artists = response.artists.items;
    var result = '';
    for (var i = 0; i < artists.length; i++) {
      var artistName = artists[i].name;
      var artistID = artists[i].id;
      result += '<li><a class="artist" data-selected-index="'+i+'" data-artist-name="'+artistName+'" href="'+artistID+'">'+artistName+'</a></li>';
    }
    $searchResults.html(result);  
  }

  function top25Tracks (artistID) {
    var url = "https://api.spotify.com/v1/artists/"+artistID+"/top-tracks?country=US";
    return $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function(data){
      }
    })
      .pipe(renderRelatedTemplate);
  }

  function getArtistBio(query) {
    console.log("query: "+query);
    // var echoNestId;
    var url;
    var url = "http://developer.echonest.com/api/v4/artist/biographies?api_key="+api_key+"&id=spotify:artist:"+query;
    var bData = {
      api_key: api_key,
      id: query
    };
    return $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function(response){
        console.log('getArtistBio ajax call worked')
        console.log(this);
      }
    })
      .pipe(renderBio)
  }

  function renderBio(relatedArtists) {
    console.log("relatedArtists: " + relatedArtists);
    var bioText;
    for (var i=0; i<relatedArtists.response.biographies.length; i++){
      if(relatedArtists.response.biographies[i].text.length > 100){
        bioText = relatedArtists.response.biographies[i].text;
        break;
      }
    }
    var bioResult = ''; 
    bioResult = '<li><a class="artistBio">'+bioText+'</a></li>';
    $bioText.html(bioResult); 
  } 

  function getYoutubeSearch (query){
    console.log('getYoutubeSearch function entered...');
    console.log(query);
    var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+query+'%20interview%20musician&key='+youtube_api_key;
    console.log(url);
    //add a bit of code that limits search results to 3 or 5
    return $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(response){
        console.log('getYoutubeSearch ajax call worked!');
        console.log(response);
      }
    })
       .pipe(onYouTubeIframeAPIReady);
  }


  // var player;
  // var tag = document.createElement('iframe');
  // tag.src = "http://www.youtube.com/embed/";//id goes after /
  // var firstScriptTag = document.getElementById('player');

  function onYouTubeIframeAPIReady(response) {
    console.log('onYouTubeIframeAPIReady entered...');

    videoID = response.items[0].id.videoId;
    console.log("videoID", videoID);

    var videoTitle = response.items[0].snippet.title;
    console.log("videoTitle", videoTitle);

    var ifrm = document.createElement('iframe');
    ifrm.setAttribute('id', 'player');
    document.getElementById('player-container').appendChild(ifrm);

    console.log('ifrm: ', ifrm);
    var youtubeEmbedBase = "http://www.youtube.com/embed/";

    var srcLink = youtubeEmbedBase+videoID;

    // console.log("YT: "+ YT);
    player = {
      src: function() { 
          console.log('in player object src'); 
          srcLink = youtubeEmbedBase+videoID;
          console.log('srcLink inside src', srcLink);
          document.getElementById('player')
            .setAttribute('src', srcLink);
          // return this;
      },
      width: '33%',
      height: '33%',
      videoId: videoID,
      events: {
        'onReady': onPlayerReady,
        // 'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError
      }
    };
    ifrm.setAttribute('src', srcLink);
    ifrm.setAttribute('width', player.width);
    ifrm.setAttribute('width', player.height);
    // console.log('srcLink', srcLink);

  }

  function onPlayerReady(event) {
    event.target.setVolume(100);
    event.target.playVideo();
  }
  var done = false;
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, 6000);
      done = true;
    }
  }
  function onPlayerError() {
    console.log('player error');
  }
  function stopVideo() {
    player.stopVideo();
  }























// ========== MY STUFF ABE ======================================================================



// Below is the parallax function for img card 
  $(document).ready(function(){
      $('.parallax').parallax();
      // revealing the background images
      $('.background-group').addClass('reveal');
    });


// Below is the Keypress function to search artist 

  $(document).keypress(function(e){
    if( e.which == 13 ){
        e.preventDefault();
        var query = $('#txtArtistSearch').val();
        if( query.length > 2 ){
          searchArtists(query);
        }
    }
  });

//   function searchArtists(query) {
//       var oData = {
//       q: query,
//       type: 'artist',
//       limit: SEARCH_LIMIT,
//       offset: 0,
//       market: 'US'
//       };
      
//       var url = SEARCH_BASE_URL + 'search';

//       return $.get(url, oData)
//       .pipe(renderSearchResults);

//   }

  
//   function renderSearchResults(response) {
//       searchResultData = response;
//       var artists = response.artists.items;
//       var result = '';
//       for (var i = 0; i < artists.length; i++) {
//       var artistName = artists[i].name;
//       var artistID = artists[i].id;
//       result += '<li><a class="artist" data-selected-index="'+i+'" data-artist-name="'+artistName+'" href="'+artistID+'">'+artistName+'</a></li>';
//     }

//     $searchResults.html(result);
//   }
  


// // https://api.spotify.com/v1/search?q=Muse&type=track,artist&market=US
