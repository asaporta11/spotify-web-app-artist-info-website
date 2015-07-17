  
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

(function(){



    // console.log('testing...');
    // var artistID = '2TI7qyDE0QfyOlnbtfDo7L';
    // var url = "https://api.spotify.com/v1/artists/"+artistID+"/top-tracks?country=US";
    // // return $.get(url, function(data){ 
    // //     console.log("data: "+data);
    // //  });
    // $.ajax({
    //   url: url,
    //   type: 'GET',
    //   dataType: 'json',
    //   success: function(data){
    //     console.log('success!');
    //     console.log(data);
    //   }
    // });




})();


  
  $('.modal-trigger').leanModal();
  
  $('#btnsearchartists').on('click', function(e) {
    var query = $('#txtArtistSearch').val();
    if (query.length > 2) {
      $searchResults.html('');      
      searchArtists(query);
    }
  });


  $('body').on('click', '.artist', function(e) {
    e.preventDefault();
    selectedIndex = $(this).attr('data-selected-index');
    selectedID = $(this).attr('href');
    selectedArtistData = searchResultData.artists.items[selectedIndex];
    console.log('passed to template1: ', selectedArtistData);
    var $renderedTemplate = $selectedArtistTemplate.tmpl(selectedArtistData);
    console.log('renderedTemplate: ', $renderedTemplate);
    $spotifyResults.html($renderedTemplate);
    // getRelatedByID(selectedID); //get related by id is going to become part of your top 25 tracks 
    top25Tracks(selectedID);
    $('#searchcard').addClass('hidden');
    $('#hiddenrow').removeClass('hidden').addClass('animated bounceInDown');
  });
  
  
  $('body').on('click', '#searchagainbutton', function(e) {
    $('#searchcard').removeClass('hidden').addClass('animated bounceInDown');
    $('#hiddenrow').removeClass('animated bounceInDown').addClass('hidden'); 
  });
  
  
searchArtists('Dave Matthews');
  
  function getRelatedByID(artistID) {
    console.log("artistID get related...");
    console.log(artistID);
    return $.get(SEARCH_BASE_URL+'artists/'+artistID) //now have artist object 
      // .pipe(trimResults)
      // .pipe(renderRelatedTemplate)
      .pipe(top25Tracks);
  }

  // //related artist limit
  // function trimResults(response) {
  //   console.log('trimResults...');
  //   console.log(response);
  //   if (response.artists.length > RELATED_LIMIT) {
  //     response.artists = response.artists.slice(0, RELATED_LIMIT);
  //   }
  //   return response;
  // }

  function renderRelatedTemplate(relatedArtists) {
    console.log('renderRelatedTemplate...');
    console.log(relatedArtists);
    var tracks = relatedArtists.tracks;
    var tracksResult = ''; 
    for (var i = 0; i < tracks.length; i++){
      var trackName = tracks[i].name; 
      console.log(trackName);
      tracksResult += '<li><a class="artist" data-selected-index="'+i+'" data-artist-name="'+trackName+'">'+trackName+'</a></li>';
    }
    $top25Tracks.html(tracksResult); 
    // //$searchResults.html(result); 
    // // console.log('relatedArtists: ', relatedArtists);
    // // console.log('passed to template2: ', relatedArtists.artists);
    // var $renderedTemplate = $relatedArtistTemplate.tmpl(relatedArtists.artists);
    // // console.log('renderedTemplate: ', $renderedTemplate);
    // $('#relatedartists').html($renderedTemplate);
    // return relatedArtists;
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
    // console.log("response: " + searchResultData);
    var artists = response.artists.items;
    // console.log("response.artists.items: " + artists);
    var result = '';
    for (var i = 0; i < artists.length; i++) {
      var artistName = artists[i].name;
      var artistID = artists[i].id;
      result += '<li><a class="artist" data-selected-index="'+i+'" data-artist-name="'+artistName+'" href="'+artistID+'">'+artistName+'</a></li>';
    }
    $searchResults.html(result);  
  }

  function top25Tracks (artistID) {
    console.log("artist in top25...");
    console.log(artistID);
    var url = "https://api.spotify.com/v1/artists/"+artistID+"/top-tracks?country=US";
    console.log("top 25 tracks...");
    console.log(url);
    return $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function(data){
        console.log('success!');
        console.log(data);
      }
    })
    .pipe(renderRelatedTemplate);


    // return $.get(url, function(tracks){ 
    //     console.log("data: "+tracks);
    //  });

      // .pipe(renderTop25Tracks)
  }

    // return $.get( url, function(data) {
    //   console.log("artistID" + id);
    // })

  // function renderTop25Tracks () { }



// function justDisplayResponse(response) {
//   console.log('response: ', response);
// }










  // $(document).ajaxComplete(function(event, request, settings) {
  //   $ajaxlog.append('<li>Request Complete.</li>');
  // });
  // $(document).ajaxError(function(event, request, settings, thrownError) {
  //   $ajaxlog.append('<li>Error requesting page <b>' + settings.url + '</b></li>');
  //   $ajaxlog.append('<li>Error Thrown: <b>' + thrownError + '</b></li>');
  // });
  // $(document).ajaxSend(function(event, request, settings) {
  //   $ajaxlog.append('<li>Starting request at ' + settings.url + '</li>');
  // });
  // $(document).ajaxStart(function() {
  //   $ajaxlog.append('<li>ajax call started</li>');
  // });
  // $(document).ajaxStop(function() {
  //   $ajaxlog.append('<li>ajax call stopped</li>');
  // });
  // $(document).ajaxSuccess(function(event, request, settings) {
  //   $ajaxlog.append('<li>Successful Request!</li>');
  // });  