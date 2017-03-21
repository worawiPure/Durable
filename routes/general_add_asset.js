var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var numeral = require('numeral');
var router = express.Router();
var company = require('../models/durable_general_manage_systems');
var brand = require('../models/durable_general_manage_systems');
var type = require('../models/durable_general_manage_systems');
var department = require('../models/durable_general_manage_systems');
var category = require('../models/durable_general_manage_systems');
var items = require('../models/durable_general_manage_systems');
var status = require('../models/durable_general_manage_systems');
var guarantee =require('../models/durable_general_manage_systems');
var room =require('../models/durable_general_manage_systems');
var money =require('../models/durable_general_manage_systems');
var year =require('../models/durable_general_manage_systems');
var save = require('../models/durable_general_manage');
var show_detail = require('../models/durable_general_manage');
var utils = require('../models/utils');

/* GET home page. */
router.get('/general_add_asset', function(req,res){
    var db = req.db;
    var data = {};
    if (req.session.level_user_id != 2){
        res.render('./page/access_denied')
    } else {
         type.getListType(db)
            .then(function(rows){
                console.log(rows);
                data.types =rows;
                return money.getListMoney(db);
            })
            .then(function(rows) {
                console.log(rows);
                data.moneys = rows;
                return room.getListRoom(db);
            })
            .then(function(rows) {
                console.log(rows);
                data.rooms = rows;
                return status.getListStatus(db);
            })
            .then(function (rows) {
                console.log(rows);
                data.status = rows;
                res.render('./page/general_add_asset', {data: data});
            }, function (err) {
                console.log(err);
                res.render('./page/general_add_asset', {
                    data: {
                         types:[], moneys:[],rooms:[],status:[]
                    }
                });
            });
    }
});

router.post('/code_items',function(req,res){
    var id = req.body.id;
    var db = req.db;
    console.log(id);
    save.getListCode_items(db,id)
        .then(function(rows){
            console.log(rows);
            res.send({ok:true,rows:rows});
        },
        function(err){
            res.send({ok:false,msg:err})
        })
});

router.post('/save_durable_general', function(req,res){
    var db = req.db;
    var data = req.body.data;
    data.receive_date=moment(data.receive_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    if (data){
        save.check_duplicated_items(db,data)
            .then(function (total){
                if (total){
                    res.send({ok:false, msg:'ข้อมูลซ้ำ'});
                    console.log(total)
                } else {
                    save.save_asset_general(db,data)
                        .then(function(rows){
                            console.log('Saved');
                            res.send({ok:true})
                        }, function(err){
                            console.log(err);
                            res.send({ok:false,msg:err})
                        })
                }
            })}
    else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
        }
});

router.get('/show_detail', function(req,res){
    var db = req.db;
    var data = {};
    if (req.session.level_user_id != 2){
        res.render('./page/access_denied')
    } else {
          room.getListRoom(db)
                .then(function(rows){
                    data.rooms = rows;
                    return type.getListType(db);
                })
                .then(function (rows) {
                    data.types = rows;
                    res.render('./page/general_search_detail', {data: data});
                }, function (err) {
                    console.log(err);
                    res.render('./page/general_search_detail', {
                        data: { types:[] ,rooms:[]}
                    });
                });
    }
});

router.get('/report_general_distribute', function(req,res){
    var db = req.db;
    var data = {};
    if (req.session.level_user_id != 2){
        res.render('./page/access_denied')
    } else {
        room.getListRoom(db)
            .then(function(rows){
                data.rooms = rows;
                return type.getListType(db);
            })
            .then(function (rows) {
                data.types = rows;
                res.render('./page/general_distribute', {data: data});
            }, function (err) {
                console.log(err);
                res.render('./page/general_distribute', {
                    data: { types:[] ,rooms:[]}
                });
            });
    }
});

router.post('/durable_search_items',function(req,res){
    var db = req.db;
    var data = {};
    data.items = req.body.items;
    console.log(data);
    show_detail.search_durable_items(db,data)
        .then(function(rows){
            console.log(rows);
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.post('/durable_search_items_distribute',function(req,res){
    var db = req.db;
    var data = {};
    data.items = req.body.items;
    console.log(data);
    show_detail.search_durable_items_distribute(db,data)
        .then(function(rows){
            console.log(rows);
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.post('/durable_search_type',function(req,res){
    var db = req.db;
    var data = {};
    data.type = req.body.type;
    console.log(data);
    show_detail.search_durable_type(db,data)
        .then(function(rows){
            console.log(rows);
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.post('/durable_search_type_distribute',function(req,res){
    var db = req.db;
    var data = {};
    data.type = req.body.type;
    console.log(data);
    show_detail.search_durable_type_distribute(db,data)
        .then(function(rows){
            console.log(rows);
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.post('/durable_search_room',function(req,res){
    var db = req.db;
    var data = {};
    data.room = req.body.room;
    console.log(data);
    show_detail.search_durable_room(db,data)
        .then(function(rows){
            console.log(rows);
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.post('/durable_search_room_distribute',function(req,res){
    var db = req.db;
    var data = {};
    data.room = req.body.room;
    console.log(data);
    show_detail.search_durable_room_distribute(db,data)
        .then(function(rows){
            console.log(rows);
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/durable_general_show_edit/:id', function(req,res){
    if (req.session.level_user_id != 2){
        res.render('./page/access_denied')
    } else {
        var db = req.db;
        var id = req.params.id;
        var data = {};
            show_detail.show_edit_general_durable(db,id)
                .then(function (rows) {
                    console.log(rows);
                    data.detail = rows[0];
                    data.detail.receive_date2 = moment(rows[0].receive_date).format('DD/MM/YYYY');
                    data.detail.distribute_date2 = moment(rows[0].distribute_date).format('DD/MM/YYYY');
                    console.log(moment(rows[0].receive_date).format('YYYY-MM-DD'),rows[0].receive_date);
                    return items.getListItems(db);
                })
                .then(function(rows){
                    data.items = rows;
                    return type.getListType(db);
                })
                .then(function(rows){
                    data.types =rows;
                    return money.getListMoney(db);
                })
                .then(function(rows){
                    data.moneys =rows;
                    return company.getListCompany(db);
                })
                .then(function(rows){
                    data.companys =rows;
                    return room.getListRoom(db);
                })
                .then(function(rows) {
                    data.rooms = rows;
                    return status.getListStatus(db);
                })
                .then(function (rows) {
                    data.status = rows;
                    res.render('./page/general_edit_durable', {data: data});
                }, function (err) {
                    res.render('./page/general_edit_durable', {
                        data: {
                             items:[], types:[],  moneys:[], companys:[],rooms:[],status:[]
                        }
                    });
                });
            }
});

router.post('/edit_general_durable', function(req,res){
    var db = req.db;
    var data = req.body.data;
    data.receive_date=moment(data.receive_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    data.distribute_date=moment(data.distribute_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    if (data.id) {
        save.edit_general_asset(db,data)
            .then(function(){
                console.log('Edit');
                res.send({ok:true})
            }, function(err){
                console.log(err);
                res.send({ok:false,msg:err})
            })
    } else { res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})}
});

router.post('/remove_general_items', function(req,res){
    var db = req.db;
    var id = req.body.id;
    if(id){
        save.remove_items_general(db,id)
            .then(function(){
                res.send({ok:true})
            },function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.get('/report_general_depreciate', function(req,res){
    var db = req.db;
    var data = {};
    if (req.session.level_user_id != 2){
        res.render('./page/access_denied')
    } else {
         room.getListRoom(db)
            .then(function(rows){
                data.rooms = rows;
                return type.getListType(db);
            })
            .then(function (rows) {
                data.types = rows;
                res.render('./page/general_search_depreciate', {data: data});
            }, function (err) {
                console.log(err);
                res.render('./page/general_search_depreciate', {
                    data: {types:[] ,rooms:[]}
                });
            });
    }
});

router.post('/report_depreciate_search_items',function(req,res){
    var db = req.db;
    var data = {};
    data.items = req.body.items;
    show_detail.report_depreciate_search_items(db,data)
        .then(function(rows) {
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' + monthName + ' ' + (moment(v.receive_date).get('year') + 543);
                obj.durable_type = v.durable_type;
                obj.durable_items = v.durable_items;
                obj.pieces = v.pieces;
                obj.spec = v.spec;
                obj.price = numeral(v.price).format('0,0.00');
                obj.company = v.company;
                obj.wheremoney = v.wheremoney;
                obj.order_no = v.order_no;
                obj.room = v.room;
                obj.change_room = v.change_room;
                obj.remark = v.remark;
                obj.to_register_date = v.to_register_date;
                obj.distribute_date = v.distribute_date;
                obj.status = v.status;
                obj.date_change = v.date_change;
                obj.type_name = v.type_name;
                obj.durable_name = v.durable_name;
                obj.items_code = v.items_code;
                obj.provide = v.provide;
                obj.shop_name = v.shop_name;
                obj.room_name = v.room_name;
                obj.status_name = v.status_name;
                obj.change_room_name = v.change_room_name;
                obj.cnt_year = v.cnt_year;
                obj.cnt_month = v.cnt_month;
                obj.cnt_day = v.cnt_day;
                obj.depreciate = numeral(v.depreciate).format('0,0.00');
                if(v.cnt_year >= v.age_l) {
                    obj.sum_depreciate = 1;
                    obj.residual_value = 1;
                    obj.sum_depreciate2 = numeral(obj.sum_depreciate).format('0,0.00');
                    obj.residual_value2 = numeral(obj.residual_value).format('0,0.00');
                } else {
                    obj.year_depreciate = parseFloat(v.depreciate) * parseFloat(v.cnt_year);
                    obj.month_depreciate = (parseFloat(v.depreciate) * parseFloat(v.cnt_month)) / 12;
                    obj.sum_depreciate = parseFloat(obj.year_depreciate) + parseFloat(obj.month_depreciate);
                    obj.residual_value = parseFloat(v.price) - parseFloat(obj.sum_depreciate);
                    obj.sum_depreciate2 = numeral(obj.sum_depreciate).format('0,0.00');
                    obj.residual_value2 = numeral(obj.residual_value).format('0,0.00');
                }
                _data.push(obj);
            });
            res.send({ok:true,rows:_data});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.post('/report_depreciate_search_type',function(req,res){
    var db = req.db;
    var data = {};
    data.type = req.body.type;
    show_detail.report_depreciate_search_type(db,data)
        .then(function(rows) {
            var _data = [];
            rows.forEach(function (v) {
                //console.log(v);
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' + monthName + ' ' + (moment(v.receive_date).get('year') + 543);
                obj.durable_type = v.durable_type;
                obj.durable_items = v.durable_items;
                obj.pieces = v.pieces;
                obj.spec = v.spec;
                obj.price = numeral(v.price).format('0,0.00');
                obj.company = v.company;
                obj.wheremoney = v.wheremoney;
                obj.order_no = v.order_no;
                obj.room = v.room;
                obj.change_room = v.change_room;
                obj.remark = v.remark;
                obj.to_register_date = v.to_register_date;
                obj.distribute_date = v.distribute_date;
                obj.status = v.status;
                obj.date_change = v.date_change;
                obj.type_name = v.type_name;
                obj.durable_name = v.durable_name;
                obj.items_code = v.items_code;
                obj.provide = v.provide;
                obj.shop_name = v.shop_name;
                obj.room_name = v.room_name;
                obj.status_name = v.status_name;
                obj.change_room_name = v.change_room_name;
                obj.cnt_year = v.cnt_year;
                obj.cnt_month = v.cnt_month;
                obj.cnt_day = v.cnt_day;
                obj.depreciate = numeral(v.depreciate).format('0,0.00');
                if(v.cnt_year >= v.age_l) {
                    obj.sum_depreciate = 1;
                    obj.residual_value = 1;
                    obj.sum_depreciate2 = numeral(obj.sum_depreciate).format('0,0.00');
                    obj.residual_value2 = numeral(obj.residual_value).format('0,0.00');
                } else {
                    obj.year_depreciate = parseFloat(v.depreciate) * parseFloat(v.cnt_year);
                    obj.month_depreciate = (parseFloat(v.depreciate) * parseFloat(v.cnt_month)) / 12;
                    obj.sum_depreciate = parseFloat(obj.year_depreciate) + parseFloat(obj.month_depreciate);
                    obj.residual_value = parseFloat(v.price) - parseFloat(obj.sum_depreciate);
                    obj.sum_depreciate2 = numeral(obj.sum_depreciate).format('0,0.00');
                    obj.residual_value2 = numeral(obj.residual_value).format('0,0.00');
                }
                _data.push(obj);
                console.log(obj);
            });
            //console.log(_data);
            res.send({ok:true,rows:_data});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.post('/report_depreciate_search_room',function(req,res){
    var db = req.db;
    var data = {};
    data.room = req.body.room;
    show_detail.report_depreciate_search_room(db,data)
        .then(function(rows) {
            var _data = [];
            rows.forEach(function (v) {
                //console.log(v);
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' + monthName + ' ' + (moment(v.receive_date).get('year') + 543);
                obj.durable_type = v.durable_type;
                obj.durable_items = v.durable_items;
                obj.pieces = v.pieces;
                obj.spec = v.spec;
                obj.price = numeral(v.price).format('0,0.00');
                obj.company = v.company;
                obj.wheremoney = v.wheremoney;
                obj.order_no = v.order_no;
                obj.room = v.room;
                obj.change_room = v.change_room;
                obj.remark = v.remark;
                obj.to_register_date = v.to_register_date;
                obj.distribute_date = v.distribute_date;
                obj.status = v.status;
                obj.date_change = v.date_change;
                obj.type_name = v.type_name;
                obj.durable_name = v.durable_name;
                obj.items_code = v.items_code;
                obj.provide = v.provide;
                obj.shop_name = v.shop_name;
                obj.room_name = v.room_name;
                obj.status_name = v.status_name;
                obj.change_room_name = v.change_room_name;
                obj.cnt_year = v.cnt_year;
                obj.cnt_month = v.cnt_month;
                obj.cnt_day = v.cnt_day;
                obj.depreciate = numeral(v.depreciate).format('0,0.00');
                if(v.cnt_year >= v.age_l) {
                    obj.sum_depreciate = 1;
                    obj.residual_value = 1;
                    obj.sum_depreciate2 = numeral(obj.sum_depreciate).format('0,0.00');
                    obj.residual_value2 = numeral(obj.residual_value).format('0,0.00');
                } else {
                    obj.year_depreciate = parseFloat(v.depreciate) * parseFloat(v.cnt_year);
                    obj.month_depreciate = (parseFloat(v.depreciate) * parseFloat(v.cnt_month)) / 12;
                    obj.sum_depreciate = parseFloat(obj.year_depreciate) + parseFloat(obj.month_depreciate);
                    obj.residual_value = parseFloat(v.price) - parseFloat(obj.sum_depreciate);
                    obj.sum_depreciate2 = numeral(obj.sum_depreciate).format('0,0.00');
                    obj.residual_value2 = numeral(obj.residual_value).format('0,0.00');
                }
                _data.push(obj);
                console.log(obj);
            });
            //console.log(_data);
            res.send({ok:true,rows:_data});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/select2_items', function(req,res){
    var db = req.db;
    var data = {};
    data.term = req.query.term;
    data.page = req.query.page;
    if (req.session.level_user_id != 2){
        res.render('./page/access_denied')
    } else {
        var _items;
        items.getListItems_select2(db,data)
            .then(function (rows) {
                _items = rows;
                return items.getCount_items_select2(db,data)
            })
            .then(function(total){
                res.send({ok:true,items:_items,total:total});
            }, function (err) {
                console.log(err);
                res.send({ok:false,msg:err})
                });
    }
});

router.get('/select2_company', function(req,res){
    var db = req.db;
    var data = {};
    data.term = req.query.term;
    data.page = req.query.page;
    if (req.session.level_user_id != 2){
        res.render('./page/access_denied')
    } else {
        var _company;
        company.getListCompany_select2(db,data)
            .then(function (rows) {
                _company = rows;
                return company.getCount_company_select2(db,data)
            })
            .then(function(total){
                res.send({ok:true,company:_company,total:total});
            }, function (err) {
                console.log(err);
                res.send({ok:false,msg:err})
            });
    }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/hello/:fname/:lname/:age', function (req,res) {
  var data = req.params;
  res.render('page/main',{
    fname:data.fname,
    lname:data.lname,
    age:data.age
  });
});

router.get('/about', function(reg, res){
  var  fruits = [1,2,3,4];
  var animal = [{id:1 , name: 'cat'},
    {id:2,name:'bat'},
    {id:3,name:'rat'}];
  var person = [{id:1 ,name:'worawit'},
    {id:2,name:'somsri'},
    {id:3,name:'somchai'}];
  res.render('page/about',{msg:'เกี่ยวกับผู้จัดทำ',fruits:fruits,animal:animal,person:person});
});

router.get('/contact',function(req,res){
  var tel = [{id:1,moo:'1',tumb:'โคกพระ',post:'44150'},
    {id:2,moo:'9',tumb:'คันธาร์',post:'44151'},
    {id:3,moo:'4',tumb:'โคกพระ',post:'44152'}];
  res.render('page/contact',{tel:tel});
});
module.exports = router;