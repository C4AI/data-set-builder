(function ($) {
    "use strict";
    $("#main").show(function () {
        $.ajax({
            type: 'GET',
            url: '/abstract',
            data: {'idUser':123456 },
            dataType: 'json',
            success: function(response) {
                console.log(response)
                const {idarticle, abstract} = response.rows[0];
                $( "#idarticle" ).empty().append( idarticle );
                $( "#abstract" ).empty().append( abstract );
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });
    $( "#searchForm" ).submit(function( event ) {
 
        // Stop form from submitting normally
        event.preventDefault();
       
        // Get some values from elements on the page:
        var $form = $( this ),
          term = $form.find( "input[name='s']" ).val(),
          url = $form.attr( "action" );
       
        // Send the data using post
        var posting = $.post( url, { s: term } );
       
        // Put the results in a div
        posting.done(function( data ) {
          var content = $( data ).find( "#content" );
          $( "#result" ).empty().append( content );
        });
      });
})(jQuery);