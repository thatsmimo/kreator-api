const express = require('express');
const router = express.Router();
const Models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AuthCheck= require('./helper');

const saltRounds = 10;


/* POST users sign up. */
router.post('/signUp', function(req, res) {
  var payload = req.body;
  Models.User.findOne({where:{email:req.body.email}}).then(data => {
    if(data == null) {
      bcrypt.hash(payload.password, saltRounds, function(err, hash) {
        payload.password = hash ; 
        var entryData = {
          username : payload.username,
          email : payload.email,
          password : payload.password ,
          address : payload.address
        };

        Models.User.create(entryData).then(data => {
          var responseData = {
            userData : data.dataValues,
            ack : 1,
            msg : 'signed up successfully'
          };
          res.send(responseData);
        })
      });
    } else {
      var responseData = {
        ack : 0,
        msg : 'This email is already registered with us'
      }
      res.send(responseData);
    }
  })
});




/* POST users sign in.*/
router.post('/login', function(req, res) {
  var payload = req.body;
  Models.User.findOne({
    where: {
      email : payload.email
    }
  }).then(data => {
    if(data != null) {
      bcrypt.compare(payload.password, data.dataValues.password, function(err, response) {
        if(response == true) {

          // create a token
          var token = jwt.sign({ id: data.dataValues.id }, 'thatsmimo', {
            expiresIn: 42000000000 // expires in 24 hours
          });
          console.log(token)
          var responseData = {
            userData : data.dataValues,
            token : token,
            ack : 1,
            msg : 'logged in successfully'
          };
          res.send(responseData);
        } else {
          var responseData = {
            userData : {},
            ack : 0,
            msg : 'You have entered wrong password'
          };
          res.send(responseData);
        }
      });
    } else {
      var responseData = {
        userData : {},
        ack : 0,
        msg : 'You have entered wrong email or password'
      };
      res.send(responseData);
    }
  });
});


/* GET home page. */
router.post('/token', function(req, res, next) {
  console.log('token=>',req.body.token)
  jwt.verify(req.body.token, 'thatsmimo', function(err, decoded) {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
   }else{
    res.send('success');
   }
  });
  // res.send('success');
});


router.post('/checking', function(req, res, next) {
  // console.log('token=>',AuthCheck.checkMe(req.body.token))
  if(AuthCheck.checkMe(req.body.token)){
    res.send('success');
  }else{
    res.send('fail');
  }
   
});


module.exports = router;
