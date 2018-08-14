const validator = require("validator");
const isEmpty = require("./is-Empty");
module.exports = data => {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";


  //Required fields validation

  if (!validator.isLength(data.handle, { min: 2, max: 30 })) {
    errors.handle = "Handle must be between 2 and 30 characters";
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle field is required";
  }

  if (validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }
  if (validator.isEmpty(data.skills)) {
    errors.skills = "Your skills are required";
  }
  //Unrequired fields validation
if(!isEmpty(data.website)){
   if(!validator.isURL(data.website)){
      errors.website = "This is not a valid url"
   }
}

if(!isEmpty(data.facebook)){
   if(!validator.isURL(data.facebook)){
      errors.facebook = "This is not a valid url"
   }
}
if(!isEmpty(data.twitter)){
   if(!validator.isURL(data.twitter)){
      errors.twitter = "This is not a valid url"
   }
}
if(!isEmpty(data.linkedin)){
   if(!validator.isURL(data.linkedin)){
      errors.linkedin = "This is not a valid url"
   }
}
if(!isEmpty(data.instagram)){
   if(!validator.isURL(data.instagram)){
      errors.instagram = "This is not a valid url"
   }
}
if(!isEmpty(data.youtube)){
   if(!validator.isURL(data.youtube)){
      errors.youtube = "This is not a valid url"
   }
}


  //return error and validate if empty
  return {
    errors: errors,
    isError: isEmpty(errors)
  };
};

