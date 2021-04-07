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
router.get('/98764653132',function(req, res, next) {
  res.redirect('/');
});

//ทำต่อเรื่องระบบการ like
router.get('/:pid',function(req, res, next) {
    //ดึงข้อมูลว่ามีข้อมูลการกดไลค์ไหม
    console.log("\x1b[36m" ,"user id is : "+req.session.userID);
    console.log("\x1b[36m" ,"pid = "+req.params.pid);
    dbConnection.query("SELECT * FROM likes WHERE pid=$1 and id=$2",[req.params.pid,req.session.userID])
    .then(rows=>{
      console.log("\x1b[36m" ,"query level 1 success : check user in like");
      if (rows["rows"].length > 0){
        console.log("\x1b[36m" ,"user has been liked");
        //ถ้ามีให้รีเฟรชหน้า
        res.redirect('/')
      } else {
        console.log("\x1b[36m" ,"user never like");
        //ถ้าไไม่ก็ใส่ข้อมูลลงไป
        dbConnection.query("INSERT INTO likes(pid,id) VALUES($1,$2)",[req.params.pid,req.session.userID])
        .then(result=>{
          console.log("\x1b[36m" ,"query level 2 success : insert userid in like");
        //ใส่แล้ว update ค่า likecount ในตาราง post ด้วย
          console.log("insert pid&id to like ok")//บอกว่าอินเสิร์ชได้
            //--------------------------ดึงมานับก่อน
            dbConnection.query("SELECT * FROM likes WHERE pid = $1 ",[req.params.pid])
            .then(cou => {
                console.log(cou["rows"].length);
                //----------------------------update
                //กำลัง update ค่า
                dbConnection.query("UPDATE post SET likecount=$1 WHERE pid=$2",[cou["rows"].length-1,req.params.pid])
                .then(rows=>{
                    //todo
                    console.log('update complete')
                    res.redirect('/')
                }).catch(err => {
                    console.log('\terr');
                    if (err) throw err;
                });
                //----------------------------update
            }).catch(err => {
                // THROW INSERTING USER ERROR'S
                console.log('\terr');
                if (err) throw err;
            });
            //--------------------------ดึงมานับก่อน
        }).catch(err => {
          console.log('\terr');
          if (err) throw err;
        });
      }
    }).catch(err => {
      console.log("\x1b[36m" ,"error ! level 1");
      if (err) throw err;
    });
    // res.render('HealtyandCare');
  });//ตัวนี้จะทำการเอาข้อมูลใส่ในตาราง post หลังจากกดหัวใจ
module.exports = router;