const express = require('express');
const Router = express.Router();


//@route GET api/profile/test
//@desc test profile route
//access private

Router.get('/test',(req,res)=> res.json({msg:"This is to test Profile route"}));

module.exports = Router;