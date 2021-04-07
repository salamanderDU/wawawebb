var express = require('express');
var router = express.Router();
const dbConnection = require('../lib/database');
const { body, validationResult } = require('express-validator');


router.get('/xtucryituogih;ok',function(req, res, next) {
    res.render('HealtyandCare');
  });


//ตรงนี้เดี๋ยวเปลี่ยนใหม่นะ ให้รับค่ามาจากทาง path เพื่อไปถึงtag แค่ละตัว
router.get('/',function(req, res, next) {
  dbConnection.query("SELECT * FROM post ORDER BY pid DESC")
  .then(rows=>{
    // console.log(rows["rows"]);
    console.log(req.session.userName)
    res.render('HealtyandCare',{rows : rows["rows"] , name : req.session.userName , numloop : 19});
    // console.log('ok')
  }).catch(err => {
    console.log('\terr');
    if (err) throw err;
  });
  console.log('kimi no kimi')
  // res.redirect('/');
});
//เริ่มทำตัว get function ใหม่
router.get('/:tag',function(req, res, next) {
  dbConnection.query("SELECT * FROM post WHERE tag= $1 ORDER BY pid DESC",[req.params.tag])
  .then(rows=>{
    // console.log(rows["rows"]);
    console.log(req.session.userName)
    res.render('HealtyandCare',{rows : rows["rows"] , name : req.session.userName , tagname : req.params.tag});
    // console.log('ok')
  }).catch(err => {
    console.log('\terr');
    if (err) throw err;
  });
  console.log('kimi no kimi')
  // res.redirect('/');
});





router.post('/8794651326548', function(req, res, next) {
  // todo 
  console.log(req.session.userID)
  console.log('--------------------------------------------')
  console.log(req.body.datapost);
  console.log('--------------------------------------------')
  // console.log( body('datapost').isEmpty() )
  console.log('--------------------------------------------')
  console.log(validationResult(req).isEmpty())
  console.log('--------------------------------------------')
  console.log(req.session.userName)
  // res.render('HealtyandCare', { title: 'Express' , tenda : 3});
  res.redirect('/tag')
});

//กดสร้างโพส
router.post('/',function(req,res,next){
  console.log(req.body.datapost);
  console.log(req.body.datatitle);
  const validation_result = validationResult(req);
  // IF validation_result HAS NO ERRER
  if(validation_result.isEmpty()){
    //insertdata post -> ดึงpid มาใส่ตาราง like ไว้ยืนยันว่ามี post ในตาราง like
       dbConnection.query("INSERT INTO post(id,title,postdata,name,tag) VALUES($1,$2,$3,$4,$5)",[req.session.userID , req.body.datatitle ,req.body.datapost , req.session.userName,req.body.tagname])
          .then(result => {
            //--------------------------
            dbConnection.query("SELECT * FROM post ORDER BY pid")
              .then(rows=>{
                //---------------------------
                dbConnection.query("INSERT INTO likes(pid) VALUES($1)",[rows["rows"][rows["rows"].length-1].pid])
                .then(rows=>{
                  console.log("add pid to like ok")
                }).catch(err => {
                  console.log('\terr');
                  if (err) throw err;
                });
                  //---------------------------
                  console.log("select pid ok")
                }).catch(err => {
                  console.log('\terr');
                  if (err) throw err;
                });
            //--------------------------
              console.log('insert complate');
              res.redirect('/');
              console.log('render not error')
          }).catch(err => {
              console.log('\terr');
              if (err) throw err;
          });
  }
  else{
      // COLLECT ALL THE VALIDATION ERRORS
      console.log('else')
      let allErrors = validation_result.errors.map((error) => {
          return error.msg;
      });
      res.render('HealtyandCare',{
          register_error:allErrors,
          old_data:req.body
      }
      );
  }

});


module.exports = router;