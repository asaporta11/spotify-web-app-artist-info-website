  
  var SEARCH_BASE_URL = 'https://api.spotify.com/v1/';
  var TRACKS_BASE_URL = 'https://api.spotify.com/v1/artists/{id}/top-tracks';
  var SEARCH_LIMIT = 5;
  var RELATED_LIMIT = 6;
  var $ajaxlog = $('#ajaxlog');  
  var $searchResults = $('#searchresults');
  var $top25Tracks = $('#top25Tracks');
  var $selectedArtistTemplate = $('#selectedartisttemplate');
  var $relatedArtistTemplate = $('#relatedartisttemplate');
  var $spotifyResults = $('#spotifyresults');  
  var searchResultData = {};
  var api_key = "WJR9NGGDMNXGWXXAW";
  var $bioText = $('#bioText');


  
  $('.modal-trigger').leanModal();
  
  $('#btnsearchartists').on('click', function(e) {
    var query = $('#txtArtistSearch').val();
    if (query.length > 2) {
      $searchResults.html('');   
      searchArtists(query);
      //switched the order and the query worked for echo nest
    }
  });


  $('body').on('click', '.artist', function(e) {
    e.preventDefault();
    selectedIndex = $(this).attr('data-selected-index');
    selectedID = $(this).attr('href');
    selectedArtistData = searchResultData.artists.items[selectedIndex];
    // console.log('passed to template1: ', selectedArtistData);
    var $renderedTemplate = $selectedArtistTemplate.tmpl(selectedArtistData);
    // console.log('renderedTemplate: ', $renderedTemplate);
    $spotifyResults.html($renderedTemplate);
    // getArtistId(selectedID); //get related by id is going to become part of your top 25 tracks 
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
    console.log("getArtistId...");
    console.log(artistID);
    return $.get(SEARCH_BASE_URL+'artists/'+artistID) //artist object 
      .pipe(top25Tracks);
  }

  function renderRelatedTemplate(relatedArtists) {
    // console.log('renderRelatedTemplate...');
    // console.log(relatedArtists);
    var tracks = relatedArtists.tracks;
    var tracksResult = ''; 
    for (var i = 0; i < tracks.length; i++){
      var trackName = tracks[i].name; 
      // console.log(trackName);
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
    // console.log("artist in top25...");
    // console.log(artistID);
    var url = "https://api.spotify.com/v1/artists/"+artistID+"/top-tracks?country=US";
    // console.log("top 25 tracks...");
    // console.log(url);
    return $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function(data){
        // console.log('success!');
        // console.log(data);
      }
    })
      .pipe(renderRelatedTemplate);
  }

  // function getEchoNestId (query) {
  //   console.log("getEchoNestId start...");
  //   console.log(query);
  //   var url = "http://developer.echonest.com/api/v4/artist/search?api_key="+api_key+"&id=spotify:artist:"+query+"&format=json&results=1&start=0&license=cc-by-sa";
  //   console.log("echonest url...");
  //   console.log(url);
  //   console.log(url.response);
  // }

  function getArtistBio(query) {
    console.log("getArtistBio start");
    var echoNestId;
    var url;
    console.log("query...");
    console.log(query);
    // var url = "http://developer.echonest.com/api/v4/artist/search?api_key="+api_key+"&id=spotify:artist:"+query+"&format=json&results=1&start=0&license=cc-by-sa";
    var url = "http://developer.echonest.com/api/v4/artist/biographies?api_key="+api_key+"&id=spotify:artist:"+query;
    console.log("echonest url...");
    console.log(url);
    // getEchoNestId(query);

    // var mgmtId = "ARI3Y821187FB3649C";
    // var url = "http://developer.echonest.com/api/v4/artist/biographies?api_key="+api_key+"&id="+mgmtId+"&format=json&results=1&start=0&license=cc-by-sa";
    // console.log("url...");
    // console.log(url);
    var bData = {
      api_key: api_key,
      id: query
    };

    return $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function(response){
        console.log('getArtistBio ajax call...')
        console.log(response);
      }
    })
      .pipe(renderBio)

    // return $.ajax(url, console.log('successful get!'))
      // .pipe(renderBio); 
  }

  function renderBio(relatedArtists) {
    console.log('renderBio start');
    console.log(relatedArtists);
    var bioText;
    // var bioText = relatedArtists.response.biographies[2].text;
    // console.log(relatedArtists.response.biographies[1].truncated);
    for (var i=0; i<relatedArtists.response.biographies.length; i++){
      if(relatedArtists.response.biographies[i].text.length > 100){
        bioText = relatedArtists.response.biographies[i].text;
        break;
      }
    }
    console.log(bioText);
    var bioResult = ''; 
    bioResult = '<li><a class="artistBio">'+bioText+'</a></li>';
    $bioText.html(bioResult); 
  } 


