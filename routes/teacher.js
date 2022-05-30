const express = require("express");
var multer = require("multer");
const router = express.Router();
const Quiz = require("../models/quiz");
const Assignment = require("../models/assignment");
const Teacher = require("../models/teacher")

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

router.get("/", function (req, res, next) {
  res.send("hello teacher");
});

//Display teacher data on dashboard (FA-19/BCS/018)
router.get("/:tid", (req, res, next) => {
	Teacher.findById(req.params.tid).exec((err,result) => {
		if (err)
		{
			return next(err);
		}
		res.json(result);
	})
});

// POST routes

router.post("/addQuiz", async (req, res, next) => {
  try {
    const quiz = new Quiz(req.body.quiz);
    // console.log(quiz);
    const added = await quiz.save();
    res.json(added);
  } catch (error) {
    next(error.message);
  }
});

// View Quiz routes
router.get("/viewQuiz/:qid", (req, res, next) => {
  console.log(req.params.qid);
  Quiz.findById(req.params.qid)
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

// Teacher Uploads Assignment upload.single('AttachedFile')
router.post("/addAssign", upload.single("AttachedFile"), (req, res, next) => {
  const file = req.file;
  console.log(file.originalname);
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    error.title = "Error";
    return next(error);
  }

  Assignment.create({
    teacher_id: req.body.teacher_id,
    subject: req.body.subject,
    totalMarks: req.body.totalMarks,
    deadline: req.body.deadline,
    filename: file.originalname,
    class: req.body.class,
    description: req.body.description,
  })
    .then(
      (result) => {
        console.log("Assignment Uploaded");
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});


//ADD MARKS  <<<< FA19-BCS-001
// Teacher add marks to quizzes
router.put("/quiz/addMarks/:qID/:sID", async (req, res, next) => {
  const studID = req.params.sID;
  const quizID = req.params.qID;
  const marks = req.body.marks;
  try {
    const attemptedQuizzes = await Quiz.findOneAndUpdate(
      {
        _id: quizID,
        submissions: { $elemMatch: { student: studID } },
      },
      { $set: { "submissions.$.marks": marks } }
    );
    res.json(attemptedQuizzes?.submissions);
  } catch (err) {
    next(err);
  }
});
// Teacher add marks to Assignment 
router.put("/assignment/addMarks/:aID/:sID", async (req, res, next) => {
	const studID = req.params.sID;
	const assignmntID = req.params.aID;
	const marks = req.body.marks;
	try {
		const attemptedAssignments = await Assignment.findOneAndUpdate(
			{
				_id: assignmntID,
				student_submissions: { $elemMatch: { student_id: studID } },
			},
			{ $set: { "student_submissions.$.marks": marks } }
		);
		console.log(attemptedAssignments);
		res.json(attemptedAssignments?.student_submissions);
	} catch (err) {
		next(err);
	}
});

// GET Routes
//View attempted quiz - FA19-BCS-033
router.get("/quiz/:id", function (req, res, next) {
  Quiz.findById(req.params.id)
    .then(
      (result) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

// DELETE routes

//Delete Quiz - FA19-BCS-034
router.delete("/quiz/:id", function (req, res, next) {
  Quiz.deleteOne({ _id: req.params.id }, function (err, result) {
    if (err) return next(err);
    res.json(result);
  });
});

module.exports = router;
