const validator = require("validator");
const isEmpty = require("./is-Empty");
module.exports = data => {
  let errors = {};

  data.title= !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";


  //Required fields validation


  if (validator.isEmpty(data.title)) {
    errors.title = "Job title is required";
  }

  if (validator.isEmpty(data.company)) {
    errors.company = "Company is required";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "From date field is required";
  }
  
  //return error and validate if empty
  return {
    errors: errors,
    isError: isEmpty(errors)
  };
};

