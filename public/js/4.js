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

  $('#btnRejeitar').on("click", function () {

    const idUser = testUser();
    const idArticle = $("#idarticle").text()
   
    $.ajax({
      type: 'POST',
      url: '/abstract/reject',
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

  $('#btnAceitou').on("click", function () {

    const idUser = testUser();
    const idArticle = $("#idarticle").text()
    window.location.href = './5-question-answer.html'

  });

  function testUser(){
    const localStorage = window.localStorage
    const idUser = localStorage.getItem('idUser')
    if (idUser==null || idUser.trim().length==0){
      window.location.href = './1-login.html'
      throw new Error('No user found');
    }
    else 
      return idUser;
}
})(jQuery);