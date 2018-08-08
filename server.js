const express = require('express');
const mongoose = require('mongoose');

const app = express();

const users = require('./api/users');
const profile = require('./api/profile');
const posts = require('./api/posts');

//DB config
const db = require('./config/keys').Mongourl;

//Connect to Mongoose Db
mongoose.connect(db)
.then(()=>console.log('You are connected to the database'))
.catch(err=>console.log(err));

app.get('/' , (req,res)=>res.send('Hello'));

//use routes

app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);



const port = process.env.PORT || 5000;
app.listen(port,()=>console.log(`Server running on port ${port}`));
