const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
const Post = require("../../model/Post");
const Profile = require("../../model/Profile");
const passport = require("passport");
const User = require("../../model/User");
//@route GET api/posts/test
//@desc test post route
//@access private

Router.get("/test", (req, res) =>
  res.json({ msg: "This is to test Post route" })
);

//@route POST api/posts/
//@desc  posts route
//@access private

Router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const validatePostInput = require("../../validation/posts");
    const { errors, isError } = validatePostInput(req.body);
    if (!isError) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      user: req.user.id,
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.name
    });
    newPost
      .save()
      .then(post => res.json(post))
      .catch(err => res.status(400).json(err));
  }
);

//@route GET api/posts/
//@desc  get all posts
//@access public

Router.get("/", (req, res) => {
  Post.find({})
    .populate("user", "name")
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ noposts: "no posts found" }));
});

//@route GET api/posts/:post_id
//@desc  get specific post
//@access public

Router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .populate("user", "name")
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopost: "no post found with that id" })
    );
});

//router Delete api/posts/
//desc delete a post by logged in user
// access private

Router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ userid: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //validate owner of post
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ unauthorized: "User is not authorized" });
          }
          //Delete
          post
            .remove()
            .then(() => res.json({ success: "post deleted successully" }));
        })
        .catch(err => res.status(400).json(err));
    });
  }
);


//router Like api/posts/like/:id
//desc delete a post by logged in user
// access private

Router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ userid: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Confirm if post has been liked
          if ( post.likes.filter(like =>  like.user.toString() === req.user.id).length > 0 ) {
            return res
              .status(401)
              .json({ alreadyLiked: "User has Liked post" });
          }
          // Like post by adding id to array
          post.likes.unshift({user : req.user.id});

          post.save().then(post=>res.json(post))
           
        })
        .catch(err => res.status(400).json(err));
    });
  }
);

Router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ userid: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Confirm if post has NOT been liked
          if ( post.likes.filter(like =>  like.user.toString() === req.user.id).length === 0 ) {
            return res
              .status(401)
              .json({ alreadyLiked: "You have not liked the post" });
          }
          // Like post by adding id to array
          const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
          post.likes.splice(removeIndex,1);

          post.save().then(post=>res.json(post))
           
        })
        .catch(err => res.status(400).json(err));
    });
  }
);

//router Comment api/posts/comment/:id
//desc add comment to post by logged in user
// access private

Router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const validatePostInput = require("../../validation/posts");
    const { errors, isError } = validatePostInput(req.body);
    if (!isError) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ userid: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Add post
          const newComment = new Post({
            text : req.body.text,
            name : req.body.name,
            avatar : req.body.avatar,
            user : req.user.id
          })
          
          // Like post by adding id to array
          post.comments.unshift(newComment);

          post.save().then(newpost=>res.json(newpost))
           
        })
        .catch(err => res.status(400).json(err));
    });
  }
);

Router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    Profile.findOne({ userid: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Check if post exists
          if(post.comments.filter(item => item._id.toString()===req.params.comment_id).length===0){
            return res.status(404).json({commentnotexists : 'Comments does not exist'})
          } 
          //Splice for array!!!
          const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);
          post.comments.splice(removeIndex);
          post.save().then(()=>res.json({comments : "Deleted"}));
          })
           
        })
        .catch(err => res.status(400).json(err));
      }
);




module.exports = Router;
