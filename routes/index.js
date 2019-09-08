var express = require('express');
var router = express.Router();
var Models =  require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  Models.User.findAll({
    include : [{
      model: Models.UserImages,
  }]
  }).then(users => {
    console.log("All users:", users);
    res.send(users);
  });
});

module.exports = router;
