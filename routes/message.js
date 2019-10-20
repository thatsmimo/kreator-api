const express = require('express');
const router = express.Router();
const multer  =   require('multer');
const Models = require('../models');
const Op = require('sequelize').Op;

const storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/files');
  },
  filename: function (req, file, callback) {
    let extension = file.mimetype.split('/')
    callback(null, file.fieldname + '-' + Date.now()+'.'+extension[1]);
  }
});
const upload = multer({storage: storage});

/* Message List */
router.post('/list', async (req, res) => {
  let payload = req.body;
  try{
    let messageList = await Models.messageList.findAll({
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
    let messageList = await Models.message.findAll({
      where: {
        [Op.or]: [
          {[Op.and]: [{userId : payload.userId}, {receiverId : payload.chatUserId}]},
          {[Op.and]: [{userId : payload.chatUserId}, {receiverId : payload.userId}]}
        ]
      },
      order: [
        ['id', 'DESC'],
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

/* Message send */
router.post('/send', upload.single('attachment'), async (req, res) => {
  let payload = req.body;
  var data;
  try{
    var payloadForMessageList;

    if(payload.messageType == 'attachment') {
      payload.attachmentLink = req.file.filename
      let response = await Models.message.create(payload);
      data = response.dataValues;
      console.log("data",response)
      payloadForMessageList = {
        userId : payload.userId,
        receiverId : payload.receiverId,
        lastMessage : 'Attachment'
      }
    } else {
      let response = Models.message.create(payload);
      payloadForMessageList = {
        userId : payload.userId,
        receiverId : payload.receiverId,
        lastMessage : payload.message
      }
    }
    // Inserting or update the message list table
    let messageList = await Models.messageList.findOne({
      where : {
        [Op.or]: [
          {[Op.and]: [{userId : payload.userId}, {receiverId : payload.receiverId}]},
          {[Op.and]: [{userId : payload.receiverId}, {receiverId : payload.userId}]}
        ]
      }
    })
    console.log(messageList);
    // Message list already has entry
    if(messageList == null) {
      let messageListResponse = await Models.messageList.create(payloadForMessageList);
      console.log(messageListResponse)
    } else {
      let messageListResponse = await Models.messageList.update(
        { lastMessage: 'Attachment' },
        { where: { id: messageList.dataValues.id  } }
      );
      console.log(messageListResponse)
    }
    let response = {
      ack: 1,
      msg: 'message send successfully',
      data: data,
    };
    res.send(response);
  } catch(e) {
    let response = {
      ack: 0,
      msg: 'message was not send',
      devMsg: e,
    };
    res.send(response);
    console.log(e)
  }
});


module.exports = router;
