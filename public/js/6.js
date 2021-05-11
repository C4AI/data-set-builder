(function ($) {
  "use strict";
  const score = 15;
  $(window).one("load", function () {
    const iduser = testUser();
    $.ajax({
      type: 'GET',
      url: '/user/review',
      data: {'iduser': iduser},
      dataType: 'json',
      tryCount : 0,
      retryLimit : 3,
      success: function (response) {
        console.log(response)
        const {
          email,
          sumview,
          sumskip,
          sumreject,
          sumanswer,
          sumscore
        } = response.rows[0];

        $("#iduser").empty()   .append(iduser);
        $("#email").empty()    .append(email);
        $("#sumview").empty()  .append(sumview);
        $("#sumskip").empty()  .append(sumskip);
        $("#sumreject").empty().append(sumreject);
        $("#sumanswer").empty().append(sumanswer);
        $("#sumscore").empty().append(sumscore);
        $("#score").empty().append(" / " + score);

      },
      error : function(jqXHR, xhr, textStatus, errorThrown ) {
        if (textStatus !== '') {
          this.tryCount++;
          if (this.tryCount <= this.retryLimit) {
            //try again
            $.ajax(this);
            return;
          }
          return;
        }
        if (xhr.status === 500) {
          //handle error
          console.log(textStatus, errorThrown);

        } else {
          console.log(textStatus, errorThrown);
        }
      }
    });

    $.ajax({
      type: 'GET',
      url: '/question-answer/article/all',
      data: {'iduser': iduser},
      dataType: 'json',
      tryCount : 0,
      retryLimit : 3,
      success: function (response) {
        console.log(response)
        $('#idarticle').empty();
        $.each(response.rows, function (index, element) {
          $('#idarticle').append($('<option/>', {
            value: element.idarticle,
            text : element.title
          }));
        });
        $('#idarticle').trigger("change");
      },
    error : function(jqXHR, xhr, textStatus, errorThrown ) {
        if (textStatus !== '') {
          this.tryCount++;
          if (this.tryCount <= this.retryLimit) {
            //try again
            $.ajax(this);
            return;
          }
          return;
        }
        if (xhr.status === 500) {
          //handle error
          console.log(textStatus, errorThrown);

        } else {
          console.log(textStatus, errorThrown);
        }
      }
    });

  });

  $(window).ajaxComplete(function () {
        const sumscore =  parseInt($("#sumscore").text());
        if(sumscore>=score){
          $("#btnContinuar").empty().append("Finalizar tarefa");
        }
  });

  $('#idarticle').on("change", function () {
    const iduser = testUser();

    $.ajax({
      type: 'GET',
      url: '/question-answer/article',
      data: {'iduser': iduser, 'idarticle': this.value},
      dataType: 'json',
      tryCount : 0,
      retryLimit : 3,
      success: function (response) {
        console.log(response)

        $('#idqa').empty();
        $.each(response.rows, function (index, element) {
          $('#idqa').append($('<option/>', {
            value: element.idqa,
            text : index+1
          }));
        });

      },
      error : function(jqXHR, xhr, textStatus, errorThrown ) {
        if (textStatus !== '') {
          this.tryCount++;
          if (this.tryCount <= this.retryLimit) {
            //try again
            $.ajax(this);
            return;
          }
          return;
        }
        if (xhr.status === 500) {
          //handle error
          console.log(textStatus, errorThrown);

        } else {
          console.log(textStatus, errorThrown);
        }
      }
    });
  });

  $('#btnEdit').on("click", function () {

    const idarticle = $("#idarticle").val()
    const idqa = $("#idqa").val()

    window.location.href =
        "7-question-answer-edit.html?idarticle="+ idarticle +"&idqa="+ idqa;
  });


  function testUser(){
    const localStorage = window.localStorage
    const iduser = localStorage.getItem('iduser')
    if (iduser==null || iduser.trim().length===0){
      window.location.href = './1-login.html'
      throw new Error('No user found');
    }
    else
      return iduser;
  }

})(jQuery);