$(function() {
    var setTable = function(data){
        var $tblDurable = $('#tblDurable_show > tbody');
        $tblDurable.empty();
        var i=0;
        _.forEach(data.rows, function(v){
            i++;
            var html = '<tr> ' +
                '<td> ' + i + ' </td>'+
                '<td> ' + v.receive_date +' </td>'+
                '<td>' + v.items_code  + ' </td>'+
                //'<td>' + v.type_name  + ' </td>'+
                '<td>' + v.durable_name  + ' </td>'+
                '<td>' + v.spec  + ' </td>'+
                '<td>' + v.price  + ' </td>'+
                '<td>' + v.depreciate  + ' </td>'+
                '<td>' + v.cnt_year +'ปี'+ v.cnt_month+'เดือน'+ v.cnt_day+'วัน'+ ' </td>'+
                '<td><font color="red">' + v.sum_depreciate2 + '</font></td>'+
                '<td><font color="red">' + v.residual_value2 + '</font></td>'+
                '<td> '+
                '<div class="btn-group btn-group-sm" role="group"> '+
                '<a class="btn btn-success" type="button" href="/prints/general_depreciate/'+ v.id +'" data-toggle="tooltip" data-placement="top" title="ปริ้นเอกสาร"> <i class="fa fa-print"></i></a>';
                '</div></td> ';
            $tblDurable.append(html);
        });
        $('[data-toggle="tooltip"]').tooltip();
    };

    $('#btnPrint_items').fadeOut('slow');
    $('#btnPrint_type').fadeOut('slow');
    $('#btnPrint_room').fadeOut('slow');
    $('#btnExport_type_excel').fadeOut('slow');
    $('#btnExport_items_excel').fadeOut('slow');
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
                url: "/general_add_asset/report_depreciate_search_items",
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
                url: "/general_add_asset/report_depreciate_search_type",
                contentType: 'application/json',
                data: JSON.stringify(data)
            })
                .success(function(data) {
                    setTable(data);
                    NProgress.done();
                    $('#btnPrint_type').fadeIn('slow');
                    $('#btnExport_type_excel').fadeIn('slow');
                    $('#btnPrint_items').fadeOut('slow');
                    $('#btnPrint_room').fadeOut('slow');
                    $('#btnExport_items_excel').fadeOut('slow');
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
            alert('กรุณาเลือกห้องที่ใช้ด้วยครับ!!')
        } else {
            console.log(data);
            NProgress.start();
            $.ajax({
                type: "POST",
                url: "/general_add_asset/report_depreciate_search_room",
                contentType: 'application/json',
                data: JSON.stringify(data)
            })
                .success(function(data) {
                    setTable(data);
                    NProgress.done();
                    $('#btnPrint_room').fadeIn('slow');
                    $('#btnPrint_items').fadeOut('slow');
                    $('#btnPrint_type').fadeOut('slow');
                    $('#btnExport_type_excel').fadeOut('slow');
                    $('#btnExport_items_excel').fadeOut('slow');
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
       // var items_print = $('#slItems').val();
        var data_items = $("#SlItems").select2('data');
        var items_print = data_items[0].id;
        window.open('/prints/report_general_depreciate_items/'+items_print)
    });

    $('#btnPrint_type').on('click', function(e){
        e.preventDefault();
        var type_print = $('#slType').val();
        window.open('/prints/report_general_depreciate_type/'+type_print)
    });

    $('#btnPrint_room').on('click', function(e){
        e.preventDefault();
        var room_print = $('#slRoom').val();
        window.open('/prints/report_general_depreciate_room/'+room_print)
    });

    $('#btnExport_type_excel').on('click', function(e){
        e.preventDefault();
        var type_export = $('#slType').val();
        window.open('/prints/export_depreciate_type_general/'+type_export)
    });

    $('#btnExport_items_excel').on('click', function(e){
        e.preventDefault();
       // var items_export = $('#slItems').val();
        var data_items = $("#SlItems").select2('data');
        var items_export = data_items[0].id;
        window.open('/prints/export_depreciate_items_general/'+items_export)
    });

    $('#btnExport_room_excel').on('click', function(e){
        e.preventDefault();
        var room_export = $('#slRoom').val();
        window.open('/prints/export_depreciate_room_general/'+room_export)
    });

    $("#SlItems").select2({
        ajax: {
            url: "/general_add_asset/select2_items",
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

});