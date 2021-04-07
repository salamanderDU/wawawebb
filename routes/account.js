var express = require('express');
var router = express.Router();
const dbConnection = require('../lib/database');


// DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => {
    console.log(!req.session.isLoggedIn);
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    next();
}
// END OF CUSTOM MIDDLEWARE

router.get('/87465132', ifNotLoggedin,function(req, res, next) {
  res.render('Account',{name :req.session.userName});
});
//ดูกันอีกตัวนะ
router.get('/', ifNotLoggedin,function(req, res, next) {
  dbConnection.query("SELECT * FROM post,account where post.id=account.id and post.id =$1 ",[req.session.userID])
    .then(rows => {
        res.render('Account',{name :req.session.userName , rows : rows["rows"]});
    }).catch(err => {
        // THROW INSERTING USER ERROR'S
        console.log('\terr');
        if (err) throw err;
    });
});

//กด submit
router.post('/',function(req, res, next) {
  console.log(req.body.datapost)
  if(req.body.datapost.length > 0){
    dbConnection.query("UPDATE account SET bio=$1 WHERE id=$2",[req.body.datapost, req.session.userID])
    .then(rows => {
        // res.send(`your account has been created successfully, Now you can <a href="/">Login</a>`);
        console.log('\trenderrrrrrrrrrr');
        res.redirect('/account')
    }).catch(err => {
        // THROW INSERTING USER ERROR'S
        console.log('\terr');
        if (err) throw err;
    });
  } else {
    res.redirect('/account')
  }
});

module.exports = router;