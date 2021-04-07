var express = require('express');
var router = express.Router();
const dbConnection = require('../lib/database');
const { body, validationResult } = require('express-validator');

router.post('/post', [
    body('postdata','invalidcontent').trim().not().isEmpty(),
],
(req,res,next) => {
    console.log(postdata);
    const validation_result = validationResult(req);
    // IF validation_result HAS NO ERRER
    if(validation_result.isEmpty()){
         dbConnection.query("INSERT INTO post(id,postdata) VALUES($1,$2)",[req.session.userID,req.body.postdata])
            .then(rows => {
                console.log('insert complate');
                res.redirect('/HealtyandCare');
            }).catch(err => {
                console.log('\terr');
                if (err) throw err;
            });
    }
    else{
        // COLLECT ALL THE VALIDATION ERRORS
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        res.render('HealtyandCare',{
            register_error:allErrors,
            old_data:req.body
        }
        );
    }
    res.redirect('/');

});

module.exports = router;