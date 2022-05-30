const express = require("express");
var router = express.Router();
var Result = require("../models/result");
var Assignment = require("../models/assignment");
var Admin = require("../models/admin");
var Class = require("../models/class");
var Teacher = require("../models/teacher");
var Student = require("../models/student");
var Announcement = require("../models/announcement");

router.get("/", (req, res, next) => {
  res.send("Head Dashboard");
});
router.get('/classes/:id', function(req, res, next) {
    Class.find({ _id: req.params.id }).populate('teacher').populate('students.sid').exec(function(error, results) {
        if (error) {
            return next(error);
        }
        else{
              // Respond with valid data
                 res.json(results);
}
        
    });
});

router.get("/results/student/:id", (req, res) => {
  const student_id = req.params.id;
  Result.find({ _id: student_id })
    .populate("student.std")
    .populate("quiz.qid")
    .populate("assignment.aid")
    .exec((err, result) => {
      if (err) {
        res.json({
          message: err,
        });
        console.log(err);
      } else {
        res.json(result);
        console.log("result: " + result);
      }
    });
});

module.exports = router;
