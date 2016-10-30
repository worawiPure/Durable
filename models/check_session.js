var Q = require('q');

module.exports = {

    Chack_sesion: function(db,id,user){
        var q = Q.defer();
        db('asset_register')
            .where({
                id:id,
                username:user
            })
            .count('* as total')
            .then(function(rows){
                q.resolve(rows[0].total);
            })
            .catch(function (err){
                q.reject(err);
            });
        return q.promise;
    }
};