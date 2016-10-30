var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
    if (req.session.level_user_id != 2){
        res.render('./page/access_denied')
    } else {
        res.render('./page/durable_admin');
    }
});

module.exports = router;
