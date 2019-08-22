


$(document).ready(function(){

    var PODocNo = "";
    var Data_tableGood =""
    var ListNo = 0;

    $('#inpPO').focus()
    $('#btnFindSpinner').hide();
    $('#btnCheck').hide();
    $('#btnCancelPO').hide();
    $('#btnFindGood_Spinner').hide();
    $('#frm_Good').hide();
    $('#btnSaveStock_Spinner').hide();
    $('#btnConfirmSpinner').hide();

    
    //alert(x)

    $.ajax({
    	type: 'POST',
        url:"http://192.168.100.31:8080/CheckPO/conn.php",
        success: function(data){
        	console.log(data);
        	$('#CheckConnect').html(data);
            //alert(data)

        },
        error: function(e){
        	console.log(data);
        	$('#CheckConnect').html(e.message);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        	console.log(XMLHttpRequest.responseText +" "+textStatus+" "+errorThrown);
        	$('#CheckConnect').html(XMLHttpRequest.responseText +" "+textStatus+" "+errorThrown);
        }
    });



    $("#btnFind").click(function(){

    	PODocNo = $("#inpPO").val();

    	if(PODocNo == ""){

    		$("#inpPO").focus()

    	}else{

            FindPO();

        }

    });



    CheckIP();

    function CheckIP() {

        $.ajax({
            type: 'POST',
            url:"http://192.168.100.31:8080/CheckPO/query_CheckIP.php",
            success: function(data){
                console.log(data);
                $('#CheckIP').html(data);

            },
            error: function(e){
                console.log(data);
                $('#CheckIP').html(e.message);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {

                console.log(XMLHttpRequest.responseText +" "+textStatus+" "+errorThrown);
                $('#CheckIP').html(XMLHttpRequest.responseText +" "+textStatus+" "+errorThrown);
            }
        });
    }



    function FindPO() {

        $('#btnFindSpinner').show();
        $("#btnFind").prop('disabled', true);

        $.ajax({
            type: "post",
            data: "PODocNo=" + PODocNo,
            url: "http://192.168.100.31:8080/CheckPO/query_checkPO.php",
            success: function(msg) {

                var data = msg.trim();
                var arr = data.split('++--');


                if (msg.trim() == "") {

                    $('#table_data').html("")
                    $.confirm({
                        title: '<strong style="color: red;">แจ้งเตือน</strong>',
                        content: 'ไม่พบเลขที่เอกสาร <strong style="color: red;">' + PODocNo + '</strong>',
                        type: 'red',
                        buttons: {
                            ยืนยัน: {
                                btnClass: 'btn-red',
                                action: function(){

                                    $("#inpPO").val("");
                                    $("#inpPO").focus();

                                }
                            }
                        }
                    });
                    $("#inpPO").select();
                    $('#btnCheck').hide();

                } else if (msg.trim() == "NotCheck") {

                    $.confirm({
                        title: '<strong style="color: #004085;">สถานะ</strong>',
                        content: '<strong style="color: #004085;">' + PODocNo + '</strong> สถานะ <strong style="color: red;">FULL </strong> หรือ <strong style="color: red;">Cancel </strong> แล้ว ไม่สามารถใช้งานได้',
                        type: 'blue',
                        buttons: {
                            ยืนยัน: {
                                btnClass: 'btn-blue',
                                action: function(){

                                    $("#inpPO").val("");
                                    $("#inpPO").focus();

                                }
                            }
                        }
                    });

                } else if (msg.trim() == "NotAppv") {

                    $.confirm({
                        title: '<strong style="color: #004085;">สถานะ</strong>',
                        content: '<strong style="color: #004085;">' + PODocNo + '</strong> ยังไม่ได้อนุมัติ PO',
                        type: 'blue',
                        buttons: {
                            ยืนยัน: {
                                btnClass: 'btn-blue',
                                action: function(){

                                    $("#inpPO").val("");
                                    $("#inpPO").focus();

                                }
                            }
                        }
                    });


                } else if (arr[0] == "PODup") {

                    $.confirm({
                        title: '<strong style="color: #004085;">สถานะ</strong>',
                        content: '<strong style="color: #004085;">' + PODocNo + '</strong> ทำการบันทึกไปแล้ว ต้องการบันทึกซ้ำหรือไม่ ?',
                        type: 'blue',
                        buttons: {
                            ยกเลิก: function() {

                                $("#inpPO").val("");
                                $("#inpPO").focus();


                            },
                            ยืนยัน: {
                                btnClass: 'btn-blue',
                                action: function(){

                                    $('#table_data').html(arr[1]);

                                    var row_tablePO = $('#table_data tr').length;
                                    $('#btnCheck').html("ดำเนินการ เช็คสินค้า (" + row_tablePO + ")");
                                    $('#btnCheck').show();
                                    $('#btnCancelPO').show();

                                }
                            }

                        }
                    });


                } else {

                    var msg = msg.trim();
                    $('#table_data').html(msg);

                    var row_tablePO = $('#table_data tr').length;
                    $('#btnCheck').html("ดำเนินการ เช็คสินค้า (" + row_tablePO + ")");
                    $('#btnCheck').show();
                    $('#btnCancelPO').show();

                }
            },
            complete: function() {

                $('#btnFindSpinner').hide();
                $("#btnFind").prop('disabled', false);

            }
        });
}



$("#btnCheck").click(function(){

    $('#header_frmgood').html(PODocNo);
    $('#frm_PO').hide();
    $('#tablePO').hide();
    $('#btnCheck').hide();
    $('#btnCancelPO').hide();
    $('#inpPO').prop('disabled', true);
    $('#btnFind').prop('disabled', true);
    $('#frm_Good').show();
    $('#inpStock').prop('disabled', true);
    $('#btnSaveStock').prop('disabled', true);
    $('#inpGoodCode').select();

});



$("#btnFindGood").click(function(e) {

    e.preventDefault();
    var inpGoodCode = $("#inpGoodCode").val();
        //FindGood(inpGoodCode);



        var myarray = [];
        /* ดึงรหัสสินค้าที่ยิงไปแล้ว เข้า Array*/
        $('.td_GoodCode').each(function(){

            myarray.push($(this).text().trim());

        });

        /* Check ว่ารหัสสแกนไปแล้วหรือยัง */
        if(jQuery.inArray(inpGoodCode, myarray) !== -1){

            $.confirm({
                title: '<strong style="color: red;">สินค้าซ้ำ</strong>',
                content: 'รหัสสินค้า <strong style="color: red;">' + inpGoodCode + '</strong> ถูกสแกนแล้ว ต้องการสแกนซ้ำหรือไม่',
                type: 'red',
                buttons: {
                    ยกเลิก: function () {


                        $('#inpGoodCode').select();

                    },
                    ยืนยัน: {
                        btnClass: 'btn-red',
                        action: function(){

                            FindGood(inpGoodCode);

                        }
                    }
                }
            });

        }else{

            FindGood(inpGoodCode);

        }


    });


function CheckGoodDup(Goodcode) {


    $('.td_GoodCode').each(function(){
        //alert($(this).text().trim());
        if($(this).text().trim() == Goodcode){

            alert("True")
            return true;

        }else{

            alert("False")
            return false;

        }
    });

}




$("#modalCheckGood").on('shown.bs.modal', function(){

    $(this).find('input[type="number"]').select();

});



function FindGood(inpGoodCode) {


    $('#btnFindGood_Spinner').show();
    $("#btnConfirm").prop('disabled', true);

    $.ajax({
        type: "post",
        data: "inpGoodCode=" + inpGoodCode + "&PODocNo=" + PODocNo+ "&ListNo=" + ListNo,
        url: "http://192.168.100.31:8080/CheckPO/query_checkGood.php",
        success: function(msg) {
            if (msg.trim() == "") {

                $.confirm({
                    title: '<strong style="color: orange;">แจ้งเตือน</strong>',
                    content: 'ไม่พบข้อมูล <strong style="color: orange;">' + inpGoodCode + '</strong> อาจรับไปแล้ว หรือไม่ได้อยู่ใน <strong style="color: orange;">' + PODocNo + '</strong>',
                    type: 'orange',
                    buttons: {
                        ยืนยัน: {
                            btnClass: 'btn-orange',
                            action: function(){


                            }
                        }
                    }
                });


            } else {

                var msg = msg.trim();
                $('#bodyCheckGood').html(msg);
                $('#modalCheckGood').modal('show');


            }
        },
        complete: function() {

            $('#btnFindGood_Spinner').hide();
            $("#btnConfirm").prop('disabled', false);
            $("#inpGoodCode").select();
                //$("#modal_Count").select();

            }
        });

}




var touchtime = 0;
$("#table_data_Good").on("click", "tr", function() {

    if (touchtime == 0) {

        touchtime = new Date().getTime();

    } else {
        if (((new Date().getTime()) - touchtime) < 300) {

            var getGood = $(this).find(".td_GoodCode").html();
            var rowDel = $(this).attr('id');


            $.confirm({
                title: '<strong style="color: red;">ลบรายการ</strong>',
                content: 'คุณต้องการลบ <strong style="color: red;">'+getGood+'</strong> ออกจากรายการหรือไม่ ?',
                type: 'red',
                buttons: {

                    ยกเลิก: function () {

                    },
                    ยืนยัน: {
                        btnClass: 'btn-red',
                        action: function(){

                            var re_row = rowDel.replace("row",",");
                            var re_ListNo = ListNo.replace(re_row,"")

                            //alert(ListNo +" - "+ re_row + " = " + re_ListNo);

                            // replace เอาลำดับที่ลบรายการออก
                            ListNo = re_ListNo;
                            $('#'+rowDel).remove();

                        }
                    }
                }
            });

            touchtime = 0;


        } else {

            touchtime = new Date().getTime();

        }
    }

});




var touchtime_ClearGoods = 0;
$("#inpGoodCode").on("click", function() {

    if (touchtime_ClearGoods == 0) {

        touchtime_ClearGoods = new Date().getTime();

    } else {
        if (((new Date().getTime()) - touchtime_ClearGoods) < 300) {

            //alert("Click Input Goods");
            $('#inpGoodCode').val("");
            touchtime_ClearGoods = 0;


        } else {

            touchtime_ClearGoods = new Date().getTime();

        }
    }

});



var touchtime_ClearPO = 0;
$("#inpPO").on("click", function() {

    if (touchtime_ClearPO == 0) {

        touchtime_ClearPO = new Date().getTime();

    } else {
        if (((new Date().getTime()) - touchtime_ClearPO) < 300) {

            //alert("Click Input Goods");
            $('#inpPO').val("");
            touchtime_ClearPO = 0;


        } else {

            touchtime_ClearPO = new Date().getTime();

        }
    }

});






var Count = 0;
$("#btnConfirm").click(function(){

    var Savecount = $('#modal_Count').val();
    var GoodRemaQty2 = $("#Detail").attr("GoodRemaQty2").trim();
    ListNo += ","+$("#Detail").attr("ListNo").trim();

    //alert(GoodRemaQty2)

    if(Savecount == "" || Savecount == null || Savecount < 0 || Savecount == 0){

        $.confirm({
            title: '<strong style="color: red;">ค่าว่าง</strong>',
            content: 'จำนวนสินค้าเป็นค่าว่าง หรือน้อยกว่า 0 กรุณาใส่จำนวน มากกว่า 0',
            type: 'red',
            buttons: {
                ยืนยัน: {
                    btnClass: 'btn-red',
                    action: function(){

                        $('#modal_Count').select();

                    }
                }
            }
        });

    }else if (Savecount > 50000){

        $.confirm({
            title: '<strong style="color: red;">จำนวนมาก</strong>',
            content: 'จำนวนสินค้าคุณมากเกินไป <strong style="color: red;">'+Savecount+'</strong> กรุณาตรวจสอบจำนวนใหม่อีกครั้ง',
            type: 'red',
            buttons: {
                ยืนยัน: {
                    btnClass: 'btn-red',
                    action: function(){

                        $('#modal_Count').focus();

                    }
                }
            }
        });

    }else{


        GoodRemaQty2 = parseFloat(Math.round(GoodRemaQty2 * 100) / 100).toFixed(2);
        Savecount = parseFloat(Math.round(Savecount * 100) / 100).toFixed(2);

        //alert(parseFloat(GoodRemaQty2) +" : "+ parseFloat(Savecount))

        if(parseFloat(GoodRemaQty2) < parseFloat(Savecount)){

            //alert(GoodRemaQty2+" : "+Savecount)
            //alert("จำนวนต้องไม่เกิน จำนวนที่สั่ง")

            $.confirm({
                title: '<strong style="color: orange;">ไม่สามารถบันทึก</strong>',
                content: 'จำนวนที่คุณกรอก มากกว่าจำนวนที่สั่ง ไม่สมารถรับสินค้า(RE) มากกว่าสั่งซื้อ(POA)',
                type: 'orange',
                buttons: {
                    ยืนยัน: {
                        btnClass: 'btn-orange',
                        action: function(){

                            $('#modal_Count').select();

                        }
                    }
                }
            });


        }else if(GoodRemaQty2 != Savecount){

            //alert("ไม่ตรงกัน")
            $.confirm({
                title: '<strong style="color: orange;">ดำเนินการต่อ ?</strong>',
                content: 'จำนวนที่คุณกรอก ไม่ตรงกับจำนวนสั่งซื้อ คุณต้องการดำเนินการต่อหรือไม่',
                type: 'orange',
                buttons: {
                    ยกเลิก: function () {

                        $('#modal_Count').select();

                    },
                    ยืนยัน: {
                        btnClass: 'btn-orange',
                        action: function(){

                            setListTable()

                        }
                    }
                }
            });

        }else{

            //alert("ตรงกัน")
            setListTable()

        }

    }

});



function setListTable() {


    $('#modalCheckGood').modal('hide');
    $('#inpGoodCode').val("");
    $('#inpGoodCode').select();
    var NameCode = $('#modal_GoodName').html();
    var ListNoInsert = $("#Detail").attr("ListNo").trim();

    //alert(ListNoInsert);

    Count = Count + 1;

    Data_tableGood += "<tr id = 'row"+Count+"'>"
    Data_tableGood += "<td style='padding: .40rem;' class = 'td_GoodCode' Value = '"+ListNoInsert+"'>" + $('#modal_GoodCode').html() + "</td>"
    Data_tableGood += "<td style='padding: .40rem;' class = 'td_GoodName' Value = '"+NameCode+"'>" + NameCode.substring(0,4) + "</td>"
    Data_tableGood += "<td style='padding: .40rem;' class = 'td_Inv' >" + $('#modal_Inv').html() + "</td>"
    Data_tableGood += "<td style='padding: .40rem;' class = 'td_Loca'>" + $('#modal_Loca').html() + "</td>"
    Data_tableGood += "<td style='padding: .40rem;' class = 'td_Unit'>" + $('#modal_Unit').html() + "</td>"
    Data_tableGood += "<td style='padding: .40rem;' class = 'td_Count' align='right'>" + $('#modal_Count').val() + "</td>"
    Data_tableGood += "</tr>"

    $('#table_data_Good').append(Data_tableGood);
    Data_tableGood = null;

}




function setData_Insert() {

    var item_GoodCode = [];
    var item_GoodName = [];
    var item_Goodunit = [];
    var item_Inv = [];
    var item_Loca = [];
    var item_Qty = [];
    var item_ListNo = [];

    var BrchID = $("#Detail").attr("BrchID").trim()
    var VendorCode = $("#Detail").attr("VendorCode").trim()
    var VendorName = $("#Detail").attr("VendorName").trim()
    var POID = $("#Detail").attr("POID").trim()


    $('.td_GoodCode').each(function(){
        item_GoodCode.push($(this).text().trim());
    });
    $('.td_GoodName').each(function(){
        item_GoodName.push($(this).attr("Value").trim());
    });
    $('.td_Unit').each(function(){
        item_Goodunit.push($(this).text().trim());
    });
    $('.td_Inv').each(function(){
        item_Inv.push($(this).text().trim());
    });
    $('.td_Loca').each(function(){
        item_Loca.push($(this).text().trim());
    });
    $('.td_Count').each(function(){
        item_Qty.push($(this).text().trim());
    });    
    // ฝาก ListNo ไว้ที่ td_GoodCode ในค่าของ Value
    $('.td_GoodCode').each(function(){
        item_ListNo.push($(this).attr("Value").trim());
    });



    $.ajax({

        url: 'http://192.168.100.31:8080/CheckPO/query_insert.php',
        type: 'post',
        data: {item_GoodCode: item_GoodCode ,item_GoodName: item_GoodName ,item_Goodunit: item_Goodunit ,item_Inv: item_Inv ,item_Loca: item_Loca ,item_Qty: item_Qty ,PODocNo: PODocNo,BrchID: BrchID,VendorCode: VendorCode,VendorName: VendorName,POID: POID,item_ListNo: item_ListNo},

        success:function(data){

            if(data.trim() == "Insert Successfully"){

                window.location = "index.html";

            }else{

                alert(data.trim());

            }

        }

    });


}


$("#btnClose").click(function(){

    $("#inpGoodCode").select();

});


$("#btnSave").click(function(e){

    e.preventDefault();
    var DataGood = $('#table_data_Good').html();


    if(DataGood.trim() == ""){

        $.confirm({
            title: '<strong style="color: orange;">ไม่พบข้อมูล</strong>',
            content: 'ข้อมูลเป็นค่าว่าง ไม่สามารถบันทึกบิลได้',
            type: 'orange',
            buttons: {
                ยืนยัน: {
                    btnClass: 'btn-orange',
                    action: function(){

                        // Focus ใช้งานไม่ได้
                        //$("#inpGoodCode").select();


                    }
                }
            }
        });


    }else{


        $.confirm({
            title: '<strong style="color: green;">บันทึกข้อมูล</strong>',
            content: 'คุณต้องการบันทึก บิลใช่หรือไม่',
            type: 'green',
            buttons: {
                ยกเลิก: function () {

                },
                ยืนยัน: {
                    btnClass: 'btn-green',
                    action: function(){

                        setData_Insert();

                    }
                }
            }
        });

    }


});



$("#btnCancel").click(function(){

    $.confirm({
        title: '<strong style="color: red;">ยกเลิก</strong>',
        content: 'คุณต้องการ ยกเลิก เอกสารนี้หรือไม่',
        type: 'red',
        buttons: {
            ยกเลิก: function () {

            },
            ยืนยัน: {
                btnClass: 'btn-red',
                action: function(){

                    window.location = "index.html";

                }
            }
        }
    });

});



$("#btnCancelPO").click(function(){

    $.confirm({
        title: '<strong style="color: red;">ยกเลิก</strong>',
        content: 'คุณต้องการ ยกเลิก เอกสารนี้หรือไม่',
        type: 'red',
        buttons: {
            ยกเลิก: function () {

            },
            ยืนยัน: {
                btnClass: 'btn-red',
                action: function(){

                    window.location = "index.html";

                }
            }
        }
    });

});


$("#btnCancelGood").click(function(){

    $("#inpGoodCode").select();

});











});