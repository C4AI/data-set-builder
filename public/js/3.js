
(function ($) {
    "use strict";
    $("#btn1").click(function () {
         testcheck();
    });

    function testcheck() {
        if (!$("#ckb1").is(":checked")) {
            alert("Por favor, você deve confirmar a leitura das instruções antes de iniciar.");
            return;
        }
        return openAbstract();
    }
    function openAbstract() {
        window.location.href = './4-abstract.html'
    }

})(jQuery);