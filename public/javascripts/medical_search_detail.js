$(function() {
    var setTable = function(data){
        var $tblDurable = $('#tblDurable_show > tbody');
        $tblDurable.empty();
        var i=0;
        _.forEach(data.rows, function(v){
            i++;
            var html = '<tr> ' +
                '<td> ' + i + ' </td>'+
                '<td> ' + moment(v.receive_date_thai).format('YYYY-MM-DD') +' </td>'+
                '<td>' + v.items_code  + ' </td>'+
                '<td>' + v.type_name  + ' </td>'+
                '<td>' + v.durable_name  + ' </td>'+
                '<td>' + v.price  + ' </td>'+
                '<td>' + v.provide  + ' </td>'+
                '<td>' + v.room_name   + ' </td>'+
                '<td><font color="red">' + v.remark + '</font></td>'+
                '<td> '+
                '<div class="btn-group btn-group-sm" role="group"> '+
                '<button  class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> '+
                '<i class="fa fa-cogs"> </i> </button> '+
                '<ul class="dropdown-menu"> '+
                '<li> '+
                '<a href="#" class="mdlNew" data-action="viwe" data-receive_date="'+ moment(v.receive_date_thai).format('DD/MM/YYYY') +'"  data-remark="'+ v.remark +'" ' +
                'data-type="'+ v.type_name +'" data-durable_name="'+ v.durable_name +'" data-items_code="'+ v.items_code +'" data-spec="'+ v.spec +'" ' +
                'data-provide="'+ v.provide +'" data-price="'+ v.price +'" data-shop_name="'+ v.shop_name +'" data-order_no="'+ v.order_no +'" data-room="'+ v.room_name +'" ' +
                'data-change_room="'+ v.change_room_name  +'" data-distribute_date= "'+ moment(v.distribute_date_thai).format('DD/MM/YYYY')+'" data-status_name="'+ v.status_name +'" data-id="'+ v.id +'") > '+
                '<i class="fa fa-edit"> </i> ดูรายละเอียด </a></li> '+
                '<li> '+
                '<a href="/medical_add_asset/durable_medical_show_edit/'+ v.id +'") > '+
                '<i class="fa fa-edit"> </i> แก้ไข </a></li> '+
                '<li> '+
                '<a href="#" data-action="remove" data-id="'+ v.id +'">'+
                '<i class="fa fa-trash"> </i>ลบ </a></li></ul></div> ';
        html +='<td> '+
                '<div class="btn-group btn-group-sm" role="group"> '+
                '<a class="btn btn-success" type="button" href="/prints/medical/'+ v.id +'" data-toggle="tooltip" data-placement="top" title="ปริ้นเอกสาร"> <i class="fa fa-print"></i></a>';
                '</div></td> ';
            $tblDurable.append(html);
        });
        $('[data-toggle="tooltip"]').tooltip();
    }

    $(document).on('click','a[data-action="viwe"]',function(e){
        e.preventDefault();
        var receive_date = $(this).data('receive_date');
        var type = $(this).data('type');
        var items = $(this).data('durable_name');
        var items_code = $(this).data('items_code');
        var spec = $(this).data('spec');
        var provide = $(this).data('provide');
        var price = $(this).data('price');
        var shop = $(this).data('shop_name');
        var order_no = $(this).data('order_no');
        var room = $(this).data('room');
        var change_room = $(this).data('change_room');
        var remark = $(this).data('remark');
        var status = $(this).data('status_name');
        var distribute_date = $(this).data('distribute_date');
        var id = $(this).data('id');

        $('#txtDate_receive').val(receive_date);
        $('#txtType').val(type);
        $('#txtItems').val(items);
        $('#txtItems_code').val(items_code);
        $('#txtRoom').val(room);
        $('#txtStatus').val(status);
        $('#txtSpec').val(spec);
        $('#txtWheremoney').val(provide);
        $('#txtprice').val(price);
        $('#txtCompany').val(shop);
        $('#txtOrder_no').val(order_no);
        $('#txtChange_room').val(change_room);
        $('#txtRemark').val(remark);
        distribute_date != 'Invalid date' ? $('#txtDistribute_date').val(distribute_date) : $('#txtDistribute_date').val('');
        $('#txtId').val(id);
        $("#mdlNew").modal({
            backdrop:'static',
            keyboard:false
        })
    });

    $('#viwe').on('click',function(e){
        e.preventDefault();
        $("#mdlNew").modal({
            backdrop:'static',
            keyboard:false
        })
    });

    //$('#mdlNew').on('hidden.bs.modal', function (e) {
      //  $('#txtItems').val('');
       // $('#txtItems_code').val('');
       // $('#txtRoom').val('');
       // $('#txtStatus').val('');
       // $('#txtId').val('');// do something...
       // $('#divAlert').fadeOut();
    //});

    $('#btnPrint_items').fadeOut('slow');
    $('#btnPrint_type').fadeOut('slow');
    $('#btnPrint_room').fadeOut('slow');
    $('#btnExport_items_excel').fadeOut('slow');
    $('#btnExport_type_excel').fadeOut('slow');
    $('#btnExport_room_excel').fadeOut('slow');

    $('#btnSearch_items').on('click', function(e){
        e.preventDefault();
        var data = {};
        var items = $('#slItems').val();
        data.items = items;
        if(!data.items) {
            alert('กรุณาเลือกรายการด้วยครับ!!')
        } else {
            console.log(data);
            NProgress.start();
            $.ajax({
                type: "POST",
                url: "/medical_add_asset/durable_search_items",
                contentType: 'application/json',
                data: JSON.stringify(data)
            })
                .success(function(data) {
                    setTable(data);
                    NProgress.done();
                    $('#btnPrint_items').fadeIn('slow');
                    $('#btnExport_items_excel').fadeIn('slow');
                    $('#btnPrint_type').fadeOut('slow');
                    $('#btnPrint_room').fadeOut('slow');
                    $('#btnExport_type_excel').fadeOut('slow');
                    $('#btnExport_room_excel').fadeOut('slow');
                    $('#slType').val('');
                    $('#slRoom').val('');
                })
                .error(function (xhr, status, err) {
                    alert(err);
                })
        }
    });

    $('#btnSearch_type').on('click', function(e){
        e.preventDefault();
        var data = {};
        var type = $('#slType').val();
        data.type = type;
        if(!data.type) {
            alert('กรุณาเลือกประเภทด้วยครับ!!')
        } else {
            console.log(data);
            NProgress.start();
            $.ajax({
                type: "POST",
                url: "/medical_add_asset/durable_search_type",
                contentType: 'application/json',
                data: JSON.stringify(data)
            })
                .success(function(data) {
                    setTable(data);
                    NProgress.done();
                    $('#btnPrint_type').fadeIn('slow');
                    $('#btnPrint_items').fadeOut('slow');
                    $('#btnPrint_room').fadeOut('slow');
                    $('#btnExport_items_excel').fadeOut('slow');
                    $('#btnExport_type_excel').fadeIn('slow');
                    $('#btnExport_room_excel').fadeOut('slow');
                    $('#slItems').val('');
                    $('#slRoom').val('');
                })
                .error(function (xhr, status, err) {
                    alert(err);
                })
        }
    });

    $('#btnSearch_room').on('click', function(e){
        e.preventDefault();
        var data = {};
        var room = $('#slRoom').val();
        data.room = room;
        if(!data.room) {
            alert('กรุณาเลือกประเภทด้วยครับ!!')
        } else {
            console.log(data);
            NProgress.start();
            $.ajax({
                type: "POST",
                url: "/medical_add_asset/durable_search_room",
                contentType: 'application/json',
                data: JSON.stringify(data)
            })
                .success(function(data) {
                    setTable(data);
                    NProgress.done();
                    $('#btnPrint_room').fadeIn('slow');
                    $('#btnPrint_items').fadeOut('slow');
                    $('#btnPrint_type').fadeOut('slow')
                    $('#btnExport_items_excel').fadeOut('slow');
                    $('#btnExport_type_excel').fadeOut('slow');
                    $('#btnExport_room_excel').fadeIn('slow');
                    $('#slItems').val('');
                    $('#slType').val('');
                })
                .error(function (xhr, status, err) {
                    alert(err);
                })
        }
    });

    $('#btnPrint_items').on('click', function(e){
        e.preventDefault();
        var items_print = $('#slItems').val();
        window.open('/prints/report_medical_items/'+items_print)
    });

    $('#btnPrint_type').on('click', function(e){
        e.preventDefault();
        var type_print = $('#slType').val();
        window.open('/prints/report_medical_type/'+type_print)
    });

    $('#btnPrint_room').on('click', function(e){
        e.preventDefault();
        var room_print = $('#slRoom').val();
        window.open('/prints/report_medical_room/'+room_print)
    });

    $('#btnExport_items_excel').on('click', function(e){
        e.preventDefault();
        var items_export = $('#slItems').val();
        window.open('/prints/export_medical_items/'+items_export)
    });

    $('#btnExport_type_excel').on('click', function(e){
        e.preventDefault();
        var type_export = $('#slType').val();
        window.open('/prints/export_medical_type/'+type_export)
    });

    $('#btnExport_room_excel').on('click', function(e){
        e.preventDefault();
        var room_export = $('#slRoom').val();
        window.open('/prints/export_medical_room/'+room_export)
    });

    $(document).on('click','a[data-action="remove"]', function(e){
        e.preventDefault();
        var id = $(this).data('id');
        if(confirm('คุณต้องการลบรายการนี้ ใช่หรือไม่')){
            $.ajax({
                method:'POST',
                url:'/medical_add_asset/remove_medical_items',
                dataType:'json',
                data:{
                    id:id
                }
            })
                .success(function(data){
                    if(data.ok) {
                        alert('ลบเสร็จเรียบร้อยแล้ว');
                        setTable(data);
                    } else {
                        console.log(data.msg);
                        alert('ไม่สามารถลบได้')
                    }
                })
                .error(function(xhr, status, err){
                    console.log(err);
                    alert('กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย')
                })
        }
    });
});