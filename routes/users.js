const express = require('express');
const router = express.Router();
const Models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer  =   require('multer');
const helper = require('./helper');


const saltRounds = 10;

const storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/files');
  },
  filename: function (req, file, callback) {
    let extension = file.mimetype.split('/')
    callback(null, file.fieldname + '-' + Date.now()+'.'+extension[1]);
  }
});
var upload = multer({ storage : storage });


/* POST users sign up. */
router.post('/signUp', function (req, res) {
  var payload = req.body;
  Models.User.findOne({ where: { email: req.body.email } }).then(data => {
    if (data == null) {
      bcrypt.hash(payload.password, saltRounds, function (err, hash) {
        payload.password = hash;
        var entryData = {
          username: payload.username,
          email: payload.email,
          password: payload.password,
          address: payload.address,
          firstName: payload.firstName,
          lastName: payload.lastName,
          profileImage: 'default-image.png',
          active: 0
        };

        Models.User.create(entryData).then(data => {
          let otp = Math.floor(100000 + Math.random() * 900000);
          Models.otp.create({ userId: data.id, otp: otp });
          helper.sendMail(data.email, 'Kreator SignUp Otp', 'Your signup otp is ' + otp);
          var responseData = {
            userData: data.dataValues,
            ack: 1,
            msg: 'signed up successfully'
          };
          res.send(responseData);
        })
      });
    } else {
      var responseData = {
        ack: 0,
        msg: 'This email is already registered with us'
      }
      res.send(responseData);
    }
  })
});


/* POST users sign in.*/
router.post('/login', function (req, res) {
  var payload = req.body;
  Models.User.findOne({
    where: {
      email: payload.email
    },
    include: [
      {
        model: Models.UserImages,
        as: 'Image',
      },
      {
        model: Models.educations,
        as: 'Educations',
      },
    ]
  }).then(data => {
    if (data != null) {
      bcrypt.compare(payload.password, data.dataValues.password, function (err, response) {
        if (response == true) {

          // create a token
          var token = jwt.sign({ id: data.dataValues.id }, 'thatsmimo', {
            expiresIn: 42000000000 // expires in 24 hours
          });
          console.log(token)
          var responseData = {
            userData: data.dataValues,
            token: token,
            ack: 1,
            msg: 'logged in successfully'
          };
          res.send(responseData);
        } else {
          var responseData = {
            userData: {},
            ack: 0,
            msg: 'You have entered wrong password'
          };
          res.send(responseData);
        }
      });
    } else {
      var responseData = {
        userData: {},
        ack: 0,
        msg: 'You have entered wrong email or password'
      };
      res.send(responseData);
    }
  });
});


/* GET home page. */
router.post('/token', function (req, res, next) {
  console.log('token=>', req.body.token)
  jwt.verify(req.body.token, 'thatsmimo', function (err, decoded) {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    } else {
      res.send('success');
    }
  });
  // res.send('success');
});


router.post('/checking', function (req, res, next) {
  // console.log('token=>',AuthCheck.checkMe(req.body.token))
  if (AuthCheck.checkMe(req.body.token)) {
    res.send('success');
  } else {
    res.send('fail');
  }

});


/* POST change password   */
router.post('/changePassword', function (req, res) {
  var payload = req.body
  console.log("data", req.body)
  Models.User.findOne({
    where: {
      id: payload.userId
    }
  })
    .then(function (data) {
      bcrypt.compare(payload.oldPassword, data.dataValues.password, function (err, response) {
        if (response == true) {
          bcrypt.hash(payload.newPassword, saltRounds, function (err, hash) {
            payload.newPassword = hash;
            Models.User.find({ where: { id: payload.userId } })
              .on('success', function (data) {
                // Check if record exists in db
                if (data) {
                  data.update({ password: payload.newPassword })
                    .success(function () {
                      var responseData = {
                        ack: 1,
                        msg: 'Password changed successfully'
                      };
                      res.send(responseData);
                    })
                }
              })
          });
        } else {
          var responseData = {
            ack: 0,
            msg: 'Password did not match with old password'
          };
          res.send(responseData);
        }
      });
    })
});


router.post('/otp', async (req, res) => {
  var payload = req.body
  console.log(payload);
  try {
    let response = await Models.otp.findOne({
      where: { userId: payload.userId }
    });
    console.log(response.dataValues)
    if (parseInt(response.dataValues.otp) == payload.otp) {
      Models.User.update(
        { active: 1 },
        { where: { id: payload.userId } }
      )
      let user = await Models.User.findOne({
        where: { id: payload.userId },
        include: [
          {
            model: Models.UserImages,
            as: 'Image',
          },
        ]
      });
      var responseData = {
        ack: 1,
        msg: 'Otp Confirmed',
        data: user.dataValues,
      };
      res.send(responseData);
    } else {
      var responseData = {
        ack: 0,
        msg: 'Otp did not match'
      };
      res.send(responseData);
    }
    console.log(response);
  } catch (e) {
    var responseData = {
      ack: 0,
      msg: 'Otp did not match',
      devMsg: e
    };
    res.send(responseData);
  }
})

/*POST edit profile*/
router.post('/profile/edit', async (req, res) => {
  var payload = req.body;
  console.log('payload ==> ', payload);
  try {
    await Models.User.update(
      payload,
      { where: { id: payload.id } }
    );
    var response = {
      ack: 1,
      msg: 'Profile Updated Successfully!'  
    };
    res.send(response);
  } catch (e) {
    var response = {
      ack: 0,
      msg: 'Some Exception(s) ocurred!',
      devMsg: e
    };
    res.send(response);
  }
});


/*
change profile picture
*/
router.use('/changeProfiePicture', upload.single('pic'), async (req, res) => {
  var payload = req.body;
  console.log(req);
})



module.exports = router;
