const express = require('express');
const Router = express.Router();

Router.get('/test',(req,res)=> res.json({msg:"This is to test Post route"}));

module.exports = Router;