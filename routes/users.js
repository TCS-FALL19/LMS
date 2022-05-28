var express = require('express');
const { stringify } = require('jade/lib/utils');
var router = express.Router();
var mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/comsats", function(err){
  if (err) throw err
  console.log("Mongoose Connected")
})

userSchema = new mongoose.Schema({
  name:{
    type: String,
    requried: true
  },
  rollno: String
})

var User = mongoose.model("student", userSchema)



/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find().exec(function(err, data){
    if (err) throw err
    res.json(data)
  })
});

router.get('/:name', function(req, res, next) {
  res.send("Welcome "+req.params.name);
});

module.exports = router;
