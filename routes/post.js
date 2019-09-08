const express = require('express');
const router = express.Router();
const Models = require('../models');


/* User post */
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