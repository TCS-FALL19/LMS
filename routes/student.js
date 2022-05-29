const express = require("express");
const multer = require("multer");

var router = express.Router();

const Assignment = require("../models/assignment");
const Student = require("../models/student")

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

router.get("/", (req, res, next) => {
  res.send("Student Dashboard");
});

router.put("/submitAssignment", upload.single("AttachedFile"), (req, res) => {
  console.log(req.body);
  const file = req.file;
  if (!file) {
    res.status(400).send("Something went wrong!");
  }
  // res.send(file.filename);
  Assignment.findOneAndUpdate(
    { _id: req.body._id },
    {
      $push: {
        student_submissions: {
          std_id: req.body.std_id,
          filename: file.filename,
          marks: 0,
        },
      },
    },
    { new: true, upsert: false },
    function (err, result) {
      if (err) {
        return next(error);
      }
      res.json(result);
    }
  );
});
router.put("/updateContact", (req, res) => {
  Student.findOneAndUpdate(
    { _id: req.body._id },
    {
      contact: req.body.contact
    },
    { new: true, upsert: false },
    function (err, result) {
      if (err) {
        return next(error);
      }
      res.json(result);
    }
  );
});

module.exports = router;
