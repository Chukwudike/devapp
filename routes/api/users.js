const express = require("express");
const Router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const User = require("../../model/User");
const jwt = require("jsonwebtoken");
const key = require("../../config/keys");
const passport = require("passport");

//load input validation
const validateRegisterInput = require("../../validation/register"); 
const validateLoginInput = require("../../validation/login");

//@route POST api/users/register
//@desc Register user route
//access Public

Router.post("/register", (req, res) => {
const {errors,isError} = validateRegisterInput(req.body);
  if(!isError){
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "email already exists"
      return res.status(400).json({ errors });
    } else {
      const avatar = gravatar.url({
        s: "200", //sive
        r: "pg", //rating
        d: "mm" //Rating
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;
          newUser
            .save()
            .then(newuser => res.json(newuser))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route POST api/users/login
//@desc Login user and return JWT
//access Public
Router.post("/login", (req, res) => {
  const {errors,isError} = validateLoginInput(req.body);
  if(!isError){
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.user = "User does not exist"
      res.status(400).json( errors);
    } else {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          errors.password = "Incorrect Password, Kindly input correct password";
          res
            .status(400)
            .json(errors);
        } else {
          const payload = { id: user.id, name: user.name, avatar: user.avatar };
          jwt.sign(
            payload,
            key.SecretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
          //res.status(200).json({ msg: "Welcome Bro!" });
        }
      });
    }
  });
});

//@route GET api/users/current
//@desc return current user
//access Private

Router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => res.json({
    id : req.user.id,
    name : req.user.name,
    email : req.user.email
  })
);

module.exports = Router;
