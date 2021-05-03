
function testcheck() {
    if (!jQuery("#ckb1").is(":checked")) {
        alert("Por favor, você deve confirmar a leitura das instruções antes de iniciar.");
        return;
    }
    return openAbstract();
}
function openAbstract() {
    window.location.href='./4-abstract.html'
}