var express = require('express');
var router = express.Router();
const dbConnection = require('../lib/database');

// middleware เอาไว้เช็คลอกอิน
const ifNotLoggedin = (req, res, next) => {
    console.log(!req.session.isLoggedIn);
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    next();
}
//สิ้นสุด middleware

//ตัวgetจะเข้ามาอันแรก
router.get('/',function(req, res, next) {
  res.redirect('/');
});


router.post('/:pid',function(req, res, next) {
    console.log("\x1b[36m" ,req.body.ucomment)
    console.log("\x1b[36m" ,"length of comment is : "+req.body.ucomment.length)
    console.log("\x1b[36m" ,"pid of post is "+req.params.pid)
    console.log("\x1b[36m" ,"id of user is "+req.session.userID)
    if(req.body.ucomment.length > 0){
        dbConnection.query("INSERT INTO commenta(pid,id,ucomment,username) VALUES($1,$2,$3,$4)",[req.params.pid,req.session.userID,req.body.ucomment,req.session.userName])
            .then(rows=>{
                //todo
                console.log("\x1b[36m" ,'insert complete')
            }).catch(err => {
                console.log('\terr');
                if (err) throw err;
            });
    }
    res.redirect('/post/'+req.params.pid)
  });//ตัวนี้จะทำการเอาข้อมูลใส่ในตาราง post หลังจากกดหัวใจ
module.exports = router;