const express = require("express");
const multer = require("multer");
const Quiz = require("../models/quiz");
const Student = require("../models/student");
const Assignment = require("../models/assignment");
const Result = require("../models/result");
const Announcement = require("../models/announcement");

var router = express.Router();

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
  console.log(req.body.answer);
  res.send("Student Dashboard");
});

router.get("/:sid", (req, res, next) => {
  Student.findById(req.params.sid).exec((err, result) => {
    if (err) {
      return next(err);
    }
    res.json(result);
  });
});

router.put(
  "/submitAssignment",
  upload.single("AttachedFile"),
  (req, res, next) => {
    console.log(req.body);
    const file = req.file;
    if (!file) {
      res.status(400).send("Something went wrong!");
    }
    Assignment.findOneAndUpdate(
      { _id: req.body._id },
      {
        $push: {
          student_submissions: {
            student_id: req.body.std_id,
            filename: file.filename,
            marks: req.body.marks || 0,
          },
        },
      },
      { new: true, upsert: false },
      function (err, result) {
        if (err) {
          return next(err);
        }
        res.json(result);
      }
    );
  }
);

router.put("/updateContact", (req, res) => {
  Student.findOneAndUpdate(
    { _id: req.body._id },
    {
      contact: req.body.contact,
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

//attempt quiz by FA19-BCS-013
router.put("/attemptquiz/:qID/:sID", async (req, res, next) => {
  Quiz.findOneAndUpdate(
    { _id: req.params.qID },
    {
      $push: {
        submissions: {
          student: req.params.sID,
          answers: req.body.answer,
          marks: 0,
        },
      },
    },
    { new: true, upsert: false },
    function (error, results) {
      if (error) {
        return next(error);
      }
      res.json(results);
    }
  );
});

// Route Implemented by FA19-BCS-037
router.get("/viewquiz/:qid", (req, res, next) => {
  Quiz.findById(req.params.qid)
    .populate("teacher")
    .populate("submissions.student")
    .then(
      (quiz) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(quiz);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

// view both quiz and assignment marks for a specific subject
router.get("/viewMarks/:id", async (req, res, next) => {
  const sID = req.params.id;
  const subject = req.body.subject;
  try {
    const quiz = await Quiz.findOne({
      subject: subject,
      submissions: { $elemMatch: { student: sID } },
    });
    const quizAttainedMarks = quiz.submissions.find((submission) => {
      return submission.student == sID;
    }).marks;
    const assignment = await Assignment.findOne({
      student_submissions: { $elemMatch: { student_id: sID } },
      subject: subject,
    });
    const assignmentAttainedMarks = assignment.student_submissions.find(
      (submission) => {
        return submission.student_id == sID;
      }
    ).marks;
    res.json({
      qMarks: quizAttainedMarks,
      aMarks: assignmentAttainedMarks,
      subject: subject,
    });
  } catch (error) {
    next(error);
  }
});

// user profile
router.get("/profile/:id", (req, res, next) => {
  Student.findById(req.params.id)
    .then(
      (student) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(student);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

// view announcement
router.get("/announcement/:aid", async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.aid);
    res.json(announcement);
  } catch (error) {
    next(error);
  }
});

router.get("/assignment/:aid", (req, res, next) => {
  Assignment.findById(req.params.aid, function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

module.exports = router;
