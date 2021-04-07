var express = require('express');
var router = express.Router();
// const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const dbConnection = require('../lib/database');
const { body, validationResult } = require('express-validator');

// app.use(express.urlencoded({extended:false}));


router.get('/', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

router.post('/signup',function(req, res, next) {
  // res.render('Home', { title: 'Express' });
  res.redirect('/post');
});

// REGISTER PAGE
router.post('/pressbutton', 
//post data validation(using express-validator)
[
    body('user_email','Invalid email address!').isEmail().custom((value) => {
        //chang db table and value ok
        console.log('post/register iflogin 60')
        return dbConnection.query('SELECT email FROM account WHERE email = $1', [value])//add ;
        .then(rows => {
            if(rows["rows"].length > 0){
              console.log('\tthen');
                return Promise.reject('This E-mail already in use!');
            }
            console.log('\tthenda');
            return true;
        });
    }),
    body('user_name','Username is Empty!').trim().not().isEmpty(),
    body('user_pass','The password must be of minimum length 6 characters').trim().isLength({ min: 6 }),
],// end of post data validation
(req,res,next) => {
    console.log('\treq res next');
    const validation_result = validationResult(req);
    const {user_name, user_pass, user_email} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
      console.log('\tif avalible hash');
        // password encryption (using bcryptjs)
        bcrypt.hash(user_pass, 12).then((hash_pass) => {
            // INSERTING USER INTO DATABASE
            console.log('query while insert 82')
            dbConnection.query("INSERT INTO account(name,email,pass) VALUES($1,$2,$3)",[user_name,user_email, hash_pass])
            .then(rows => {
                // res.send(`your account has been created successfully, Now you can <a href="/">Login</a>`);
                console.log('\trenderrrrrrrrrrr');
                res.redirect('/login');
            }).catch(err => {
                // THROW INSERTING USER ERROR'S
                console.log('\terr');
                if (err) throw err;
            });
            console.log('all done');
        })
        .catch(err => {
            // THROW HASING ERROR'S
            console.log('\thashing error !');
            if (err) throw err;
        })
    }
    else{
        // COLLECT ALL THE VALIDATION ERRORS
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login-register PAGE WITH VALIDATION ERRORS
        console.log('render 103');
        res.render('register',{
            register_error:allErrors,
            old_data:req.body
        }
        );
    }
    res.redirect('/');

});// END OF REGISTER PAGE

// END OF CUSTOM MIDDLEWARE
//---------------------------------------------------------------



module.exports = router;