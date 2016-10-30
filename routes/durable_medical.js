var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var router = express.Router();
var department = require('../models/durable_general_manage_systems');
var room =require('../models/durable_medical_manage_systems');
var items = require('../models/durable_medical_manage_systems');
var type = require('../models/durable_medical_manage_systems');
var company = require('../models/durable_medical_manage_systems');

/// จัดการบริษัท ////////////////////////////////////////

router.get('/company', function(req, res, next) {
    if (req.session.level_user_id != 2){
        res.render('./page/access_denied')
    }else{
        res.render('./page/durable_medical_company');}
});

router.post('/get_company',function(req,res){
    var db = req.db;
    company.getListCompany(db)
        .then(function (rows){
            console.log(rows);
            res.send({ok:true,rows:rows})
        },function(err) {
            res.send({ok:false,msg:err})
        }
    )
});

router.post('/remove_company', function(req,res){
    var db = req.db;
    var id = req.body.id;
    if(id){
        company.remove_company(db,id)
            .then(function(){
                res.send({ok:true})
            },function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/update_company', function(req,res){
    var db = req.db;
    var name = req.body.shop;
    var address = req.body.address;
    var tel = req.body.tel;
    var service =req.body.service;
    var id = req.body.id;
    if (id ) {
        company.update_company(db,id,name,address,tel,service)
            .then(function () {
                console.log('Update');
                res.send({ok: true})
            }, function (err) {
                res.send({ok: false, msg: err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/search_company',function(req,res){
    var db = req.db;
    var data = {};
    data.shop = req.body.shop;
    console.log(data);
    company.search_company(db,data)
        .then(function(rows){
            console.log(rows);
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.post('/company_total',function(req, res){
    var db = req.db;
    company.total_company(db)
        .then(function(total){
            console.log(total);
            res.send({ok:true,total:total})
        },function(err){
            res.send({ok:false,msg:err})
        }
    )
});

router.post('/start_page_company',function(req, res){
    var db = req.db;
    var startpage = parseInt(req.body.startRecord);
    console.log(startpage);
    company.page_company(db,startpage)
        .then(function(rows){
            console.log(rows);
            res.send({ok:true,rows:rows})
        },function(err){
            res.send({ok:false,msg:err})
        }
    )

});

router.post('/save_company', function(req,res){
    var db = req.db;
    var name = req.body.shop;
    var address = req.body.address;
    var tel =req.body.tel;
    var service = req.body.service;
    if (name){
        console.log(name);
        company.check_duplicated_company(db,name)
            .then(function (total) {
                if (total) {
                    res.send({ok:false, msg:'ข้อมูลซ้ำ'});
                } else {
                    company.save_company(db,name,address,tel,service)
                        .then(function(){
                            console.log('Saved');
                            res.send({ok:true})
                        }, function(err){
                            console.log(err);
                            res.send({ok:false,msg:err})
                        })
                }
            });
    }
    else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});
///////////////////////// end ////////////////////////

//////////////////////////// ประเภทครุภัณฑ์ //////////////////////////

router.get('/durable_type',function(req, res, next) {
    if(req.session.level_user_id !=2) {
        res.render('./page/access_denied')
    }else{
        res.render('./page/durable_medical_type');}
});

router.post('/type_total',function(req, res){
    var db = req.db;
    type.total_type(db)
        .then(function(total){
            console.log(total);
            res.send({ok:true,total:total})
        },function(err){
            res.send({ok:false,msg:err})
        })
});

router.post('/start_page_type',function(req,res){
    var db = req.db;
    var startpage = parseInt(req.body.startRecord);
    type.page_type(db,startpage)
        .then(function(rows){
            res.send({ok:true,rows:rows})
        },function(err){
            res.send({ok:false,msg:err})
        })
});

router.post('/remove_type' ,function(req, res){
    var db = req.db;
    var id = req.body.id;
    if(id) {
        type.remove_type(db,id)
            .then(function () {
                res.send({ok: true})
            }, function (err) {
                res.send({ok: false,msg:err})
            })
    }
    else{
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/update_type', function(req,res){
    var db = req.db;
    var name = req.body.tname;
    var depreciate_l = req.body.depreciate_l;
    var age_l = req.body.age_l;
    var depreciate_h =req.body.depreciate_h;
    var age_h = req.body.age_h;
    var id = req.body.id;
    if (id ) {
        type.update_type(db,id,name,age_l,age_h,depreciate_l,depreciate_h)
            .then(function () {
                console.log('Update');
                res.send({ok: true})
            }, function (err) {
                res.send({ok: false, msg: err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/save_type', function(req,res){
    var db = req.db;
    var name = req.body.tname;
    var age_l = req.body.age_l;
    var age_h = req.body.age_h;
    var depreciate_l = req.body.depreciate_l;
    var depreciate_h =req.body.depreciate_h;

    if (name){
        console.log(name,age_l,age_h,depreciate_l,depreciate_h);
        type.check_duplicated_type(db,name)
            .then(function (total) {
                if (total) {
                    res.send({ok:false, msg:'ข้อมูลซ้ำ'});
                } else {
                    type.save_type(db,name,age_l,age_h,depreciate_l,depreciate_h)
                        .then(function(){
                            console.log('Saved');
                            res.send({ok:true})
                        }, function(err){
                            console.log(err);
                            res.send({ok:false,msg:err})
                        })
                }
            });
    }
    else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/search_type',function(req,res){
    var db = req.db;
    var data = {};
    data.name = req.body.tname;
    console.log(data);
    type.search_type(db,data)
        .then(function(rows){
            console.log(rows);
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

/////////////////////////////// end ///////////////////////////////

router.get('/department',function(req, res, next) {
    if(req.session.level_user_id !=2) {
        res.render('./page/access_denied')
    }else{
        res.render('./page/durable_admin_department');}
});

router.post('/get_department',function(req,res){
    var db = req.db;
    var data = {};
    department.get_department(db)
        .then(function (rows){
            res.send({ok:true,rows:rows})
        },function(err) {
            res.send({ok:false,msg:err})
        }
    )
});

router.post('/remove_department', function(req,res){
    var db = req.db;
    var id = req.body.id;
    if(id){
        department.remove_department(db,id)
            .then(function(){
                res.send({ok:true})
            },function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/save_department', function(req,res){
    var db = req.db;
    var depname = req.body.depname;
    var depcode = req.body.depcode;
    if (depname && depcode){
        console.log(depcode)
        db('department')
            .select()
            .where({depcode:depcode})
            .then(function(rows){
                if(!rows.length){
                    department.save_department(db,depname,depcode)
                        .then(function(){
                            res.send({ok:true})
                        }, function(err){
                            res.send({ok:false,msg:err})
                        })
                }
                else {
                    res.send({ok:false, msg:'ข้อมูลซ้ำ'});
                }
            })
            .catch(function(err){
                res.send({ok:false, msg:err});
            });
    }
    else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/update_department', function(req,res){
    var db = req.db;
    var depname = req.body.depname;
    var depcode = req.body.depcode;
    var id = req.body.id;
    if (id && depname && depcode){
        department.update_department(db,id,depname,depcode)
            .then(function(){
                res.send({ok:true})
            }, function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});
/////////////////////////////////////////////////////////// End Department /////////////////

router.get('/durable_items',function(req, res, next) {
    if(req.session.level_user_id !=2) {
        res.render('./page/access_denied')
    }else{
        res.render('./page/durable_medical_items');}
});

router.post('/items_total',function(req, res){
    var db = req.db;
    items.total_items(db)
        .then(function(total){
            console.log(total);
            res.send({ok:true,total:total})
        },function(err){
            res.send({ok:false,msg:err})
        })
});

router.post('/start_page_items',function(req,res){
    var db = req.db;
    var startpage = parseInt(req.body.startRecord);
    items.page_items(db,startpage)
        .then(function(rows){
            res.send({ok:true,rows:rows})
        },function(err){
            res.send({ok:false,msg:err})
        })
});

router.post('/remove_items' ,function(req, res){
    var db = req.db;
    var id = req.body.id;
    if(id) {
        items.remove_items(db,id)
            .then(function () {
                res.send({ok: true})
            }, function (err) {
                res.send({ok: false,msg:err})
            })
    }
    else{
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/update_items', function(req,res){
    var db = req.db;
    var items_name = req.body.items_name;
    var code = req.body.code;
    var id = req.body.id;
    if(id) {
        console.log(items_name,code)
        items.update_items(db,id,items_name,code)
            .then(function () {
                console.log('Update');
                res.send({ok: true})
            }, function (err) {
                res.send({ok: false, msg: err})
            });
    }  else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/save_items', function(req,res){
    var db = req.db;
    var items_name = req.body.items_name;
    var code = req.body.code;
    if(items_name){
        console.log(items_name,code);
        items.check_duplicated_items(db,items_name,code)
            .then(function (total) {
                console.log(total)
                if (total) {
                    res.send({ok:false, msg:'ข้อมูลซ้ำ'});
                } else {
                    items.save_items(db,items_name,code)
                        .then(function(){
                            console.log('Saved');
                            res.send({ok:true})
                        }, function(err){
                            console.log(err);
                            res.send({ok:false,msg:err})
                        })
                }});
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/search_items',function(req,res){
    var db = req.db;
    var data = {};
    data.iname = req.body.iname;
    console.log(data);
    items.search_items(db,data)
        .then(function(rows){
            console.log(rows);
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});
/////////////////////////////////////////////////////// End durable_items //////////////////////////

router.get('/room', function(req, res, next) {
    if (req.session.level_user_id != 2){
        res.render('./page/access_denied')
    }else {
        var db = req.db;
        var data = {};
        department.get_department(db)
            .then(function (rows) {
                console.log(rows);
                data.departments = rows;
                res.render('./page/durable_medical_room', {data: data});
            }, function (err) {
                res.render('./page/durable_medical_room', {data: {departments: []}});
            }
        )
    }
});

router.post('/get_room',function(req,res){
    var db = req.db;
    var data = {};
    room.get_room(db)
        .then(function (rows){
            res.send({ok:true,rows:rows})
        },function(err) {
            res.send({ok:false,msg:err})
        }
    )
});

router.post('/room_total',function(req, res){
    var db = req.db;
    room.total_room(db)
        .then(function(total){
            console.log(total);
            res.send({ok:true,total:total})
        },function(err){
            res.send({ok:false,msg:err})
        }
    )
});

router.post('/start_page_room',function(req, res){
    var db = req.db;
    var startpage = parseInt(req.body.startRecord);
    console.log(startpage);
    room.page_room(db,startpage)
        .then(function(rows){
            console.log(rows);
            res.send({ok:true,rows:rows})
        },function(err){
            res.send({ok:false,msg:err})
        }
    )
});

router.post('/remove_room', function(req,res){
    var db = req.db;
    var id = req.body.id;
    if(id){
        room.remove_room(db,id)
            .then(function(){
                res.send({ok:true})
            },function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/save_room', function(req,res){
    var db = req.db;
    var r_name = req.body.r_name;
    if (r_name){
        room.check_duplicated_room(db,r_name)
            .then(function (total) {
                if (total) {
                    res.send({ok:false, msg:'ข้อมูลซ้ำ'});
                } else {
                    room.save_room(db,r_name)
                        .then(function () {
                            res.send({ok: true})
                        }, function (err) {
                            res.send({ok: false, msg: err})
                        })
                }
            });
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/search_room',function(req,res){
    var db = req.db;
    var data = {};
    data.r_name = req.body.r_name;
    console.log(data);
    room.search_room(db,data)
        .then(function(rows){
            console.log(rows);
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.post('/update_room', function(req,res){
    var db = req.db;
    var r_name = req.body.r_name;
    var id = req.body.id;
    if (id && r_name){
        room.update_room(db,id,r_name)
            .then(function(){
                res.send({ok:true})
            }, function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

///////////////////////////////////////////////////// End Room //////////////////////////////

module.exports = router;