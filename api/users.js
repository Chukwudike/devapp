const express = require('express');
const Router = express.Router();


//@route GET api/users/test
//@desc test user route
//access public


Router.get('/test',(req,res)=> res.json({msg:"This is to test user route"}));

module.exports = Router;