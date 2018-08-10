const validator = require("validator");
const isEmpty = require("./is-Empty");
module.exports =  data => {

  let errors = {};
  

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  
//Email Validation
 
  if(!validator.isEmail(data.email)){
    errors.email = "Email is invalid";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  //Password Validation

  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
 
  //return error and validate if empty
  return {
    errors: errors,
    isError: isEmpty(errors)
  };
};

