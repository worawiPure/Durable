$(function() {

    if ( $('#SlStatus').val() == 4 ) {
        $('#divDate_distribute').fadeIn();
    }  else {
        $('#divDate_distribute').fadeOut();
    }

    $('#SlStatus').on('change', function (e) {
        var id = $(this).val();
        if (id == 4){
            $('#divDate_distribute').fadeIn();
        } else {
            $('#divDate_distribute').fadeOut();
            $('#txtdistribute_date').val('');
        }
    });

    $('#btnEdit').on('click', function(e){
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
        data.distribute_date = $('#txtdistribute_date').val();
        data.status = $('#SlStatus').val();
        data.change_room = $('#SlChange_room').val();
        data.remark = $('#txtRemark').val();
        data.id = $('#txtId').val();
        console.log(data);
        if (!data.receive_date){
            alert('เลือกวันที่รับด้วยครับ !!');
        } else if (!data.durable_type){
            alert('เลือกประเภทครุภัณฑ์ด้วยครับ !!');
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
            if (confirm('คุณต้องการแก้ไขรายการนี้ ใช่หรือไม่')) {
            $.ajax({
                type: "POST",
                url: "/medical_add_asset/edit_medical_durable",
                contentType: 'application/json',
                data:JSON.stringify({data: data})
            })
                .success(function() {
                    alert('ปรับปรุงข้อมูลเรียบร้อยแล้ว');
                    window.location.href = "/medical_add_asset/show_detail";
                })
                .error(function (xhr, status, err) {
                    console.log(err);
                    alert(err);
                })
        }
    }})
});