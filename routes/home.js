var express = require('express');
var router = express.Router();
const dbConnection = require('../lib/database');


/* GET home page. */
function ifLoggedin(check,name) {
    if(check){
        return name;
    } else{
      return 'GUEST';
    }
}


router.get('/cyvuhbkj', function(req, res, next) {
  console.log(req.session.userID);
  console.log(req.session.isLoggedIn);
  res.render('Home',{title : ifLoggedin(req.session.isLoggedIn,req.session.userName)});
  // res.render('HealtyandCare',{title:"nodemon"});

});

router.get('/',function(req, res, next) {
  console.log(Date().now);
  console.log(req.session.userID);
  console.log(req.session.isLoggedIn);
  dbConnection.query("SELECT * FROM post ORDER BY likecount DESC")
  .then(rows=>{
    // console.log(rows["rows"]);
    console.log(req.session.userName)
    //เริ่มการทำ poppular 
    dbConnection.query("SELECT tag,COUNT(tag) FROM post GROUP BY tag ORDER BY tag DESC")
      .then(pop => {
          //ตัว render นี่เดี๋ยวเอาไปไว้ข้างในรวมกันกับตอนทำpoppular tag
          res.render('Home',{ pop : pop["rows"] , rows : rows["rows"] , title : ifLoggedin(req.session.isLoggedIn,req.session.userName) });
      }).catch(err => {
          // THROW INSERTING USER ERROR'S
          console.log('\terr');
          if (err) throw err;
      });
    
    // console.log('ok')
  }).catch(err => {
    console.log('\terr');
    if (err) throw err;
  });
  console.log('open home ok')
  // res.redirect('/');
});

module.exports = router;
