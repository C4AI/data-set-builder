(function ($) {
  "use strict";
  $(window).one("load", function () {
    const iduser = testUser();
    const localStorage = window.localStorage
    $.ajax({
      type: 'GET',
      url: '/abstract',
      data: {'iduser': iduser},
      dataType: 'json',
      success: function (response) {
        console.log(response)
        const {abstract, idarticle, nquestions} = response.rows[0];
        $("#idarticle").empty().append(idarticle);
        $("#abstract").empty().append(abstract);
        $("#nquestions").empty().append(nquestions);
        localStorage.setItem('idarticle', response.rows[0].idarticle);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
  });
/**
  $(window).ajaxComplete (function () {
    const localStorage = window.localStorage
    const iduser = testUser();
    const idarticle = localStorage.getItem('idarticle')

    $.ajax({
      type: 'GET',
      url: '/question-answer/count',
      data: { 'iduser': iduser, 'idarticle': idarticle },
      dataType: 'json',
      success: function (response) {
        console.log(response)
        const { nquestions } = parseInt( response.rows[0].nquestions);
        $("#nquestions").empty().append(nquestions+1);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
  }); 
**/
  $('#btnEnviar').on("click", function () {

    const iduser = testUser();
    const idarticle = $("#idarticle").text()
    const questionen   = $("#questionen").val()
    const answeren     = $("#answeren").val()
    const questionpt   = $("#questionpt").val()
    const answerpt     = $("#answerpt").val()    
    
    $.ajax({
      type: 'POST',
      url: '/question-answer/',
      data: {
        'iduser':iduser,                 
        'idarticle':idarticle,        
        'questionen':questionen,       
        'answeren':answeren,      
        'questionpt':questionpt,      
        'answerpt':answerpt     
      },
      dataType: 'json',
      success: function (response) {
        console.log(response)
        window.location.href = './6-user.html'
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
  });

  $('#btnPular').on("click", function () {

    const iduser = testUser();
    const idArticle = $("#idarticle").text()

    $.ajax({
      type: 'POST',
      url: '/abstract/skip',
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