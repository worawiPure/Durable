var express = require('express');
var router = express.Router();
var json2xls = require('json2xls');
var _ = require('lodash');
var Q = require('q');
var fs = require('fs');
var path = require('path');
var numeral = require('numeral');
var pdf = require('html-pdf');
var moment = require('moment');
var fse = require('fs-extra');
var gulp = require('gulp');
var data = require('gulp-data');
var jade = require('gulp-jade');
var rimraf = require('rimraf');
var report_general = require('../models/durable_general_manage');
var report_medical = require('../models/durable_medical_manage');
var utils = require('../models/utils');
var items = require('../models/durable_general_manage_systems');
var items2 = require('../models/durable_medical_manage_systems');

router.get('/report_general_items/:items_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _items = {};
    var items_print = req.params.items_print;
    report_general.report_durable_items_price_total(db,items_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
        return items.getListItems_print(db,items_print)
        })
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
        return report_general.report_durable_items(db,items_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
                json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_general_items.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_general_items.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์ทั่วไป แยกตามรายการครุภัณฑ์   '+ _items.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment( Date() ).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/general_items-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    console.log(err);
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_general_items_distribute/:items_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _items = {};
    var items_print = req.params.items_print;
    report_general.report_durable_items_distribute_price_total(db,items_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListItems_print(db,items_print)
        })
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
            return report_general.report_durable_distribute_items(db,items_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_general_items_distribute.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_general_items_distribute.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์ทั่วไปที่จำหน่าย แยกตามรายการครุภัณฑ์   '+ _items.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment( Date() ).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/general_items_distribute-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    console.log(err);
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_general_items_worn-out/:items_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _items = {};
    var items_print = req.params.items_print;
    report_general.report_durable_items_worn_out_price_total(db,items_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListItems_print(db,items_print)
        })
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
            return report_general.report_durable_worn_out_items(db,items_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_general_items_worn-out.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_general_items_worn-out.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์ทั่วไปที่ชำรุด แยกตามรายการครุภัณฑ์   '+ _items.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment( Date() ).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/general_items_worn-out-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    console.log(err);
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_general_type/:type_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _type = {};
    var type_print = req.params.type_print;
    report_general.report_durable_type_price_total(db,type_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListType_print(db,type_print)
        })
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_general.report_durable_type(db,type_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_general_type.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_general_type.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์ทั่วไป แยกตามประเภทครุภัณฑ์   '+ _type.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/general_type-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {

                    if (err) {
                        console.log(err);
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_general_type_distribute/:type_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _type = {};
    var type_print = req.params.type_print;
    report_general.report_durable_type_distribute_price_total(db,type_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListType_print(db,type_print)
        })
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_general.report_durable_distribute_type(db,type_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_general_type_distribute.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_general_type_distribute.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์ทั่วไปที่จำหน่าย แยกตามประเภทครุภัณฑ์   '+ _type.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/general_type_distribute-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {

                    if (err) {
                        console.log(err);
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_general_type_worn-out/:type_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _type = {};
    var type_print = req.params.type_print;
    report_general.report_durable_type_worn_out_price_total(db,type_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListType_print(db,type_print)
        })
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_general.report_durable_worn_out_type(db,type_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_general_type_worn-out.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_general_type_worn-out.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์ทั่วไปที่ชำรุด แยกตามประเภทครุภัณฑ์   '+ _type.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/general_type_worn-out-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {

                    if (err) {
                        console.log(err);
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_general_room/:room_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _room = {};
    var room_print = req.params.room_print;
    report_general.report_durable_room_price_total(db,room_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListRoom_print(db,room_print)
        })
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_general.report_durable_room(db,room_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_general_room.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_general_room.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์ทั่วไป แยกตามห้องที่ใช้ครุภัณฑ์   '+ _room.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/general_room-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {

                    if (err) {
                        console.log(err);
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_general_room_distribute/:room_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _room = {};
    var room_print = req.params.room_print;
    report_general.report_durable_room_distribute_price_total(db,room_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListRoom_print(db,room_print)
        })
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_general.report_durable_distribute_room(db,room_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_general_room_distribute.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_general_room_distribute.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์ทั่วไปที่จำหน่าย แยกตามห้องที่ใช้ครุภัณฑ์   '+ _room.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/general_room_distribute-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {

                    if (err) {
                        console.log(err);
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_general_room_worn-out/:room_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _room = {};
    var room_print = req.params.room_print;
    report_general.report_durable_room_worn_out_price_total(db,room_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListRoom_print(db,room_print)
        })
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_general.report_durable_worn_out_room(db,room_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_general_room_worn-out.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_general_room_worn-out.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์ทั่วไปที่ชำรุด แยกตามห้องที่ใช้ครุภัณฑ์   '+ _room.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/general_room_worn-out-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {

                    if (err) {
                        console.log(err);
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/general/:id', function (req, res, next) {
  var db = req.db;
  var json = {};
  var id = req.params.id;
  report_general.report_durable_id_print(db,id)
     .then(function(rows){
         json.detail = rows[0];
         console.log(json.detail);
          var monthName = utils.getMonthName(moment(json.detail.receive_date).format('MM'));
            json.detail.receive_date2 = moment(json.detail.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(json.detail.receive_date).get('year') + 543);
          var monthName2 = utils.getMonthName(moment(json.detail.distribute_date).format('MM'));
            json.detail.distribute_date2 = moment(json.detail.distribute_date).format('DD') + ' ' +monthName2 + ' ' + (moment(json.detail.distribute_date).get('year') + 543);
            json.detail.price2 = numeral(json.detail.price).format('0,0.00');
         fse.ensureDirSync('./templates/html');
         fse.ensureDirSync('./templates/pdf');
         var destPath = './templates/html/' + moment().format('x');
         fse.ensureDirSync(destPath);
         json.img = './img/sign.png';
         // Create pdf
         gulp.task('html', function (cb) {
             return gulp.src('./templates/report_general_id.jade')
                 .pipe(data(function () {
                     return json;
                 }))
                 .pipe(jade())
                 .pipe(gulp.dest(destPath));
             cb();
         });

         gulp.task('pdf', ['html'], function () {
             var html = fs.readFileSync(destPath + '/report_general_id.html', 'utf8')
             var options = {
                 format: 'A4',
                 header:{
                     height: "25mm",
                     contents: '<div style="text-align: center"><h2> รายละเอียดครุภัณฑ์ทั่วไป โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม</h2></div>'
                 },
                 footer: {
                     height: "15mm",
                     contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                     ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                 }
             };
             var pdfName = './templates/pdf/general_id-' + moment().format('x') + '.pdf';
             pdf.create(html, options).toFile(pdfName, function(err, resp) {
                 if (err) {
                     res.send({ok: false, msg: err});
                 } else {
                     res.download(pdfName, function () {
                         rimraf.sync(destPath);
                         fse.removeSync(pdfName);
                     });
                 }
             });
         });
         // Convert html to pdf
         gulp.start('pdf');

     },function(err){
         res.send({ok: false, msg: err});
     });
    // ensure directory
  });

router.get('/report_medical_items/:items_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _items = {};
    var items_print = req.params.items_print;
    report_medical.report_durable_items_price_total(db,items_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListItems_print(db,items_print)
        })
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
            return report_medical.report_durable_items(db,items_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_medical_items.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_medical_items.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์การแพทย์ แยกตามรายการครุภัณฑ์   '+ _items.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment( Date() ).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/medical_items-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    console.log(err);
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_medical_items_distribute/:items_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _items = {};
    var items_print = req.params.items_print;
    report_medical.report_durable_items_distribute_price_total(db,items_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListItems_print(db,items_print)
        })
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
            return report_medical.report_durable_distribute_items(db,items_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_medical_items_distribute.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_medical_items_distribute.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์การแพ่ทย์ที่จำหนาย แยกตามรายการครุภัณฑ์   '+ _items.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment( Date() ).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/medical_items_distribute-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    console.log(err);
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_medical_items_worn-out/:items_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _items = {};
    var items_print = req.params.items_print;
    report_medical.report_durable_items_worn_out_price_total(db,items_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListItems_print(db,items_print)
        })
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
            return report_medical.report_durable_worn_out_items(db,items_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_medical_items_worn-out.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_medical_items_worn-out.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์การแพ่ทย์ที่ชำรุด แยกตามรายการครุภัณฑ์   '+ _items.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment( Date() ).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/medical_items_worn-out-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    console.log(err);
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_medical_type/:type_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _type = {};
    var type_print = req.params.type_print;
    report_medical.report_durable_type_price_total(db,type_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListType_print(db,type_print)
        })
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_medical.report_durable_type(db,type_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_medical_type.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_medical_type.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์การแพทย์ แยกตามประเภทครุภัณฑ์   '+ _type.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/medical_type-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {

                    if (err) {
                        console.log(err);
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_medical_type_distribute/:type_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _type = {};
    var type_print = req.params.type_print;
    report_medical.report_durable_type_distribute_price_total(db,type_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListType_print(db,type_print)
        })
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_medical.report_durable_distribute_type(db,type_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_medical_type_distribute.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_medical_type_distribute.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์การแพทย์ที่จำหน่าย แยกตามประเภทครุภัณฑ์   '+ _type.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/medical_type_distribute-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {

                    if (err) {
                        console.log(err);
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_medical_type_worn-out/:type_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _type = {};
    var type_print = req.params.type_print;
    report_medical.report_durable_type_worn_out_price_total(db,type_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListType_print(db,type_print)
        })
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_medical.report_durable_worn_out_type(db,type_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_medical_type_worn-out.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_medical_type_worn-out.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์การแพทย์ที่ชำรุด แยกตามประเภทครุภัณฑ์   '+ _type.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/medical_type_worn-out-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {

                    if (err) {
                        console.log(err);
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_medical_room/:room_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _room = {};
    var room_print = req.params.room_print;
    report_medical.report_durable_room_price_total(db,room_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListRoom_print(db,room_print)
        })
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_medical.report_durable_room(db,room_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_medical_room.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_medical_room.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์การแพทย์ แยกตามห้องที่ใช้ครุภัณฑ์   '+ _room.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/medical_room-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {

                    if (err) {
                        console.log(err);
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_medical_room_distribute/:room_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _room = {};
    var room_print = req.params.room_print;
    report_medical.report_durable_room_distribute_price_total(db,room_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListRoom_print(db,room_print)
        })
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_medical.report_durable_distribute_room(db,room_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_medical_room_distribute.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_medical_room_distribute.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์การแพทย์ที่จำหน่าย แยกตามห้องที่ใช้ครุภัณฑ์   '+ _room.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/medical_room_distribute-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {

                    if (err) {
                        console.log(err);
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_medical_room_worn-out/:room_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _room = {};
    var room_print = req.params.room_print;
    report_medical.report_durable_room_worn_out_price_total(db,room_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListRoom_print(db,room_print)
        })
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_medical.report_durable_worn_out_room(db,room_print)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_medical_room_worn-out.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_medical_room_worn-out.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานครุภัณฑ์การแพทย์ที่ชำรุด แยกตามห้องที่ใช้ครุภัณฑ์   '+ _room.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/medical_room_worn-out-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {

                    if (err) {
                        console.log(err);
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/medical/:id', function (req,res,next) {
    var db = req.db;
    var json = {};
    var id = req.params.id;
    report_medical.report_durable_id_print(db,id)
        .then(function(rows){
            json.detail = rows[0];
            console.log(json.detail);
            var monthName = utils.getMonthName(moment(json.detail.receive_date).format('MM'));
            json.detail.receive_date2 = moment(json.detail.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(json.detail.receive_date).get('year') + 543);
            var monthName2 = utils.getMonthName(moment(json.detail.distribute_date).format('MM'));
            json.detail.distribute_date2 = moment(json.detail.distribute_date).format('DD') + ' ' +monthName2 + ' ' + (moment(json.detail.distribute_date).get('year') + 543);
            json.detail.price2 = numeral(json.detail.price).format('0,0.00');
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_medical_id.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_medical_id.html', 'utf8')
                var options = {
                    format: 'A4',
                    header:{
                        height: "25mm",
                        contents: '<div style="text-align: center"><h2> รายละเอียดครุภัณฑ์การแพทย์ โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม</h2></div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/medical_id-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');

        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_general_depreciate_items/:items_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _items = {};
    var items_print = req.params.items_print;
    report_general.report_durable_items_price_total(db,items_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListItems_print(db,items_print)
        })
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
            return report_general.report_depreciate_print_items(db,items_print)
        })
        .then(function(rows){
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
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_general_depreciate_items.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_general_depreciate_items.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานค่าเสื่อมครุภัณฑ์ทั่วไป แยกตามรายการครุภัณฑ์   '+ _items.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment( Date() ).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/general_depreciate_items-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    console.log(err);
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_general_depreciate_type/:type_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _type = {};
    var type_print = req.params.type_print;
    report_general.report_durable_type_price_total(db,type_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListType_print(db,type_print)
        })
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_general.report_depreciate_print_type(db,type_print)
        })
        .then(function(rows){
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
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_general_depreciate_type.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_general_depreciate_type.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานค่าเสื่อมครุภัณฑ์ทั่วไป แยกตามประเภทครุภัณฑ์   '+ _type.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment( Date() ).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/general_depreciate_type-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    console.log(err);
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_general_depreciate_room/:room_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _room = {};
    var room_print = req.params.room_print;
    report_general.report_durable_room_price_total(db,room_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListRoom_print(db,room_print)
        })
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_general.report_depreciate_print_room(db,room_print)
        })
        .then(function(rows){
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
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_general_depreciate_room.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_general_depreciate_room.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานค่าเสื่อมครุภัณฑ์ทั่วไป แยกตามห้องที่ใช้ครุภัณฑ์   '+ _room.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment( Date() ).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/general_depreciate_room-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    console.log(err);
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_medical_depreciate_items/:items_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _items = {};
    var items_print = req.params.items_print;
    report_medical.report_durable_items_price_total(db,items_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListItems_print(db,items_print)
        })
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
            return report_medical.report_depreciate_print_items(db,items_print)
        })
        .then(function(rows){
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
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_medical_depreciate_items.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_medical_depreciate_items.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานค่าเสื่อมครุภัณฑ์ทางการแพทย์ แยกตามรายการครุภัณฑ์   '+ _items.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment( Date() ).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/medical_depreciate_items-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    console.log(err);
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_medical_depreciate_type/:type_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _type = {};
    var type_print = req.params.type_print;
    report_medical.report_durable_type_price_total(db,type_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListType_print(db,type_print)
        })
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_medical.report_depreciate_print_type(db,type_print)
        })
        .then(function(rows){
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
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_medical_depreciate_type.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_medical_depreciate_type.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานค่าเสื่อมครุภัณฑ์ทางการแพทย์ แยกตามประเภทครุภัณฑ์   '+ _type.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment( Date() ).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/medical_depreciate_type-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    console.log(err);
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_medical_depreciate_room/:room_print', function (req, res, next) {
    var db = req.db;
    var json = {};
    var _room = {};
    var room_print = req.params.room_print;
    report_medical.report_durable_room_price_total(db,room_print)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListRoom_print(db,room_print)
        })
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_medical.report_depreciate_print_room(db,room_print)
        })
        .then(function(rows){
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
            json.detail = _data;
            //json.detail.receive_date2= moment(rows.receive_date,'YYYY-MM-DD').format('DD/MM') +'/'+ (moment(rows.receive_date,'YYYY-MM-DD').get('year') + 543);
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_medical_depreciate_room.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_medical_depreciate_room.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "30mm",
                        contents: '<div style="text-align: center"><h2> โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม<br>' +
                        'รายงานค่าเสื่อมครุภัณฑ์ทางการแพทย์ แยกตามห้องที่ใช้ครุภัณฑ์   '+ _room.detail.name +'</h2> </div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment( Date() ).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/medical_depreciate_room-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    console.log(err);
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');
        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/general_depreciate/:id', function (req,res,next) {
    var db = req.db;
    var json = {};
    var id = req.params.id;
    console.log(id);
    report_general.report_durable_id_depreciate_print_general(db,id)
        .then(function(rows){
            json.detail = rows[0];
            var monthName = utils.getMonthName(moment(json.detail.receive_date).format('MM'));
            json.detail.receive_date2 = moment(json.detail.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(json.detail.receive_date).get('year') + 543);
            var monthName2 = utils.getMonthName(moment(json.detail.distribute_date).format('MM'));
            json.detail.distribute_date2 = moment(json.detail.distribute_date).format('DD') + ' ' +monthName2 + ' ' + (moment(json.detail.distribute_date).get('year') + 543);
            json.detail.price2 = numeral(json.detail.price).format('0,0.00');
                var _data = [];
                var i = 1;
                for ( i = 1; i <= json.detail.age_l; i++) {
                    var obj = {};
                    obj.next_year = moment(json.detail.receive_date).add(i,'year').format('YYYY-MM-DD');
                    obj.year_depreciate = parseFloat(json.detail.depreciate) * parseFloat(i);
                    obj.month_depreciate = (parseFloat(json.detail.depreciate) * parseFloat(moment(obj.next_year,'YYYY-MM-DD').format('MM'))) / 12;
                    obj.sum_depreciate = parseFloat(obj.year_depreciate) + parseFloat(obj.month_depreciate);
                    obj.residual_value = parseFloat(json.detail.price) - parseFloat(obj.sum_depreciate);
                        if (obj.residual_value < 1 ) {
                            obj.sum_depreciate = 1;
                            obj.residual_value = 1;
                        }
                    var monthName_depreciates = utils.getMonthName(moment(obj.next_year).format('MM'));
                    obj.next_year2 = moment(obj.next_year).format('DD') + ' ' + monthName_depreciates + ' ' + (moment(obj.next_year).get('year') + 543);
                    obj.sum_depreciate2 = numeral(obj.sum_depreciate).format('0,0.00');
                    obj.residual_value2 = numeral(obj.residual_value).format('0,0.00');
                    obj.price2 = numeral(json.detail.price).format('0,0.00');
                    _data.push(obj);
                }
            json.detail_depreciate = _data;
            console.log(_data);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_general_id_depreciate.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_general_id_depreciate.html', 'utf8')
                var options = {
                    format: 'A4',
                    header:{
                        height: "25mm",
                        contents: '<div style="text-align: center"><h2> รายละเอียดครุภัณฑ์ทั่วไป โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม</h2></div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/general_depreciate_id-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');

        },function(err){
            res.send({ok: false, msg: err});
        });

    // ensure directory
});

router.get('/medical_depreciate/:id', function (req,res,next) {
    var db = req.db;
    var json = {};
    var id = req.params.id;
    console.log(id);
    report_medical.report_durable_id_depreciate_print_medical(db,id)
        .then(function(rows){
            json.detail = rows[0];
            var monthName = utils.getMonthName(moment(json.detail.receive_date).format('MM'));
            json.detail.receive_date2 = moment(json.detail.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(json.detail.receive_date).get('year') + 543);
            var monthName2 = utils.getMonthName(moment(json.detail.distribute_date).format('MM'));
            json.detail.distribute_date2 = moment(json.detail.distribute_date).format('DD') + ' ' +monthName2 + ' ' + (moment(json.detail.distribute_date).get('year') + 543);
            json.detail.price2 = numeral(json.detail.price).format('0,0.00');
            var _data = [];
            var i = 1;
            for ( i = 1; i <= json.detail.age_l; i++) {
                var obj = {};
                obj.next_year = moment(json.detail.receive_date).add(i,'year').format('YYYY-MM-DD');
                obj.year_depreciate = parseFloat(json.detail.depreciate) * parseFloat(i);
                obj.month_depreciate = (parseFloat(json.detail.depreciate) * parseFloat(moment(obj.next_year,'YYYY-MM-DD').format('MM'))) / 12;
                obj.sum_depreciate = parseFloat(obj.year_depreciate) + parseFloat(obj.month_depreciate);
                obj.residual_value = parseFloat(json.detail.price) - parseFloat(obj.sum_depreciate);
                if (obj.residual_value < 1 ) {
                    obj.sum_depreciate = 1;
                    obj.residual_value = 1;
                }
                var monthName_depreciates = utils.getMonthName(moment(obj.next_year).format('MM'));
                obj.next_year2 = moment(obj.next_year).format('DD') + ' ' + monthName_depreciates + ' ' + (moment(obj.next_year).get('year') + 543);
                obj.sum_depreciate2 = numeral(obj.sum_depreciate).format('0,0.00');
                obj.residual_value2 = numeral(obj.residual_value).format('0,0.00');
                obj.price2 = numeral(json.detail.price).format('0,0.00');
                _data.push(obj);
            }
            json.detail_depreciate = _data;
            console.log(_data);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_medical_id_depreciate.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_medical_id_depreciate.html', 'utf8')
                var options = {
                    format: 'A4',
                    header:{
                        height: "25mm",
                        contents: '<div style="text-align: center"><h2> รายละเอียดครุภัณฑ์ทางการแพทย์ โรงพยาบาลกันทรวิชัย อ.กันทรวิชัย จ.มหาสารคาม</h2></div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ moment(Date()).format('YYYY-MM-DD HH:mm:ss') +'' +
                        ' หน้า <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span> '
                    }
                };
                var pdfName = './templates/pdf/medical_depreciate_id-' + moment().format('x') + '.pdf';
                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');

        },function(err){
            res.send({ok: false, msg: err});
        });

    // ensure directory
});

router.get('/export_general_items/:items_export',function(req, res){
    var db = req.db;
    var json = {};
    var _items = {};
    var items_export = req.params.items_export;
    report_general.report_durable_items_price_total(db,items_export)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListItems_print(db,items_export)
        })
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
            return report_general.export_durable_items(db,items_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_items_general-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_general_items_distribute/:items_export',function(req, res){
    var db = req.db;
    var json = {};
    var _items = {};
    var items_export = req.params.items_export;
    items.getListItems_print(db,items_export)
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
            return report_general.export_durable_distribute_items(db,items_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_items_general_distribute-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_general_items_worn-out/:items_export',function(req, res){
    var db = req.db;
    var json = {};
    var _items = {};
    var items_export = req.params.items_export;
    items.getListItems_print(db,items_export)
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
            return report_general.export_durable_worn_out_items(db,items_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_items_general_worn-out-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_general_type/:type_export',function(req, res){
    var db = req.db;
    var json = {};
    var _type = {};
    var type_export = req.params.type_export;
    report_general.report_durable_type_price_total(db,type_export)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListType_print(db,type_export)
        })
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_general.export_durable_type(db,type_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_type_general-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_general_type_distribute/:type_export',function(req, res){
    var db = req.db;
    var json = {};
    var _type = {};
    var type_export = req.params.type_export;
    items.getListType_print(db,type_export)
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_general.export_durable_distribute_type(db,type_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_type_general_distribute-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_general_type_worn-out/:type_export',function(req, res){
    var db = req.db;
    var json = {};
    var _type = {};
    var type_export = req.params.type_export;
    items.getListType_print(db,type_export)
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_general.export_durable_worn_out_type(db,type_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_type_general_worn-out-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_general_room/:room_export',function(req, res){
    var db = req.db;
    var json = {};
    var _room = {};
    var room_export = req.params.room_export;
    report_general.report_durable_room_price_total(db,room_export)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListRoom_print(db,room_export)
        })
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_general.export_durable_room(db,room_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_room_general-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_general_room_distribute/:room_export',function(req, res){
    var db = req.db;
    var json = {};
    var _room = {};
    var room_export = req.params.room_export;
    items.getListRoom_print(db,room_export)
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_general.export_durable_distribute_room(db,room_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_room_general_distribute-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_general_room_worn-out/:room_export',function(req, res){
    var db = req.db;
    var json = {};
    var _room = {};
    var room_export = req.params.room_export;
    items.getListRoom_print(db,room_export)
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_general.export_durable_worn_out_room(db,room_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_room_general_worn-out-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_medical_items/:items_export',function(req, res){
    var db = req.db;
    var json = {};
    var _items = {};
    var items_export = req.params.items_export;
    report_medical.report_durable_items_price_total(db,items_export)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListItems_print(db,items_export)
        })
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
            return report_medical.export_durable_items(db,items_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_items_medical-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_medical_items_distribute/:items_export',function(req, res){
    var db = req.db;
    var json = {};
    var _items = {};
    var items_export = req.params.items_export;
    items2.getListItems_print(db,items_export)
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
            return report_medical.export_durable_distribute_items(db,items_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_items_medical_distribute-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_medical_items_worn-out/:items_export',function(req, res){
    var db = req.db;
    var json = {};
    var _items = {};
    var items_export = req.params.items_export;
    items2.getListItems_print(db,items_export)
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
            return report_medical.export_durable_worn_out_items(db,items_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_items_medical_worn-out-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_medical_type/:type_export',function(req, res){
    var db = req.db;
    var json = {};
    var _type = {};
    var type_export = req.params.type_export;
    report_medical.report_durable_type_price_total(db,type_export)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListType_print(db,type_export)
        })
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_medical.export_durable_type(db,type_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_type_medical-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_medical_type_distribute/:type_export',function(req, res){
    var db = req.db;
    var json = {};
    var _type = {};
    var type_export = req.params.type_export;
    items2.getListType_print(db,type_export)
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_medical.export_durable_distribute_type(db,type_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);
            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_type_medical_distribute-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_medical_type_worn-out/:type_export',function(req, res){
    var db = req.db;
    var json = {};
    var _type = {};
    var type_export = req.params.type_export;
    items2.getListType_print(db,type_export)
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_medical.export_durable_worn_out_type(db,type_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);
            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_type_medical_worn-out-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_medical_room/:room_export',function(req, res){
    var db = req.db;
    var json = {};
    var _room = {};
    var room_export = req.params.room_export;
    report_medical.report_durable_room_price_total(db,room_export)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListRoom_print(db,room_export)
        })
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_medical.export_durable_room(db,room_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_room_medical-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });
        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_medical_room_distribute/:room_export',function(req, res){
    var db = req.db;
    var json = {};
    var _room = {};
    var room_export = req.params.room_export;
    items2.getListRoom_print(db,room_export)
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_medical.export_durable_distribute_room(db,room_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_room_medical_distribute-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });
        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_medical_room_worn-out/:room_export',function(req, res){
    var db = req.db;
    var json = {};
    var _room = {};
    var room_export = req.params.room_export;
    items2.getListRoom_print(db,room_export)
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_medical.export_durable_worn_out_room(db,room_export)
        })
        .then(function(rows){
            var _data = [];
            rows.forEach(function (v) {
                var obj = {};
                obj.id = v.id;
                var monthName = utils.getMonthName(moment(v.receive_date).format('MM'));
                obj.receive_date = moment(v.receive_date).format('DD') + ' ' +monthName + ' ' + (moment(v.receive_date).get('year') + 543);
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
                _data.push(obj);
            });
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_room_medical_worn-out-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','price','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });
        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_depreciate_type_general/:type_export',function(req, res){
    var db = req.db;
    var json = {};
    var _type = {};
    var type_export = req.params.type_export;
    report_general.report_durable_type_price_total(db,type_export)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListType_print(db,type_export)
        })
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_general.report_depreciate_export_type(db,type_export)
        })
        .then(function(rows){
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
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_depreciate_general_type-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name',
                'cnt_year','cnt_month','cnt_day','price','depreciate','sum_depreciate2','residual_value2']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_depreciate_items_general/:items_export',function(req, res){
    var db = req.db;
    var json = {};
    var _items = {};
    var items_export = req.params.items_export;
    report_general.report_durable_type_price_total(db,items_export)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListType_print(db,items_export)
        })
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
            return report_general.report_depreciate_export_items(db,items_export)
        })
        .then(function(rows){
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
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_depreciate_general_items-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name',
                'cnt_year','cnt_month','cnt_day','price','depreciate','sum_depreciate2','residual_value2']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_depreciate_room_general/:room_export',function(req, res){
    var db = req.db;
    var json = {};
    var _room = {};
    var room_export = req.params.room_export;
    report_general.report_durable_type_price_total(db,room_export)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items.getListType_print(db,room_export)
        })
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_general.report_depreciate_export_room(db,room_export)
        })
        .then(function(rows){
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
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_depreciate_general_room-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name',
                'cnt_year','cnt_month','cnt_day','price','depreciate','sum_depreciate2','residual_value2']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_depreciate_type_medical/:type_export',function(req, res){
    var db = req.db;
    var json = {};
    var _type = {};
    var type_export = req.params.type_export;
    report_medical.report_durable_type_price_total(db,type_export)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListType_print(db,type_export)
        })
        .then(function (rows) {
            console.log(rows);
            _type.detail = rows[0];
            return report_medical.report_depreciate_export_type(db,type_export)
        })
        .then(function(rows){
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
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_depreciate_medical_type-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name',
                'cnt_year','cnt_month','cnt_day','price','depreciate','sum_depreciate2','residual_value2']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_depreciate_items_medical/:items_export',function(req, res){
    var db = req.db;
    var json = {};
    var _items = {};
    var items_export = req.params.items_export;
    report_medical.report_durable_type_price_total(db,items_export)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListType_print(db,items_export)
        })
        .then(function (rows) {
            console.log(rows);
            _items.detail = rows[0];
            return report_medical.report_depreciate_export_items(db,items_export)
        })
        .then(function(rows){
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
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_depreciate_medical_items-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name',
                'cnt_year','cnt_month','cnt_day','price','depreciate','sum_depreciate2','residual_value2']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_depreciate_room_medical/:room_export',function(req, res){
    var db = req.db;
    var json = {};
    var _room = {};
    var room_export = req.params.room_export;
    report_medical.report_durable_type_price_total(db,room_export)
        .then(function(rows){
            console.log(rows);
            json.total = numeral(rows).format('0,0.00');
            return items2.getListType_print(db,room_export)
        })
        .then(function (rows) {
            console.log(rows);
            _room.detail = rows[0];
            return report_medical.report_depreciate_export_room(db,room_export)
        })
        .then(function(rows){
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
            json.detail = _data;
            console.log(json.detail);

            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'export_depreciate_medical_room-' + moment().format('x') + '.xls');
            var xls = json2xls(json.detail,{fields:['receive_date','type_name','durable_name',
                'items_code','provide','shop_name','spec','room_name','order_no','change_room','remark','status_name',
                'cnt_year','cnt_month','cnt_day','price','depreciate','sum_depreciate2','residual_value2']});
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });

        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/pdf', function(req, res, next) {
  var fs = require('fs');
  var pdf = require('html-pdf');

  var json = {
    fullname: 'นายสถิตย์  เรียนพิศ',
    items: [
      {id: 1, name: 'Apple'},
      {id: 2, name: 'Banana'},
      {id: 3, name: 'Orange'},
    ]
  };

  gulp.task('html', function (cb) {
    return gulp.src('./templates/report_summary.jade')
      .pipe(data(function () {
        return json;
      }))
      .pipe(jade())
      .pipe(gulp.dest('./templates'));
      cb();
  });

  gulp.task('pdf', ['html'], function () {
    var html = fs.readFileSync('./templates/slip.html', 'utf8')
    var options = {
      format: 'A4'
    };

    pdf.create(html, options).toFile('./public/pdf/slip.pdf', function(err, resp) {
      if (err) return console.log(err);
      res.send({ok: true, file: resp}) // { filename: '/app/businesscard.pdf' }
    });
  });

  gulp.start('pdf');

});
module.exports = router;
