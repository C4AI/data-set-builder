(function ($) {
  "use strict";

  /*==================================================================
  [ Validate ]*/
  var input = $('.validate-input .input100');

  $('.validate-form').on('submit', function () {
    var check = true;

    for (var i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }

    if (check) {
      validateUser(this)
    }

    return check;
  });


  $('.validate-form .input100').each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });

  function validate(input) {
    if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
      if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
        return false;
      }
    }
    else {
      if ($(input).val().trim() == '') {
        return false;
      }
    }
  }

  function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass('alert-validate');
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
  }

  function validateUser(form) {
    // Get some values from elements on the page:
    var $form = $(form),
      email = $form.find("input[name='email']").val(),
      idUser = $form.find("input[name='idUser']").val(),
      url = "/user"

    $.ajax({
      type: 'GET',
      url: url,
      data: { 'idUser': idUser, 'email': email },
      dataType: 'json',
      success: function (response) {
        console.log(response)
        var rowCount = response.rowCount;
        const localStorage = window.localStorage
        if (rowCount == 1) {
          localStorage.setItem('idUser', idUser)
          localStorage.setItem('email', email)
          window.location.href = './3-instructions.html';
        }
        else {
          window.location.href = './2-user-not-found.html';
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
  }

})(jQuery);