const express = require('express');
const router = express.Router();
const Models = require('../models');
const Op = require('sequelize').Op;

/* Message List */
router.post('/list', async (req, res) => {
  var payload = req.body;
  try{
    var messageList = await Models.messageList.findAll({
      where : {
        [Op.or] : [{userId : payload.userId}, {receiverId : payload.userId}]
      },
      include: [
        { 
          model: Models.User, 
          as: 'User',
          include: [
            {
              model: Models.UserImages, 
              as: 'Image',
            }
          ]
        },
        { 
          model: Models.User, 
          as: 'Receiver',
          include: [
            {
              model: Models.UserImages, 
              as: 'Image',
            }
          ]
        },
      ]
    });
    let response = {
      ack: 1,
      msg: 'message List',
      data: messageList
    };
    res.send(response);
  } catch(e) {
    console.log(e)
    let response = {
      ack: 1,
      msg: 'message List',
      devMsg: e,
      data: messageList
    };
    res.send(response);
  }
});

/* Message details page */
router.post('/details', async (req, res) => {
  let payload = req.body;
  try {
    var messageList = await Models.message.findAll({
      where: {
        [Op.or]: [
          {[Op.and]: [{userId : payload.userId}, {receiverId : payload.chatUserId}]},
          {[Op.and]: [{userId : payload.chatUserId}, {receiverId : payload.userId}]}
        ]
      }
    });
    let response = {
      ack: 1,
      msg: 'message List',
      data: messageList
    };
    res.send(response);
  } catch(e) {
    console.log(e)
    let response = {
      ack: 1,
      msg: 'message List',
      devMsg: e,
      data: messageList
    };
    res.send(response);
  }
});

/* Message send */
router.post('/add', async (req, res) => {
  var payload = req.body;
  console.log(payload)
  try{
    var response = Models.posts.create(payload);
    console.log(response);
  } catch(e) {
    console.log(e)
  }
  res.send('sda');
});

module.exports = router;