const validator = require("validator");
const isEmpty = require("./is-Empty");
module.exports = data => {
  let errors = {};

  data.text= !isEmpty(data.text) ? data.text : "";


  //Required fields validation

  if (!validator.isLength(data.text, { min: 10, max: 500 })) {
   errors.text = "Text must be at least 10 characters";
 }

  if (validator.isEmpty(data.text)) {
    errors.text = "Post content is required";
  }

  
  
  //return error and validate if empty
  return {
    errors: errors,
    isError: isEmpty(errors)
  };
};

