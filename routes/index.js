var express = require("express");
var router = express.Router();

//..................................................
//Implemented by Hafeez Ullah
//..................................................

router.get('/', function(req, res){
  res.send('Welcome to LMS');
})


//..................................................
//Implemented by Hamza Riaz Khan
//..................................................

router.get('/error', function(req, res){
  res.send('This is the Error Page!');
})

module.exports = router;
