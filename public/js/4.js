(function ($) {
  "use strict";
  $(window).one("load", function () {
    const iduser = testUser();
    $.ajax({
      type: 'GET',
      url: '/abstract',
      data: { 'iduser': iduser },
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

    const iduser = testUser();
    const idArticle = $("#idarticle").text()
   
    $.ajax({
      type: 'POST',
      url: '/abstract/reject',
      data: { 'iduser': iduser, 'idArticle': idArticle },
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

    const iduser = testUser();
    const idArticle = $("#idarticle").text()
    window.location.href = './5-question-answer.html'

  });

  function testUser(){
    const localStorage = window.localStorage
    const iduser = localStorage.getItem('iduser')
    if (iduser==null || iduser.trim().length==0){
      window.location.href = './1-login.html'
      throw new Error('No user found');
    }
    else 
      return iduser;
}
})(jQuery);