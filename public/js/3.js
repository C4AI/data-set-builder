
(function ($) {
    "use strict";
    $("#btn1").click(function () {
        testcheck();
    });
    $("#inst").show(function () {
        testUser();
    });

    function testcheck() {
        if (!$("#ckb1").is(":checked")) {
            alert("Por favor, você deve confirmar a leitura das instruções antes de iniciar.");
            return;
        }
        window.location.href = './4-abstract.html'
    }
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