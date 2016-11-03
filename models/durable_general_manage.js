var Q = require('q');
var moment = require('moment');

module.exports = {

    getListCode_items: function(db,id){
        var q = Q.defer();
        db('general_items')
            .select()
            .where('id',id)
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
    },

    check_duplicated_items2: function (db,items_name,code) {
        var q = Q.defer();
        db('general_items')
            .where('name','=',items_name)
            .orWhere('code','=',code)
            .count('* as total')
            .then(function (rows) {
                q.resolve(rows[0].total)
            })
            .catch(function (err) {
                q.reject(err)
            });
        return q.promise;
    },

    check_duplicated_items: function (db,data) {
        var q = Q.defer();
        db('general_asset')
            .where('durable_items', data.durable_items)
            .where('pieces', data.pieces)
            .count('* as total')
            .then(function (rows) {
                q.resolve(rows[0].total)
            })
            .catch(function (err) {
                q.reject(err)
            });
        return q.promise;
    },

    save_asset_general: function (db,data) {
        var q = Q.defer();
        db('general_asset')
            .insert({
                receive_date: data.receive_date,
                durable_type: data.durable_type,
                durable_items: data.durable_items,
                pieces: data.pieces,
                spec: data.spec,
                price: data.price,
                company: data.company,
                wheremoney: data.wheremoney,
                order_no: data.order_no,
                room: data.room,
                change_room: data.change_room,
                remark: data.remark,
                status: data.status,
                date_change: moment().format('YYYY-MM-DD HH:mm:ss')
            })
            .then(function(rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });
        return q.promise;
    },

    search_durable_items: function(db,data){
        var q = Q.defer();
        var sql =   'SELECT ADDDATE(a.distribute_date,INTERVAL 543 YEAR) as distribute_date_thai,ADDDATE(a.receive_date,INTERVAL 543 YEAR) as receive_date_thai,a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name  FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.durable_items = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[data.items])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                console.log(rows[0]);
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    search_durable_type: function(db,data){
        var q = Q.defer();
        var sql =   'SELECT ADDDATE(a.distribute_date,INTERVAL 543 YEAR) as distribute_date_thai,ADDDATE(a.receive_date,INTERVAL 543 YEAR) as receive_date_thai,a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name  FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.durable_type = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[data.type])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                console.log(rows[0]);
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    search_durable_room: function(db,data){
        var q = Q.defer();
        var sql =   'SELECT ADDDATE(a.distribute_date,INTERVAL 543 YEAR) as distribute_date_thai,ADDDATE(a.receive_date,INTERVAL 543 YEAR) as receive_date_thai,a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name  FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.room = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[data.room])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                console.log(rows[0]);
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    report_durable_items: function(db,items_print){
        var q = Q.defer();
        var sql =   'SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name  FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.durable_items = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[items_print])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                console.log(rows[0]);
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    report_durable_type: function(db,type_print){
        var q = Q.defer();
        var sql =   'SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name  FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.durable_type = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[type_print])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                console.log(rows[0]);
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    report_durable_room: function(db,room_print){
        var q = Q.defer();
        var sql =   'SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name  FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.room = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[room_print])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                console.log(rows[0]);
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    report_durable_items_price_total: function(db,items_print){
        var q = Q.defer();
        var sql =   'SELECT SUM(a.price) as total FROM general_asset a WHERE a.durable_items = ? ';
        db.raw(sql,[items_print])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0][0].total)
            })
            .catch(function(err){
                console.log(err);
                q.reject(err)
            });
        return q.promise;
    },

    report_durable_type_price_total: function(db,type_print){
        var q = Q.defer();
        var sql =   'SELECT SUM(a.price) as total FROM general_asset a WHERE a.durable_type = ? ';
        db.raw(sql,[type_print])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0][0].total)
            })
            .catch(function(err){
                console.log(err);
                q.reject(err)
            });
        return q.promise;
    },

    report_durable_room_price_total: function(db,room_print){
        var q = Q.defer();
        var sql =   'SELECT SUM(a.price) as total FROM general_asset a WHERE a.room = ? ';
        db.raw(sql,[room_print])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0][0].total)
            })
            .catch(function(err){
                console.log(err);
                q.reject(err)
            });
        return q.promise;
    },

    report_durable_id_print: function(db,id){
        var q = Q.defer();
        var sql = 'SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
        'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name  FROM  general_asset a '+
        'LEFT JOIN general_type t ON t.id=a.durable_type '+
        'LEFT JOIN general_items i ON i.id=a.durable_items '+
        'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
        'LEFT JOIN general_company o ON o.id=a.company '+
        'LEFT JOIN general_room r ON r.id=a.room '+
        'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
        'LEFT JOIN durable_status s ON s.id=a.status '+
        'WHERE a.id = ? ';
        db.raw(sql,[id])
            .then(function(row){
                q.resolve(row[0])
            })
            .catch(function(err){
                q.reject(err)
            });
        return q.promise;
    },

    show_edit_general_durable: function(db,id){
        var q = Q.defer();
        var sql =   'SELECT a.*,t.name as type_name,i.name as durable_name,i.code as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name  FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.id = ?  ';
        db.raw(sql, [parseInt(id)])
            .then(function(rows){
                //console.log(rows);
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    edit_general_asset: function (db,data) {
        var q = Q.defer();
        db('general_asset')
            .update({
                receive_date: data.receive_date,
                durable_type: data.durable_type,
                durable_items:data.durable_items,
                pieces:data.pieces,
                spec:data.spec,
                price:data.price,
                company:data.company,
                wheremoney:data.wheremoney,
                order_no:data.order_no,
                room:data.room,
                change_room:data.change_room,
                remark:data.remark,
                distribute_date:data.distribute_date,
                status:data.status,
                date_change: moment().format('YYYY-MM-DD HH:mm:ss')
            })
            .where('id',data.id)
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });
        return q.promise;
    },

    remove_items_general: function(db,id){
        var q = Q.defer();
        db('general_asset')
            .delete()
            .where('id',id)
            .then(function(){
                q.resolve();
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
    },

    report_depreciate_search_items: function(db,data){
        var q = Q.defer();
        var sql =   ' SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
        'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name, '+
        'timestampdiff(year,a.receive_date,curdate()) as cnt_year, '+
        'timestampdiff(month,a.receive_date,curdate())-(timestampdiff(year,a.receive_date,curdate())*12) as cnt_month, '+
        'timestampdiff(day,date_add(a.receive_date,interval(timestampdiff(month,a.receive_date,curdate())) month),curdate()) as cnt_day, '+
        '((a.price*t.depreciate_l)/100) as depreciate,t.age_l   FROM  general_asset a '+
        'LEFT JOIN general_type t ON t.id=a.durable_type '+
        'LEFT JOIN general_items i ON i.id=a.durable_items '+
        'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
        'LEFT JOIN general_company o ON o.id=a.company '+
        'LEFT JOIN general_room r ON r.id=a.room '+
        'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
        'LEFT JOIN durable_status s ON s.id=a.status '+
        'WHERE a.durable_items = ? '+
        'ORDER BY a.receive_date ';
        db.raw(sql,[data.items])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    report_depreciate_search_type: function(db,data){
        var q = Q.defer();
        var sql =   ' SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name, '+
            'timestampdiff(year,a.receive_date,curdate()) as cnt_year, '+
            'timestampdiff(month,a.receive_date,curdate())-(timestampdiff(year,a.receive_date,curdate())*12) as cnt_month, '+
            'timestampdiff(day,date_add(a.receive_date,interval(timestampdiff(month,a.receive_date,curdate())) month),curdate()) as cnt_day, '+
            '((a.price*t.depreciate_l)/100) as depreciate,t.age_l   FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.durable_type = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[data.type])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    report_depreciate_search_room: function(db,data){
        var q = Q.defer();
        var sql =   ' SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name, '+
            'timestampdiff(year,a.receive_date,curdate()) as cnt_year, '+
            'timestampdiff(month,a.receive_date,curdate())-(timestampdiff(year,a.receive_date,curdate())*12) as cnt_month, '+
            'timestampdiff(day,date_add(a.receive_date,interval(timestampdiff(month,a.receive_date,curdate())) month),curdate()) as cnt_day, '+
            '((a.price*t.depreciate_l)/100) as depreciate,t.age_l   FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.room = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[data.room])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    report_depreciate_print_items: function(db,items_print){
        var q = Q.defer();
        var sql =   ' SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name, '+
            'timestampdiff(year,a.receive_date,curdate()) as cnt_year, '+
            'timestampdiff(month,a.receive_date,curdate())-(timestampdiff(year,a.receive_date,curdate())*12) as cnt_month, '+
            'timestampdiff(day,date_add(a.receive_date,interval(timestampdiff(month,a.receive_date,curdate())) month),curdate()) as cnt_day, '+
            '((a.price*t.depreciate_l)/100) as depreciate,t.age_l   FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.durable_items = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[items_print])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    report_depreciate_print_type: function(db,type_print){
        var q = Q.defer();
        var sql =   ' SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name, '+
            'timestampdiff(year,a.receive_date,curdate()) as cnt_year, '+
            'timestampdiff(month,a.receive_date,curdate())-(timestampdiff(year,a.receive_date,curdate())*12) as cnt_month, '+
            'timestampdiff(day,date_add(a.receive_date,interval(timestampdiff(month,a.receive_date,curdate())) month),curdate()) as cnt_day, '+
            '((a.price*t.depreciate_l)/100) as depreciate,t.age_l   FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.durable_type = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[type_print])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err);
                q.reject(err)
            });
        return q.promise;
    },

    report_depreciate_print_room: function(db,room_print){
        var q = Q.defer();
        var sql =   ' SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name, '+
            'timestampdiff(year,a.receive_date,curdate()) as cnt_year, '+
            'timestampdiff(month,a.receive_date,curdate())-(timestampdiff(year,a.receive_date,curdate())*12) as cnt_month, '+
            'timestampdiff(day,date_add(a.receive_date,interval(timestampdiff(month,a.receive_date,curdate())) month),curdate()) as cnt_day, '+
            '((a.price*t.depreciate_l)/100) as depreciate,t.age_l   FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.room = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[room_print])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err);
                q.reject(err)
            });
        return q.promise;
    },

    report_durable_id_depreciate_print_general: function(db,id){
        var q = Q.defer();
        var sql =   ' SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name, '+
            'timestampdiff(year,a.receive_date,curdate()) as cnt_year, '+
            'timestampdiff(month,a.receive_date,curdate())-(timestampdiff(year,a.receive_date,curdate())*12) as cnt_month, '+
            'timestampdiff(day,date_add(a.receive_date,interval(timestampdiff(month,a.receive_date,curdate())) month),curdate()) as cnt_day, '+
            '((a.price*t.depreciate_l)/100) as depreciate,t.age_l   FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.id = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[id])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    export_durable_items: function(db,items_export){
        var q = Q.defer();
        var sql =   'SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name  FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.durable_items = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[items_export])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                console.log(rows[0]);
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    export_durable_type: function(db,type_export){
        var q = Q.defer();
        var sql =   'SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name  FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.durable_type = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[type_export])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                console.log(rows[0]);
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    export_durable_room: function(db,room_export){
        var q = Q.defer();
        var sql =   'SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name  FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.room = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[room_export])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                console.log(rows[0]);
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err);
                q.reject(err)
            });
        return q.promise;
    },

    report_depreciate_export_type: function(db,type_export){
        var q = Q.defer();
        var sql =   ' SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name, '+
            'timestampdiff(year,a.receive_date,curdate()) as cnt_year, '+
            'timestampdiff(month,a.receive_date,curdate())-(timestampdiff(year,a.receive_date,curdate())*12) as cnt_month, '+
            'timestampdiff(day,date_add(a.receive_date,interval(timestampdiff(month,a.receive_date,curdate())) month),curdate()) as cnt_day, '+
            '((a.price*t.depreciate_l)/100) as depreciate,t.age_l   FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.durable_type = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[type_export])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err);
                q.reject(err)
            });
        return q.promise;
    },

    report_depreciate_export_items: function(db,items_export){
        var q = Q.defer();
        var sql =   ' SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name, '+
            'timestampdiff(year,a.receive_date,curdate()) as cnt_year, '+
            'timestampdiff(month,a.receive_date,curdate())-(timestampdiff(year,a.receive_date,curdate())*12) as cnt_month, '+
            'timestampdiff(day,date_add(a.receive_date,interval(timestampdiff(month,a.receive_date,curdate())) month),curdate()) as cnt_day, '+
            '((a.price*t.depreciate_l)/100) as depreciate,t.age_l   FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.durable_items = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[items_export])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err);
                q.reject(err)
            });
        return q.promise;
    },

    report_depreciate_export_room: function(db,room_export){
        var q = Q.defer();
        var sql =   ' SELECT a.*,t.name as type_name,i.name as durable_name,CONCAT(i.code,"/",a.pieces) as items_code, '+
            'w.provide,o.shop as shop_name,r.name as room_name,s.name as status_name,r2.name as change_room_name, '+
            'timestampdiff(year,a.receive_date,curdate()) as cnt_year, '+
            'timestampdiff(month,a.receive_date,curdate())-(timestampdiff(year,a.receive_date,curdate())*12) as cnt_month, '+
            'timestampdiff(day,date_add(a.receive_date,interval(timestampdiff(month,a.receive_date,curdate())) month),curdate()) as cnt_day, '+
            '((a.price*t.depreciate_l)/100) as depreciate,t.age_l   FROM  general_asset a '+
            'LEFT JOIN general_type t ON t.id=a.durable_type '+
            'LEFT JOIN general_items i ON i.id=a.durable_items '+
            'LEFT JOIN durable_where_money w ON w.id=a.wheremoney '+
            'LEFT JOIN general_company o ON o.id=a.company '+
            'LEFT JOIN general_room r ON r.id=a.room '+
            'LEFT JOIN general_room r2 ON r2.id=a.change_room '+
            'LEFT JOIN durable_status s ON s.id=a.status '+
            'WHERE a.room = ? '+
            'ORDER BY a.receive_date ';
        db.raw(sql,[room_export])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err);
                q.reject(err)
            });
        return q.promise;
    }
};