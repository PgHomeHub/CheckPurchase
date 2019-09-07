


$(document).ready(function(){


    $.ajax({
        type: "post",
        //data: "inpGoodCode=" + inpGoodCode + "&PODocNo=" + PODocNo+ "&ListNo=" + ListNo,
        url:"http://192.168.100.31:8080/CheckPO/index.html",
        success: function(msg) {
            if (msg.trim() == "") {

                alert("Null");


            } else {

                var msg = msg.trim();
                $("#page-top").html(msg);
                //alert(msg);

            }
        }
    });



});