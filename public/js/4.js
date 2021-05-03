(function ($) {
  "use strict";
  $("#main").show(function () {
    const idUser = testUser();
    $.ajax({
      type: 'GET',
      url: '/abstract',
      data: { 'idUser': idUser },
      dataType: 'json',
      success: function (response) {
        console.log(response)
        const { idabstract, abstract } = response.rows[0];
        $("#idabstract").empty().append(idabstract);
        $("#abstract").empty().append(abstract);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
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