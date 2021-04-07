var express = require('express');
var router = express.Router();
console.log('fasfoeawu');
router.get('/',function(req,res){
    //session destroy
    console.log('logout');
    req.session = null;
    res.redirect('/');
});

module.exports = router;
