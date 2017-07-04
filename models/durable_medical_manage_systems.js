var Q = require('q');

module.exports = {

    getListCompany_select2: function(db,data) {
        var q = Q.defer();
        var w = '%'+data.term+'%';
        db('medical_company')
            .select()
            .where('shop', 'like', w)
            .orderBy('shop', 'ASC')
            .limit(30)
            .offset(data.page)
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });
        return q.promise;
    },

    getCount_company_select2: function (db,data) {
        var q = Q.defer();
        var w = '%'+data.term+'%';
        db('medical_company')
            .where('shop','like',w)
            .count('* as total')
            .then(function (rows) {
                q.resolve(rows[0].total)
            })
            .catch(function (err) {
                q.reject(err)
            });
        return q.promise;
    },

  getListCompany: function(db){
      var q = Q.defer();
      db('medical_company')
          .select()
          .then(function (rows){
              q.resolve(rows);
          })
          .catch(function(err){
              q.reject(err);
          }) ;
          return q.promise;
},
  remove_company: function(db,id){
      var q = Q.defer();
      db('medical_company')
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
  update_company: function(db,id,name,address,tel,service){
      var q = Q.defer();
      db('medical_company')
            .update({shop:name,address:address,tel:tel,service:service})
            .where('id',id)
            .then(function(){
                q.resolve();
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
        },
  save_company: function(db,name,address,tel,service){
      var q = Q.defer();
      db('medical_company')
            .insert({shop:name,address:address,tel:tel,service:service})
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function(db){
                q.reject(err);
            });
        return q.promise;
},
  total_company: function (db) {
      var q = Q.defer();
      var sql = 'SELECT count(*) as total FROM medical_company ';
          db.raw(sql)
            .then(function (rows) {
                q.resolve(rows[0][0].total)
            })
            .catch(function (err) {
                console.log(err)
                q.reject(err)
            });
        return q.promise;
},
  search_company: function(db,data){
      var q = Q.defer();
      var sql =   'SELECT * FROM medical_company  WHERE shop Like ? ';
      var query = '%' +data.shop+ '%';
            db.raw(sql,[query])
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
  page_company: function(db,startpage){
      var q = Q.defer();
      db('medical_company')
            .limit(20)
            .offset(startpage)
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
},
  check_duplicated_company: function (db,name) {
      var q = Q.defer();
      db('medical_company')
            .where('shop',name)
            .count('* as total')
            .then(function (rows) {
                q.resolve(rows[0].total)
            })
            .catch(function (err) {
                q.reject(err)
            });
        return q.promise;
},
//////////////////////////////////////////////////////  End Company //////////////////////////////////////////////////

  getListType_print: function(db,type_print){
        var q = Q.defer();
        db('medical_type')
            .select()
            .where('id',type_print)
            .orderBy('name','ASC')
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
},

  total_type: function (db) {
      var q = Q.defer();
      var sql = 'SELECT count(*) as total FROM medical_type ';
            db.raw(sql)
                .then(function (rows) {
                    q.resolve(rows[0][0].total)
                })
                .catch(function (err) {
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
},
  page_type: function(db,startpage){
      var q = Q.defer();
      db('medical_type')
            .limit(20)
            .offset(startpage)
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
},
  remove_type: function(db,id){
      var q = Q.defer();
      db('medical_type')
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
  check_duplicated_type: function (db,name) {
      var q = Q.defer();
      db('medical_type')
            .where('name',name)
            .count('* as total')
            .then(function (rows) {
                q.resolve(rows[0].total)
            })
            .catch(function (err) {
                q.reject(err)
            });
        return q.promise;
},
  update_type: function(db,id,name,age_l,age_h,depreciate_l,depreciate_h){
      var q = Q.defer();
      db('medical_type')
            .update({name:name,age_l:age_l,age_h:age_h,depreciate_l:depreciate_l,depreciate_h:depreciate_h})
            .where('id',id)
            .then(function(){
                q.resolve();
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
},
  save_type: function(db,name,age_l,age_h,depreciate_l,depreciate_h){
      var q = Q.defer();
      db('medical_type')
            .insert({name:name,age_l:age_l,age_h:age_h,depreciate_l:depreciate_l,depreciate_h:depreciate_h})
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function(db){
                q.reject(err);
            });
        return q.promise;
},

  search_type: function(db,data){
      var q = Q.defer();
      var sql = 'SELECT * FROM medical_type  WHERE name Like ? ';
      var query = '%' +data.name+ '%';
            db.raw(sql,[query])
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

  getListType: function(db){
      var q = Q.defer();
            db('medical_type')
                .select()
                .orderBy('name','ASC')
                .then(function (rows){
                    q.resolve(rows);
                })
                .catch(function(err){
                    q.reject(err);
                }) ;
            return q.promise;
},

///////////////////////////////////////////////////////// End Type /////////////////////////////////////////////////////////////

  get_department: function(db){
      var q = Q.defer();
            db('department')
                .select('id','depname','depcode')
                .orderBy('depcode','ASC')
                .then(function (rows){
                    q.resolve(rows);
                })
                .catch(function(err){
                    q.reject(err);
                }) ;
            return q.promise;
    },

  remove_department: function(db,id){
      var q = Q.defer();
            db('department')
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

  save_department: function(db,depname,depcode){
      var q = Q.defer();
            db('department')
                .insert({depname:depname,depcode:depcode})
                .then(function (rows) {
                    q.resolve(rows);
                })
                .catch(function(db){
                    q.reject(err);
                });
            return q.promise;
},

  update_department: function(db,id,depname,depcode){
      var q = Q.defer();
            db('department')
                .update({depname:depname,depcode:depcode})
                .where('id',id)
                .then(function(){
                    q.resolve();
                })
                .catch(function(err){
                    q.reject(err);
                });
            return q.promise;
},
    /////////////////////////////////////////////////////////////////// End Department ///////////////////////////////

  getListCategory: function(db){
      var q = Q.defer();
            db('durable_category')
                .select()
                .then(function (rows){
                    q.resolve(rows);
                })
                .catch(function(err){
                    q.reject(err);
                }) ;
            return q.promise;
},

  remove_category: function(db,id){
      var q = Q.defer();
            db('durable_category')
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

  update_category: function(db,id,name){
      var q = Q.defer();
            db('durable_category')
                .update({name:name})
                .where('id',id)
                .then(function(){
                    q.resolve();
                })
                .catch(function(err){
                    q.reject(err);
                });
            return q.promise;
},

  check_duplicated_category: function (db, name) {
      var q = Q.defer();
            db('durable_category')
                .where('name', name)
                .count('* as total')
                .then(function (rows) {
                    q.resolve(rows[0].total)
                })
                .catch(function (err) {
                    q.reject(err)
                });
    return q.promise;
},

  save_category: function(db,name){
      var q = Q.defer();
            db('durable_category')
                .insert({name:name})
                .then(function () {
                    q.resolve();
                })
                .catch(function(err){
                    q.reject(err);
                });
            return q.promise;
},

  search_category: function(db,data){
      var q = Q.defer();
      var sql =   'SELECT * FROM durable_category WHERE name Like ? ';
      var query = '%' +data.name+ '%';
            db.raw(sql,[query])
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

  total_category: function (db) {
      var q = Q.defer();
      var sql = 'SELECT count(*) as total FROM durable_category ';
            db.raw(sql)
                .then(function (rows) {
                    q.resolve(rows[0][0].total)
                })
                .catch(function (err) {
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
},

  page_category: function(db,startpage){
      var q = Q.defer();
          db('durable_category')
                .limit(10)
                .offset(startpage)
                .then(function (rows){
                    q.resolve(rows);
                })
                .catch(function(err){
                    q.reject(err);
                }) ;
            return q.promise;
},
/////////////////////////////////////////////////////////////////////////////// End Category ///////////////////////////

    getListItems_select2: function(db,data) {
        var q = Q.defer();
        var w = '%'+data.term+'%';
        db('medical_items')
            .select()
            .where('name', 'like', w)
            .orderBy('name', 'ASC')
            .limit(30)
            .offset(data.page)
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });
        return q.promise;
    },

    getCount_items_select2: function (db,data) {
        var q = Q.defer();
        var w = '%'+data.term+'%';
        db('medical_items')
            .where('name','like',w)
            .count('* as total')
            .then(function (rows) {
                q.resolve(rows[0].total)
            })
            .catch(function (err) {
                q.reject(err)
            });
        return q.promise;
    },

  getListItems: function(db){
      var q = Q.defer();
            db('medical_items')
                .select()
                .orderBy('name','ASC')
                .then(function (rows){
                    q.resolve(rows);
                })
                .catch(function(err){
                    q.reject(err);
                }) ;
            return q.promise;
},

  getListItems_print: function(db,items_print){
      var q = Q.defer();
            db('medical_items')
                .select()
                .where('id',items_print)
                .orderBy('name','ASC')
                .then(function (rows){
                    q.resolve(rows);
                })
                .catch(function(err){
                    q.reject(err);
                }) ;
            return q.promise;
    },

  total_items: function (db) {
      var q = Q.defer();
      var sql = 'SELECT count(*) as total FROM medical_items ';
            db.raw(sql)
                .then(function (rows) {
                    q.resolve(rows[0][0].total)
                })
                .catch(function (err) {
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
},

  page_items: function(db,startpage){
      var q = Q.defer();
            db('medical_items')
                .limit(20)
                .offset(startpage)
                .then(function (rows){
                    q.resolve(rows);
                })
                .catch(function(err){
                    q.reject(err);
                }) ;
            return q.promise;
},

  remove_items: function(db,id){
      var q = Q.defer();
            db('medical_items')
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

  search_items: function(db,data){
      var q = Q.defer();
      var sql = 'SELECT * FROM medical_items WHERE name Like ? ';
      var query = '%' +data.iname+ '%';
            db.raw(sql,[query])
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

  update_items: function(db,id,items_name,code){
      var q = Q.defer();
            db('medical_items')
                .update({name:items_name,code:code})
                .where('id',id)
                .then(function(){
                    q.resolve();
                })
                .catch(function(err){
                    q.reject(err);
                });
            return q.promise;
},

  save_items: function(db,items_name,code){
      var q = Q.defer();
            db('medical_items')
                .insert({name:items_name,code:code})
                .then(function (rows) {
                    q.resolve(rows);
                })
                .catch(function(db){
                    q.reject(err);
                });
            return q.promise;
},

  check_duplicated_items: function (db,items_name,code) {
        var q = Q.defer();
        db('medical_items')
            .where('name',items_name)
            .where('code',code)
            .count('* as total')
            .then(function (rows) {
                q.resolve(rows[0].total)
            })
            .catch(function (err) {
                q.reject(err)
            });
        return q.promise;
},
///////////////////////////////////////////////////// End items ///////////////////////////////////////////////

    getListStatus: function(db){
        var q = Q.defer();
        db('durable_status')
            .select()
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
    },

    remove_status: function(db,id){
        var q = Q.defer();
        db('durable_status')
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

    update_status: function(db,id,s_name){
        var q = Q.defer();
        db('durable_status')
            .update({name:s_name})
            .where('id',id)
            .then(function(){
                q.resolve();
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
    },

    check_duplicated_status: function (db,s_name) {
        var q = Q.defer();
        db('durable_status')
            .where('name',s_name)
            .count('* as total')
            .then(function (rows) {
                q.resolve(rows[0].total)
            })
            .catch(function (err) {
                q.reject(err)
            });

        return q.promise;
    },

    save_status: function(db,s_name){
        var q = Q.defer();
        db('durable_status')
            .insert({name:s_name})
            .then(function () {
                q.resolve();
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
    },

    search_status: function(db,data){
        var q = Q.defer();
        var sql =   'SELECT * FROM durable_status '+
            ' WHERE name Like ? ';
        var query = '%' +data.s_name+ '%';
        db.raw(sql,[query])
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

    total_status: function (db) {
        var q = Q.defer();
        var sql = 'SELECT count(*) as total FROM durable_status ';
        db.raw(sql)
            .then(function (rows) {
                q.resolve(rows[0][0].total)
            })
            .catch(function (err) {
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    page_status: function(db,startpage){
        var q = Q.defer();
        db('durable_status')
            .limit(10)
            .offset(startpage)
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
    },

    /////////////////////////////////////////////////////////////////////////////// End Status ///////////////////////////

    getListGuarantee: function(db){
        var q = Q.defer();
        db('guarantee')
            .select()
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
    },

    remove_guarantee: function(db,id){
        var q = Q.defer();
        db('guarantee')
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

    update_guarantee: function(db,id,g_name){
        var q = Q.defer();
        db('guarantee')
            .update({name:g_name})
            .where('id',id)
            .then(function(){
                q.resolve();
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
    },

    check_duplicated_guarantee: function (db,g_name) {
        var q = Q.defer();
        db('guarantee')
            .where('name',g_name)
            .count('* as total')
            .then(function (rows) {
                q.resolve(rows[0].total)
            })
            .catch(function (err) {
                q.reject(err)
            });

        return q.promise;
    },

    save_guarantee: function(db,g_name){
        var q = Q.defer();
        db('guarantee')
            .insert({name:g_name})
            .then(function () {
                q.resolve();
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
    },

    search_guarantee: function(db,data){
        var q = Q.defer();
        var sql =   'SELECT * FROM guarantee '+
            ' WHERE name Like ? ';
        var query = '%' +data.g_name+ '%';
        db.raw(sql,[query])
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

    total_guarantee: function (db) {
        var q = Q.defer();
        var sql = 'SELECT count(*) as total FROM guarantee ';
        db.raw(sql)
            .then(function (rows) {
                q.resolve(rows[0][0].total)
            })
            .catch(function (err) {
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    page_guarantee: function(db,startpage){
        var q = Q.defer();
        db('guarantee')
            .limit(10)
            .offset(startpage)
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
    },

    /////////////////////////////////////////////////////////////////////////////// End Guarantee ///////////////////////////

    getListRoom_select2: function(db,data) {
        var q = Q.defer();
        var w = '%'+data.term+'%';
        db('medical_room')
            .select()
            .where('name', 'like', w)
            .orderBy('name', 'ASC')
            .limit(30)
            .offset(data.page)
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });
        return q.promise;
    },

    getCount_room_select2: function (db,data) {
        var q = Q.defer();
        var w = '%'+data.term+'%';
        db('medical_room')
            .where('name','like',w)
            .count('* as total')
            .then(function (rows) {
                q.resolve(rows[0].total)
            })
            .catch(function (err) {
                q.reject(err)
            });
        return q.promise;
    },

    getListRoom_print: function(db,room_print){
        var q = Q.defer();
        db('medical_room')
            .select()
            .where('id',room_print)
            .orderBy('name','ASC')
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
    },

    getListRoom: function(db){
        var q = Q.defer();
        db('medical_room')
            .select()
            .orderBy('name','ASC')
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
    },

    get_room: function (db) {
        var q = Q.defer();
        var sql = 'SELECT r.id,r.name as Room FROM  medical_room r  ';
        db.raw(sql)
            .then(function (rows) {
                q.resolve(rows[0])
            })
            .catch(function (err) {
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    total_room: function (db) {
        var q = Q.defer();
        var sql = 'SELECT Count(*) as total FROM  medical_room r  ';
        db.raw(sql)
            .then(function (rows) {
                q.resolve(rows[0][0].total)
            })
            .catch(function (err) {
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    page_room: function(db,startpage){
        var q = Q.defer();
        var sql = 'SELECT r.id,r.name as Room FROM  medical_room r '+
            'limit 20 offset ? ';
        db.raw(sql,[startpage])
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    remove_room: function(db,id){
        var q = Q.defer();
        db('medical_room')
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

    save_room: function(db,r_name){
        var q = Q.defer();
        db('medical_room')
            .insert({name:r_name})
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function(db){
                q.reject(err);
            });
        return q.promise;
    },

    check_duplicated_room: function (db,r_name) {
        var q = Q.defer();
        db('medical_room')
            .where('name',r_name)
            .count('* as total')
            .then(function (rows) {
                q.resolve(rows[0].total)
            })
            .catch(function (err) {
                q.reject(err)
            });
        return q.promise;
    },

    update_room: function(db,id,r_name){
        var q = Q.defer();
        db('medical_room')
            .update({name:r_name})
            .where('id',id)
            .then(function(){
                q.resolve();
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
    },

    search_room: function(db,data){
        var q = Q.defer();
        var sql = 'SELECT r.id,r.name as Room FROM  medical_room r WHERE r.name Like ? ';
        var query = '%' +data.r_name+ '%';
        db.raw(sql,[query])
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
/////////////////////////////////////////////////////////////////// End Department ///////////////////////////////

        getListMoney: function(db){
            var q = Q.defer();
            db('durable_where_money')
                .select()
                .then(function (rows){
                    q.resolve(rows);
                })
                .catch(function(err){
                    q.reject(err);
                }) ;
            return q.promise;
        },

    remove_money: function(db,id){
        var q = Q.defer();
        db('wheremoney')
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

    update_money: function(db,id,provide,limit){
        var q = Q.defer();
        db('wheremoney')
            .update({provide:provide,limit:limit})
            .where('id',id)
            .then(function(){
                q.resolve();
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
    },

    save_money: function(db,provide,limit){
        var q = Q.defer();
        db('wheremoney')
            .insert({provide:provide,limit:limit})
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function(db){
                q.reject(err);
            });
        return q.promise;
    },

    total_money: function (db) {
        var q = Q.defer();
        var sql = 'SELECT count(*) as total FROM wheremoney ';
        db.raw(sql)
            .then(function (rows) {
                q.resolve(rows[0][0].total)
            })
            .catch(function (err) {
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    search_money: function(db,data){
        var q = Q.defer();
        var sql =   'SELECT * FROM wheremoney '+
            ' WHERE provide Like ? ';
        var query = '%' +data.provide+ '%';
        db.raw(sql,[query])
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

    page_money: function(db,startpage){
        var q = Q.defer();
        db('wheremoney')
            .limit(20)
            .offset(startpage)
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
    },

    check_duplicated_money: function (db,provide) {
        var q = Q.defer();
        db('wheremoney')
            .where('provide',provide)
            .count('* as total')
            .then(function (rows) {
                q.resolve(rows[0].total)
            })
            .catch(function (err) {
                q.reject(err)
            });
        return q.promise;
    },
//////////////////////////////////////////////////////  End Company //////////////////////////////////////////////////

    getListYear: function(db){
        var q = Q.defer();
        db('year')
            .select()
            .orderBy('id','desc')
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
    }
//////////////////////////////////////////////////// End year /////////////
};