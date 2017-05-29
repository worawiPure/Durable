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
                //'<td>' + v.type_name  + ' </td>'+
                '<td>' + v.durable_name  + ' </td>'+
                '<td>' + v.spec  + ' </td>'+
                '<td>' + v.price  + ' </td>'+
                //'<td>' + v.provide  + ' </td>'+
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
                '<a href="#" class="Edit" data-action="edit" data-receive_date2="'+ moment(v.receive_date_thai).format('DD/MM/YYYY') +'"  data-remark2="'+ v.remark +'" ' +
                'data-durable_name="'+ v.durable_name +'" data-items_code2="'+ v.code +'" data-pieces2="'+ v.pieces +'" data-spec2="'+ v.spec +'" ' +
                'data-provide2="'+ v.wheremoney +'" data-price2="'+ v.price +'" data-shop2="'+ v.company +'" data-order_no2="'+ v.order_no +'" data-room2="'+ v.room +'" ' +
                'data-change_room2="'+ v.change_room  +'" data-distribute_date2= "'+ moment(v.distribute_date).format('DD/MM/YYYY')+'" data-status2="'+ v.status +'" ' +
                'data-durable_type2="'+ v.durable_type +'" data-durable_items2="'+ v.durable_items +'" data-id="'+ v.id +'") > '+
                '<i class="fa fa-edit"> </i> แก้ไข </a></li> '+
                '<li> '+
                //'<a href="/medical_add_asset/durable_medical_show_edit/'+ v.id +'") > '+
                //'<i class="fa fa-edit"> </i> แก้ไข </a></li> '+
                //'<li> '+
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

    if ( $('#txtStatus2').val() == 2 ) {
        $('#divDate_distribute2').fadeIn();
    }  else {
        $('#divDate_distribute2').fadeOut();
    }
    $('#txtStatus2').on('change', function (e) {
        var id = $(this).val();
        if (id == 2){
            $('#divDate_distribute2').fadeIn();
        } else {
            $('#divDate_distribute2').fadeOut();
            $('#txtdistribute_date2').val('');
        }
    });

    $(document).on('click','a[data-action="edit"]',function(e){
        e.preventDefault();
        var receive_date2 = $(this).data('receive_date2');
        var durable_type2 = $(this).data('durable_type2');
        var durable_items2 = $(this).data('durable_items2');
        var items_code2 = $(this).data('items_code2');
        var room2 = $(this).data('room2');
        var pieces2 = $(this).data('pieces2');
        var shop2 = $(this).data('shop2');
        var provide2 = $(this).data('provide2');
        var spec2 = $(this).data('spec2');
        var price2 = $(this).data('price2');
        var order_no2 = $(this).data('order_no2');
        var change_room2 = $(this).data('change_room2');
        var remark2 = $(this).data('remark2');
        var status2 = $(this).data('status2');
        var distribute_date2 = $(this).data('distribute_date2');
        var id = $(this).data('id');

        $('#txtDate_receive2').val(receive_date2);
        $('#txtType2').val(durable_type2);
        $('#txtItems2').val(durable_items2);
        $('#txtItems_code2').val(items_code2);
        $('#txtRoom2').val(room2);
        $('#txtPieces2').val(pieces2);
        $('#txtCompany2').val(shop2);
        $('#txtWheremoney2').val(provide2);
        $('#txtStatus2').val(status2);
        $('#txtSpec2').val(spec2);
        $('#txtprice2').val(price2);
        $('#txtOrder_no2').val(order_no2);
        $('#txtChange_room2').val(change_room2);
        $('#txtRemark2').val(remark2);
        distribute_date2 != 'Invalid date' ? $('#txtDistribute_date2').val(distribute_date2) : $('#txtDistribute_date2').val('');
        $('#txtId').val(id);
        $("#Edit").modal({
            backdrop:'static',
            keyboard:false
        })
    });
    $('#edit').on('click',function(e){
        e.preventDefault();
        $("#Edit").modal({
            backdrop:'static',
            keyboard:false
        })
    });

    $('#Edit').on('hidden.bs.modal', function (e) {
        $('#txtDate_receive2').val('');
        $('#txtType2').val('');
        $('#txtItems2').val('');
        $('#txtItems_code2').val('');
        $('#txtRoom2').val('');
        $('#txtPieces2').val('');
        $('#txtCompany2').val('');
        $('#txtWheremoney2').val('');
        $('#txtStatus2').val('');
        $('#txtSpec2').val('');
        $('#txtprice2').val('');
        $('#txtOrder_no2').val('');
        $('#txtChange_room2').val('');
        $('#txtRemark2').val('');
        $('#txtDistribute_date2').val('');
        if ( $('#txtStatus2').val() != 2 ) {
            $('#divDate_distribute2').fadeOut();
        }  else {
            $('#divDate_distribute2').fadeIn();
        }
    });

    $('#btnPrint_items').fadeOut('slow');
    $('#btnPrint_type').fadeOut('slow');
    $('#btnPrint_room').fadeOut('slow');
    $('#btnExport_items_excel').fadeOut('slow');
    $('#btnExport_type_excel').fadeOut('slow');
    $('#btnExport_room_excel').fadeOut('slow');

    $('#btnSearch_items').on('click', function(e){
        e.preventDefault();
        var data = {};
        //var items = $('#slItems').val();
        var data_items = $("#SlItems").select2('data');
        var items = data_items[0].id;
        data.items = items;
        if(!data.items) {
            alert('กรุณาเลือกรายการด้วยครับ!!')
        } else {
            console.log(data);
            NProgress.start();
            $.ajax({
                type: "POST",
                url: "/medical_add_asset/durable_search_items_worn-out",
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
                url: "/medical_add_asset/durable_search_type_worn-out",
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
                    $("#SlItems").val('').trigger('change');
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
                url: "/medical_add_asset/durable_search_room_worn-out",
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
                    $("#SlItems").val('').trigger('change');
                    $('#slType').val('');
                })
                .error(function (xhr, status, err) {
                    alert(err);
                })
        }
    });

    $('#btnPrint_items').on('click', function(e){
        e.preventDefault();
        //var items_print = $('#slItems').val();
        var data_items = $("#SlItems").select2('data');
        var items_print = data_items[0].id;
        window.open('/prints/report_medical_items_worn-out/'+items_print)
    });

    $('#btnPrint_type').on('click', function(e){
        e.preventDefault();
        var type_print = $('#slType').val();
        window.open('/prints/report_medical_type_worn-out/'+type_print)
    });

    $('#btnPrint_room').on('click', function(e){
        e.preventDefault();
        var room_print = $('#slRoom').val();
        window.open('/prints/report_medical_room_worn-out/'+room_print)
    });

    $('#btnExport_items_excel').on('click', function(e){
        e.preventDefault();
       // var items_export = $('#slItems').val();
        var data_items = $("#SlItems").select2('data');
        var items_export = data_items[0].id;
        window.open('/prints/export_medical_items_worn-out/'+items_export)
    });

    $('#btnExport_type_excel').on('click', function(e){
        e.preventDefault();
        var type_export = $('#slType').val();
        window.open('/prints/export_medical_type_worn-out/'+type_export)
    });

    $('#btnExport_room_excel').on('click', function(e){
        e.preventDefault();
        var room_export = $('#slRoom').val();
        window.open('/prints/export_medical_room_worn-out/'+room_export)
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

    $('#btnEdit').on('click', function(e){
        var data = {};
        var date_receive = $('#txtDate_receive2').val();
        var year_recevie = moment(date_receive, 'DD/MM/YYYY').format('YYYY') - 543;
        data.receive_date = year_recevie + moment(date_receive, 'DD/MM/YYYY').format('-MM-DD');
        data.durable_type= $('#txtType2').val();
        data.durable_items = $('#txtItems2').val();
        data.pieces = $('#txtPieces2').val();
        data.spec = $('#txtSpec2').val();
        data.price = $('#txtprice2').val();
        data.company= $('#txtCompany2').val();
        data.wheremoney = $('#txtWheremoney2').val();
        data.order_no = $('#txtOrder_no2').val();
        data.room = $('#txtRoom2').val();
        data.status = $('#txtStatus2').val();
        data.distribute_date = $('#txtdistribute_date2').val();
        data.change_room = $('#txtChange_room2').val();
        data.remark = $('#txtRemark2').val();
        data.id = $('#txtId').val();
        console.log(data);
        if (!data.receive_date){
            alert('เลือกวันที่รับด้วยครับ !!');
        } else if (!data.durable_type){
            alert('เลือกประเภทครุภัณฑ์ด้วยครับ !!');
        } else if (!data.pieces){
            alert('ระบุจำนวนชิ้นด้วยครับ');
        } else if (!data.price){
            alert('ระบุราคาครุภัณฑ์ด้วยครับ !!');
        } else if (!data.wheremoney){
            alert('เลือกวิธีการได้มาครุภัณฑ์ด้วยครับ !!');
        } else if (!data.company){
            alert('เลือกบริษัทจัดจำหน่ายด้วยครับ !!');
        } else if (!data.room){
            alert('ระบุห้องที่ใช้งานด้วยครับ !!');
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
                        $('#Edit').modal('hide');
                    })
                    .error(function (xhr, status, err) {
                        console.log(err);
                        alert(err);
                    })
            }
        }});

    $("#SlItems").select2({
        ajax: {
            url: "/medical_add_asset/select2_items",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    term: params.term, // search term
                    page: params.page
                };
            },
            processResults: function (data, page) {
                var myResults = [];
                $.each(data.items, function (i, v) {
                    myResults.push({
                        id: v.id,
                        text: v.name,
                        code: v.code
                    });
                    console.log(myResults);
                });
                return {
                    results: myResults,
                    pagination: {
                        more: (page * 30) < data.total
                    }
                };
            }
        }});

    $(document).on('change', '#txtItems2', function (e) {
        var id = $(this).val();
        console.log(id);
        if(id){
            $.ajax({
                url: '/medical_add_asset/code_items',
                method: 'POST',
                data: {id: id}
            })
                .success(function (data) {
                    var $text_code = $('#txtItems_code2');
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
});