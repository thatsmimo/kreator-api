const express = require('express');
const router = express.Router();
const multer  =   require('multer');
const Models = require('../models');
const Sequelize = require('sequelize');

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

/*
* Post add
*/
router.post('/add', upload.array('attachment', 5), async (req, res) => {
  var payload = req.body;
  console.log(req)
  try {
    var response = await Models.posts.create(payload);
    console.log(response);
    if (req.files.length > 0) {
      req.files.map((eachFile) => {
        let type = eachFile.mimetype.split('/');
        let attachmentData = {
          filename : eachFile.filename,
          type : type[0],
          postId : response.dataValues.id
        }
        Models.postAttachment.create(attachmentData)
      })
      console.log(req.files);
    }
    let responseData = {
      ack: 1,
      msg: 'Posted successfully',
      data: response.dataValues,
    };
    res.send(responseData);
  } catch(e) {
    let responseData = {
      ack: 0,
      msg: 'unable to post',
      devMsg: e
    };
    res.send(responseData);
    console.log(e)
  }
});


/*
* Post List
*/
router.post('/list', async (req, res) => {
  var payload = req.body;
  console.log(payload);
  try{
    var limit = 10;
    var response = await Models.posts.findAll({
      offset : (payload.page-1)*limit,
      limit : limit,
      order: [
        ['createdAt', 'DESC'],
      ],
      include: [
        {
          model: Models.User,
          as: 'User',
          attributes: ['firstName', 'lastName', 'profileImage', 'id', 'email'],
          include: [
            {
              model: Models.UserImages,
              as: 'Image',
            }
          ]
        },
        {
          model: Models.postAttachment,
        },
        {
          model: Models.postLike,
          as : 'selfLike',
          where:{ userId: payload.userId },
          required: false
        },
        {
          model: Models.postLike,
          as : 'totalLike',
          include: [
            {
              model: Models.User,
              as: 'User',
              attributes: ['firstName', 'lastName', 'profileImage', 'id', 'email'],
            }
          ]
        },
        {
          model: Models.postComment,
          limit : 1,
          order: [
            ['createdAt', 'DESC'],
          ],
          required: false
        },
      ]
    });
    console.log(response)
    let responseData = {
      ack: 1,
      msg: 'list',
      data: response,
    };
    res.send(responseData);
  } catch (e){
    let responseData = {
      ack: 0,
      msg: 'list not found',
      devMsg: e
    };
    res.send(responseData);
    console.log(e)
  }
});


/*
* Post Details
*/
router.post('/details', async (req, res) => {
  var payload = req.body;
  console.log(payload);
  try {
    var response = await Models.posts.findOne({
      where : {id : payload.postId},
      include: [
        {
          model: Models.User,
          as: 'User',
          attributes: ['username', 'profileImage', 'id', 'email'],
          include: [
            {
              model: Models.UserImages,
              as: 'Image',order: [
                ['createdAt', 'DESC'],
              ],
            }
          ]
        },
        {
          model: Models.postAttachment,
        },
        {
          model: Models.postLike,
          as : 'selfLike',
          where:{ userId: payload.userId },
          required: false,
        },
        {
          model: Models.postLike,
          as : 'totalLike',
          order: [
            ['createdAt', 'DESC'],
          ],
          include : [
            {
              model: Models.User,
              as: 'User',
              attributes: ['username', 'profileImage', 'id', 'email'],
            }
          ]
        },
        {
          model: Models.postComment,
          order: [
            ['createdAt', 'DESC'],
          ],
          required: false,
          include : [
            {
              model: Models.User,
              as: 'User',
              attributes: ['username', 'profileImage', 'id', 'email'],
              include: [
                {
                  model: Models.UserImages,
                  as: 'Image',
                }
              ]
            }
          ]
        },
      ]
    });
    console.log(response)
    let responseData = {
      ack: 1,
      msg: 'list',
      data: response,
    };
    res.send(responseData);
  } catch (e) {
    let responseData = {
      ack: 0,
      msg: 'list not found',
      devMsg: e
    };
    res.send(responseData);
    console.log(e)
  }
});


/*
* Post like
*/
router.post('/like', async (req, res) => {
  var payload = req.body;
  console.log(req)
  try {
    var response = await Models.postLike.create(payload);
    console.log(response);
    let responseData = {
      ack: 1,
      msg: 'Liked successfully',
      data: response.dataValues,
    };
    res.send(responseData);
  } catch(e) {
    let responseData = {
      ack: 0,
      msg: 'unable to like',
      devMsg: e
    };
    res.send(responseData);
    console.log(e)
  }
});


/*
* Post Comment
*/
router.post('/comment', async (req, res) => {
  var payload = req.body;
  console.log(req)
  try {
    var response = await Models.postComment.create(payload);
    console.log(response);
    let responseData = {
      ack: 1,
      msg: 'Commented successfully',
      data: response.dataValues,
    };
    res.send(responseData);
  } catch(e) {
    let responseData = {
      ack: 0,
      msg: 'unable to comment',
      devMsg: e
    };
    res.send(responseData);
    console.log(e)
  }
});



module.exports = router;