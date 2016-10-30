$(function(){
    var setTable = function(data){
                var $tblType= $('#tblType > tbody');
                $tblType.empty();
                var i=0;
                _.forEach(data.rows, function(v){
                    i++;
                    var html = '<tr> ' +
                        '<td> ' + i + ' </td>'+
                        '<td> ' + v.name + ' </td>'+
                        '<td> ' + v.age_l + ' </td>'+
                        '<td> ' + v.age_h + ' </td>'+
                        '<td> ' + v.depreciate_l + ' </td>'+
                        '<td> ' + v.depreciate_h + ' </td>'+
                        '<td> '+
                        '<div class="btn-group btn-group-sm" role="group"> '+
                        '<button  class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> '+
                        '<i class="fa fa-cogs"> </i> </button> '+
                        '<ul class="dropdown-menu"> '+
                        '<li> '+
                        '<a href="#" data-action="edit" data-tname="'+ v.name +'" data-age_l="'+ v.age_l +'" data-age_h="'+ v.age_h +'" data-depreciate_l="'+ v.depreciate_l +'"  data-depreciate_h="'+ v.depreciate_h +'"  data-id="'+ v.id +'") > '+
                        '<i class="fa.fa-edit"> </i> แก้ไข </a></li> '+
                        '<li> '+
                        '<a href="#" data-action="remove" data-id="'+ v.id +'">'+
                        '<i class="fa fa-trash"> </i>ลบ </a></li></ul></div> ';
                    $tblType.append(html);
                })
    }

    var getPageType = function(){
        $.ajax({
            method:'POST',
            url:'/durable_general/type_total',
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
                            url:'/durable_general/start_page_type',
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

            })
    };

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
                url:'/durable_general/remove_type',
                dataType:'json',
                data:{
                    id:id
                }
            })
                .success(function(data){
                    if(data.ok) {
                        alert('ลบเสร็จเรียบร้อยแล้ว');
                        getPageType();
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
        var tname = $(this).data('tname');
        var age_l = $(this).data('age_l');
        var age_h = $(this).data('age_h');
        var depreciate_l = $(this).data('depreciate_l');
        var depreciate_h = $(this).data('depreciate_h');
        var id = $(this).data('id');

        $('#txtTypeName').val(tname);
        $('#txtAgeLow').val(age_l);
        $('#txtAgeHi').val(age_h);
        $('#txtDepreLow').val(depreciate_l);
        $('#txtDepreHi').val(depreciate_h);
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
        $('#txtTypeName').val('');
        $('#txtAgeLow').val('');
        $('#txtAgeHi').val('');
        $('#txtDepreLow').val('');
        $('#txtDepreHi').val('');
        $('#txtId').val('');// do something...
         $('#divAlert').fadeOut();

    });

    $('#btnSave').on('click',function(e){
        e.preventDefault();
        var tname = $('#txtTypeName').val();
        var age_l = $('#txtAgeLow').val();
        var age_h = $('#txtAgeHi').val();
        var depreciate_l = $('#txtDepreLow').val();
        var depreciate_h = $('#txtDepreHi').val();
        var id = $('#txtId').val();
        if(tname){
            if(id){
                $.ajax({
                    method:'POST',
                    url:'/durable_general/update_type',
                    dataType:'json',
                    data:{
                        tname:tname,
                        age_l:age_l,
                        age_h:age_h,
                        depreciate_l:depreciate_l,
                        depreciate_h:depreciate_h,
                        id:id
                    }
                })
                    .success(function(data){
                        if(data.ok) {
                            console.log(data);
                            alert('แก้ไขเสร็จเรีนบร้อยแล้ว');
                            $('#mdlNew').modal('hide');
                            getPageType();
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
                    url:'/durable_general/save_type',
                    dataType:'json',
                    data:{
                        tname:tname,
                        age_l:age_l,
                        age_h:age_h,
                        depreciate_l:depreciate_l,
                        depreciate_h:depreciate_h
                    }
                })
                    .success(function(data){
                        if(data.ok) {
                            alert('บันทึกเสร็จเรีนบร้อยแล้ว');
                            $('#mdlNew').modal('hide');
                            getPageType();
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
            alert('กรุณาระบุประเภทครุภัณฑ์')
        }
    });

    $('ul[data-name="paging"]').fadeIn();
    $('#btnSearch').on('click', function(e){
        e.preventDefault();
        var data = {};
        var tname = $('#txtSearch').val();
        data.tname = tname;

        $.ajax({
            type: "POST",
            url: "/durable_general/search_type",
            contentType:'application/json',
            dataType:'json',
            data: JSON.stringify(data)
        })
            .success(function(data){
                setTable(data);
                $('ul[data-name="paging"]').fadeIn();
            })
    });
  getPageType();
});