$(function(){
    var setTable = function(data){
                var $tblMoney= $('#tblMoney > tbody');
                $tblMoney.empty();
                var i=0;
                _.forEach(data.rows, function(v){
                    i++;
                    var html = '<tr> ' +
                        '<td> ' + i + ' </td>'+
                        '<td> ' + v.provide + ' </td>'+
                        '<td> ' + v.limit + ' </td>'+
                        '<td> '+
                        '<div class="btn-group btn-group-sm" role="group"> '+
                        '<button  class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> '+
                        '<i class="fa fa-cogs"> </i> </button> '+
                        '<ul class="dropdown-menu"> '+
                        '<li> '+
                        '<a href="#" data-action="edit" data-provide="'+ v.provide +'" data-limit="'+ v.limit +'" data-id="'+ v.id +'") > '+
                        '<i class="fa.fa-edit"> </i> แก้ไข </a></li> '+
                        '<li> '+
                        '<a href="#" data-action="remove" data-id="'+ v.id +'">'+
                        '<i class="fa fa-trash"> </i>ลบ </a></li></ul></div> ';
                    $tblMoney.append(html);
                })
    }

    var getPageMoney = function(){
        $.ajax({
            method:'POST',
            url:'/durable_general/money_total',
            dataType:'json'
        })
            .success(function(data){
                //setTable(data);
                $('ul[data-name="paging"]').paging(data.total, {
                    format: "< . (qq -) nnncnnn (- pp) . >",
                    perpage: 20,
                    lapping: 0,
                    page: 1,
                    onSelect: function (page) {
                        var startRecord = this.slice[0];
                        console.log(this.slice);
                        $.ajax({
                            method:'POST',
                            url:'/durable_general/start_page_money',
                            dataType:'json',
                            contentType:'application/json',
                            data: JSON.stringify({startRecord:startRecord})
                        })
                            .success(function(data){
                                setTable(data);
                            })
                        // Index.getService(start, end, startRecord, function (err, rows) {
                        //     if (err) console.log(err);
                        //     else Index.setServiceList(rows);
                        // });
                    },
                    onFormat: function (type) {
                        switch (type) {
                            case 'block':

                                if (!this.active)
                                    return '<li class="disabled"><a href="">' + this.value + '</a></li>';
                                else if (this.value != this.page)
                                    return '<li><a href="#' + this.value + '">' + this.value + '</a></li>';
                                return '<li class="active"><a href="#">' + this.value + '</a></li>';

                            case 'right':
                            case 'left':

                                if (!this.active) {
                                    return "";
                                }
                                return '<li><a href="#' + this.value + '">' + this.value + '</a></li>';

                            case 'next':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&raquo;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&raquo;</a></li>';

                            case 'prev':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&laquo;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&laquo;</a></li>';

                            case 'first':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&lt;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&lt;</a></li>';

                            case 'last':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&gt;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&gt;</a></li>';

                            case 'fill':
                                if (this.active) {
                                    return '<li class="disabled"><a href="#">...</a></li>';
                                }
                        }
                        return ""; // return nothing for missing branches
                    }
                });
            })};

    $('#mdlSearch').fadeOut();
    $('#btnShowSearch').on('click',function(e){
    $('#mdlSearch').fadeIn();
    });

    $(document).on('click','a[data-action="remove"]', function(e){
        e.preventDefault();
        var id = $(this).data('id');
        if(confirm('คุณต้องการลบรายการนี้ ใช่หรือไม่')){
            $.ajax({
                method:'POST',
                url:'/durable_general/remove_money',
                dataType:'json',
                data:{
                    id:id
                }
            })
                .success(function(data){
                    if(data.ok) {
                        alert('ลบเสร็จเรียบร้อยแล้ว');
                        getPageMoney();
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

    $(document).on('click','a[data-action="edit"]',function(e){
        e.preventDefault();
        var provide = $(this).data('provide');
        var limit = $(this).data('limit');
        var id = $(this).data('id');

        $('#txtProvideName').val(provide);
        $('#txtLimit').val(limit);
        $('#txtId').val(id);
        $("#mdlNew").modal({
            backdrop:'static',
            keyboard:false
        })
    });

    $('#btnShowModal').on('click',function(e){
        e.preventDefault();
        $("#mdlNew").modal({
            backdrop:'static',
            keyboard:false
        })
    });

    $('#mdlNew').on('hidden.bs.modal', function (e) {
        $('#txtProvideName').val('');
        $('#txtLimit').val('');
        $('#txtId').val('');// do something...
         $('#divAlert').fadeOut();
    });

    $('#btnSave').on('click',function(e){
        e.preventDefault();
        var provide = $('#txtProvideName').val();
        var limit = $('#txtLimit').val();
        var id = $('#txtId').val();
        if(provide){
            if(id){
                $.ajax({
                    method:'POST',
                    url:'/durable_general/update_money',
                    dataType:'json',
                    data:{
                        provide:provide,
                        limit:limit,
                        id:id
                    }
                })
                    .success(function(data){
                        if(data.ok) {
                            alert('แก้ไขเสร็จเรีนบร้อยแล้ว');
                            $('#mdlNew').modal('hide');
                            getPageMoney();
                        } else {
                            console.log(data.msg);
                            $('#divAlert').fadeIn();
                        }
                    })
                    .error(function(xhr, status, err){
                        console.log(err);
                        alert('กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย')
                    })
            }else{
                $.ajax({
                    method:'POST',
                    url:'/durable_general/save_money',
                    dataType:'json',
                    data:{
                        provide:provide,
                        limit:limit
                    }
                })
                    .success(function(data){
                        if(data.ok) {
                            alert('บันทึกเสร็จเรีนบร้อยแล้ว');
                            $('#mdlNew').modal('hide');
                            getPageMoney();
                        } else {
                            console.log(data.msg);
                            $('#divAlert').fadeIn();
                        }
                    })
                    .error(function(xhr, status, err){
                        console.log(err);
                        alert('กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย')
                    })
            }
            //save
        } else{
            alert('กรุณาระบุบริษัท')
        }
    });

    $('ul[data-name="paging"]').fadeIn();
    $('#btnSearch').on('click', function(e){
        e.preventDefault();
        var data = {};
        var provide = $('#txtSearch').val();
        data.provide = provide;

        $.ajax({
            type: "POST",
            url: "/durable_general/search_money",
            contentType:'application/json',
            dataType:'json',
            data: JSON.stringify(data)
        })
            .success(function(data){
                setTable(data);
                $('ul[data-name="paging"]').fadeIn();
            })
    });
  getPageMoney();
});