const express = require("express");
var multer = require('multer')
const router = express.Router();
const Quiz = require("../models/quiz");
const Assignment = require("../models/assignment");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
      cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

router.get("/", function (req, res, next) {
	res.status(200).render("Teacher", { title: "Teacher" });
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

// Teacher Uploads Assignment upload.single('AttachedFile')
router.post("/addAssign", upload.single('AttachedFile'), (req, res, next) => {
  const file = req.file
  console.log(file.originalname)
  if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      error.title = "Error"
      return next(error)
  }

  Assignment.create({
		teacher_id: req.body.teacher_id,
		subject: req.body.subject,
		totalMarks: req.body.totalMarks,
		deadline: req.body.deadline,
	  	filename: file.originalname,
		description: req.body.description
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
})


// GET Routes



// DELETE routes

//Delete Quiz - FA19-BCS-034
router.delete("/quiz/:id", function (req, res, next) {
  Quiz.deleteOne({ _id: req.params.id }, function (err, result) {
    if (err) return next(err);
    res.json(result);
  });
});



module.exports = router;