const express = require("express");
const Router = express.Router();
const Profile = require("../../model/Profile");
const User = require("../../model/User");
const mongoose = require("mongoose");
const passport = require("passport");

//@route GET api/profile/test
//@desc test profile route
//@access private

Router.get("/test", (req, res) =>
  res.json({ msg: "This is to test Profile route" })
);

//@route GET api/profile
//@desc test profile route
//@access private

Router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    errors = {};
    //console.log(req.user._id);
    Profile.findOne({ userid: req.user._id })
      .populate("userid", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "You currently dont have a profile";
          return res.status(404).json(errors);
        }
        res.status(200).json(profile);
      })
      .catch(err => res.status(400).json(err));
  }
);

//@route POST api/profile
//@desc Create or edit profile
//@access private

//Load validation
const validateProfileInput = require("../../validation/profile");

Router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isError } = validateProfileInput(req.body);
    if (!isError) {
      return res.status(400).json(errors);
    }
    const profileFields = {};
    profileFields.userid = req.user._id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    //skills - split into array
    if (typeof req.body.skills !== "undefined")
      profileFields.skills = req.body.skills.split(",");

    //social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({ userid: req.user._id }).then(profile => {
      if (profile) {
        console.log(req.body);
        console.log(profileFields.social);

        //Update user if it exists already
        Profile.findOneAndUpdate(
          { userid: req.user._id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //Create
        //Check if handle exists
        Profile.findOne({ handle: req.user.handle }).then(handle => {
          if (handle) {
            errors.handle = "This handle already exists";
            res.status(400).json(errors);
          }
          new Profile(profileFields).save().then(profile => {
            console.log(req.body);

            res.status(200).json(profile);
          });
        });
      }
    });
  }
);

//@route POST api/profile/expereince
//@desc experience for profile
//@access private

//Load validation
const validateExperienceInput = require("../../validation/experience");

Router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ userid: req.user.id }).then(profile => {
      const { errors, isError } = validateExperienceInput(req.body);
      if (!isError) {
        return res.status(400).json(errors);
      }
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to array
      profile.experience.unshift(newExp);
      // save experience
      profile.save().then(newprofile => res.json(newprofile));
    });
  }
);

//@route POST api/profile/education
//@desc education for profile
//@access private

//Load validation
const validateEducationInput = require("../../validation/education");

Router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ userid: req.user.id }).then(profile => {
      const { errors, isError } = validateEducationInput(req.body);
      if (!isError) {
        return res.status(400).json(errors);
      }
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to array
      profile.education.unshift(newEdu);
      // save experience
      profile.save().then(newprofile => res.json(newprofile));
    });
  }
);

//@route DELETE api/profile/experience
//@desc experience for profile
//@access private

Router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ userid: req.user.id })
      .then(profile => {
        //Get remove index
        const removeindex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);
        profile.experience.splice(removeindex, 1);
        //save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(400).json(err));
  }
);

//@route DELETE api/profile/education
//@desc experience for profile
//@access private

Router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ userid: req.user.id })
      .then(profile => {
        //Get remove index
        const removeindex = profile.education
          .map(item => item.id)
          .indexOf(req.params.exp_id);
        profile.education.splice(removeindex, 1);
        //save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(400).json(err));
  }
);

//@route DELETE api/profile/
//@desc delete profile and user
//@access private

Router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ userid: req.user.id })
      .then(() => {
        User.findOneAndRemove({ _id: req.user.id }).then(() =>
          res.json({ success: true })
        );
      })
      .catch(err => res.status(400).json(err));
  }
);

module.exports = Router;
