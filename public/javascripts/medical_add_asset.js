$(function() {

    $('#divItems_code').fadeOut();
    $('#SlItems').on('change', function (e) {
        $('#txtItems_code').val('');
        //   console.log($(this).val());
        var id = $(this).val();
        if (id) {
            $.ajax({
                url: '/medical_add_asset/code_items',
                method: 'POST',
                data: {id: id}
            })
                .success(function (data) {
                    var $text_code = $('#txtItems_code');
                    $text_code.empty();
                    _.forEach(data.rows, function (v) {
                    $text_code.val(v.code);
                    });
                    $('#divItems_code').fadeIn();
                })
                .error(function (xhr, status, err) {
                })
        } else {
            alert('กรุณาเลือกรายการครุภัณฑ์');
        }
    });

    $('#btnSave').on('click', function(e){
        var data = {};
        data.receive_date = $('#txtDate_receive').val();
        data.durable_type= $('#SlType').val();
        data.durable_items = $('#SlItems').val();
        data.pieces = $('#txtPieces').val();
        data.spec = $('#txtSpec').val();
        data.price = $('#txtPrice').val();
        data.company= $('#SlCompany').val();
        data.wheremoney = $('#SlWheremoney').val();
        data.order_no = $('#txtOrder_no').val();
        data.room = $('#SlRoom').val();
        data.change_room = $('#SlChange_room').val();
        data.remark = $('#txtRemark').val();
        data.status = $('#SlStatus').val();
        console.log(data);
        if (!data.receive_date){
            alert('เลือกวันที่รับด้วยครับ !!');
        } else if (!data.durable_type){
            alert('เลือกประเภทครุภัณฑ์ด้วยครับ !!');
        } else if (!data.durable_items){
            alert('เลือกรายการครุภัณฑ์ด้วยครับ !!');
        } else if (!data.pieces){
            alert('ระบุจำนวนชิ้นครุภัณฑ์ด้วยครับ !!');
        } else if (!data.price){
            alert('ระบุราคาครุภัณฑ์ด้วยครับ !!');
        } else if (!data.wheremoney){
            alert('เลือกวิธีการได้มาครุภัณฑ์ด้วยครับ !!');
        } else if (!data.order_no){
            alert('ระบุเลขที่ใบสั่งซื้อครุภัณฑ์ด้วยครับ !!');
        } else if (!data.company){
            alert('เลือกบริษัทจัดจำหน่ายด้วยครับ !!');
        } else if (!data.room){
            alert('ระบุห้องที่ใช้งานด้วยครับ !!');
        } else if (!data.status){
            alert('เลือกสถานะครุภัณฑ์ด้วยครับ !!');
        } else {
            if (confirm('คุณต้องการบันทึกรายการนี้ ใช่หรือไม่')) {
            $.ajax({
                type: "POST",
                url: "/medical_add_asset/save_durable_medical",
                contentType: 'application/json',
                data:JSON.stringify({data: data})
            })
                .success(function(data) {
                    if(data.ok) {
                        alert('บันทึกข้อมูลเรียบร้อยแล้ว');
                        window.location.href = "/medical_add_asset/medical_add_asset";
                    } else {
                        console.log(data.msg);
                        alert('ข้อมูลรหัสครุภัณฑ์ซ้ำครับ');
                    }
                })
                .error(function (xhr, status, err) {
                    console.log(err);
                    alert(err);
                })
        }}
    })
});