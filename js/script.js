

// Below is the parallax function for img card 
  $(document).ready(function(){
      $('.parallax').parallax();
      // revealing the background images
     

      // Below targets each img group and reveals one at a time
    
      function appear(items, index) {
        index = index % items.length;
        items.removeClass("appear-img");
        items.eq(index).fadeToggle().addClass('appear-img');   
        setTimeout(function() {appear(items, index + 1)}, 14000);
        }

      appear($('.background-group ul'), 0);


      $( "#readmore-btn" ).click(function(e) {
        e.preventDefault();
        $('.card .card-content p').toggleClass('toggleheight');
        //$("#readmore-btn").html('Read Less');
        if($(this).text() == "Read More"){
          $(this).text("Read Less");
        }
        else if($(this).text() == "Read Less"){
          $(this).text("Read More");
        }
      });

      $( "#btn-song" ).click(function(e) {
        e.preventDefault();
        $('.collapse-container').toggleClass('toggle-container');
        if($(this).text() == "More Songs"){
          $(this).text("Less Songs");
        }
        else if($(this).text() == "Less Songs"){
          $(this).text("More Songs");
        }


      });

      $('#txtArtistSearch').keypress('click',function(e){
    if( e.which == 13 ){
      e.preventDefault();
      var query = $('#txtArtistSearch').val();
      if( query.length > 2 ){
        //styling
        $('main').css('overflow','initial');
      }
    }
  });


       // ===== Scroll to Top ==== 
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {        
                $('#return-to-top').fadeIn(200);    
            } else {
                $('#return-to-top').fadeOut(200);   
            }
        });
        $('#return-to-top').click(function() {      
            $('body,html').animate({
                scrollTop : 0                       
            }, 500);
        });
  });
