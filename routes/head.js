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

// router.post("/results/addResult", async (req, res) => {
//   const result_object = new Result(req.body);
//   try {
//     Result.create(result_object).then(
//       (output) => {
//         console.log("result is added");
//         res.json(output);
//       },
//       (err) => {
//         console.log(err);
//         res.json(err);
//       }
//     );
//     console.log(result_object);
//   } catch (err) {
//     res.json({
//       status: err,
//     });
//   }
// });

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
