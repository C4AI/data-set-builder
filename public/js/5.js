(function ($) {
  "use strict";
  $(window).one("load", function () {
    const idUser = testUser();
    $.ajax({
      type: 'GET',
      url: '/abstract',
      data: { 'idUser': idUser },
      dataType: 'json',
      success: function (response) {
        console.log(response)
        const { idarticle, abstract } = response.rows[0];
        $("#idarticle").empty().append(idarticle);
        $("#abstract").empty().append(abstract);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
  });

  $('#btnPular').on("click", function () {

    const idUser = testUser();
    const idArticle = $("#idarticle").text()

    $.ajax({
      type: 'POST',
      url: '/abstract/skip',
      data: { 'idUser': idUser, 'idArticle': idArticle },
      dataType: 'json',
      success: function (response) {
        console.log(response)
        window.location.href = './4-abstract.html'
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
  });

})(jQuery);