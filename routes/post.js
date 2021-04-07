var express = require('express');
var router = express.Router();
const dbConnection = require('../lib/database');

/* GET home page. */
const ifNotLoggedin = (req, res, next) => {
  console.log(!req.session.isLoggedIn);
  if(!req.session.isLoggedIn){
      return res.redirect('/login');
  }
  next();
}

router.get('/984651', function(req, res, next) {
  res.render('post', { name : req.session.name });
});

router.get('/:pid', function(req, res, next) {
  // res.render('post', { name : req.session.name });
  dbConnection.query("SELECT * FROM post WHERE pid=$1",[req.params.pid])
    .then(rows => {
        console.log(rows["rows"])
        console.log("\x1b[36m" ,"username is "+req.session.userName)
        //เริ่มการดึงดาต้าเบสเพิ่มเรียกข้อมูการคอมเม้น
        dbConnection.query("SELECT * FROM commenta WHERE pid=$1",[req.params.pid])
            .then(com => {
                console.log(com["rows"])
                res.render('post',{
                  rows : rows["rows"][0],
                  name : req.session.userName,
                  com : com["rows"],
                  numloop : com["rows"].length
                })
            }).catch(err => {
                // THROW INSERTING USER ERROR'S
                console.log('\terr');
                if (err) throw err;
            });
        
    }).catch(err => {
        // THROW INSERTING USER ERROR'S
        console.log('\terr');
        if (err) throw err;
    });
});

module.exports = router;