var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const dbConnection = require('../lib/database');
const { body, validationResult } = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
  });
// DECLARING CUSTOM MIDDLEWARE
console.log('test session use will be use in next line')
const ifNotLoggedin = (req, res, next) => {
    console.log(!req.session.isLoggedIn);
    if(!req.session.isLoggedIn){
        console.log('hulay i use');
        return res.render('login-register');
    }
    next();
}
// END OF CUSTOM MIDDLEWARE
// LOGIN PAGE
router.post('/pressbutton', [
  body('user_email').custom((value) => {
      // chang db and value
      return dbConnection.query('SELECT email FROM account WHERE email=$1', [value])
      .then(rows => {
          if(rows["rows"].length == 1){
              console.log('yes');
              console.log(rows["rows"]);
              return true;               
          }
          console.log(rows["rows"]);
          console.log('no')
          // console.log(value);
          return Promise.reject('Invalid Email Address!'); 
      });
  }),
  body('user_pass','Password is empty!').trim().not().isEmpty(),
], (req, res) => {
    console.log('req res');
  const validation_result = validationResult(req);
  const {user_pass, user_email} = req.body;
  if(validation_result.isEmpty()){
      //chang db table and value ok
      dbConnection.query("SELECT * FROM account WHERE email=$1",[user_email])
      .then(rows => {
          // console.log(rows);
          console.log(rows["rows"][0].pass);
          bcrypt.compare(user_pass, rows["rows"][0].pass).then(compare_result => {
              if(compare_result === true){
                  console.log('murara');
                  req.session.isLoggedIn = true;
                  req.session.userID = rows["rows"][0].id;
                  req.session.userName = rows["rows"][0].name;
                  console.log(req.session.userID);

                  res.redirect('/');
              }
              else{
                  console.log('render 145');
                    res.render('login',{
                        login_errors:['Invalid Password!']
                    });
              }
          })
          .catch(err => {
              if (err) throw err;
          });


      }).catch(err => {
          if (err) throw err;
      });
  }
  else{
      let allErrors = validation_result.errors.map((error) => {
          return error.msg;
      });
      // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
      console.log('render 165');
      res.render('login',{
          login_errors:allErrors
      });
  }
});
// END OF LOGIN PAGE

module.exports = router;