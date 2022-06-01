const express = require("express");

var multer = require("multer");
const router = express.Router();
var path = require("path");
const Quiz = require("../models/quiz");
const Assignment = require("../models/assignment");
const Teacher = require("../models/teacher")
const Announcement = require("../models/announcement");

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
	Teacher.findById(req.params.tid).exec((err, result) => {
		if (err) {
			return next(err);
		}
		res.json(result);
	})
});

// POST routes
// Implemented my yours truly abdul moeed ibn humayun al athari
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

// Implemented by <Muhammad Akif Anees>
router.put("/updatecontactinfo/:tid", async (req, res, next) => {
  const updatedname = req.body.name;
  const updateddesig = req.body.designation;
  console.log(updatedname, updateddesig);
  try {
    const updated = await Teacher.findOneAndUpdate(
      { _id: req.params.tid },
      { $set: { name: updatedname, designation: updateddesig } }
    );
    console.log(updated);
    res.json(updated);
  } catch (error) {
    next(error);
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
// Abdullah Mohammad Shafique (FA19-BCS-007)
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

// Abdullah M. Shafique (FA19-BCS-007)
// Teacher View Submissions of students for their assignments
router.get("/viewSubmissions/:aid", async function (req, res, next) {
  const searchId = req.params.aid;
  const records = await Assignment.find({ _id: searchId }).select(
    "-_id student_submissions"
  );
  // Requires /downloadAssignment Route
  const mountAddr =
    req.protocol + "://" + req.get("host") + "/teacher/downloadAssignment/";

  var filelinks = records[0].student_submissions.map((item, idx) => {
    return mountAddr + item.filename;
  });
  console.log(filelinks);

  res.send(filelinks);
});

//Implemented by Tayyab Akbar FA19-BCS-039
router.get('/downloadAssignment/:fname', function(req, res, next) {
	var options = {
	  root: path.join(__dirname,'../uploads/')
	};
	
	var fileName = req.params.fname;
	res.sendFile(fileName, options, function (err) {
		if (err) {
			next(err);
		} else {
			console.log('Sent:', fileName);
		}
	});
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

// Teacher add marks to Assignment <<<< FA19-BCS-001
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


// Update total Mariks of Assignment
// Implemented by: Abdul Moiz(FA19-BCS-004)

router.put("/updatemarks/:aid",(req,res,next)=>{
  Assignment.findOneAndUpdate({_id:req.params.aid},{totalMarks:req.body.totalMarks},
  function(err,result){
    if(err) {
      return next(err);
    }
    res.status(200).json(result);
  })
})

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

// Route by Ahsan Zafar
router.delete("/deleteAnnouncement", async (req, res) => {
	const announcement_object = new Announcement(req.body);
	Announcement.deleteOne({ object: announcement_object }, (err, result) => {
		if (err) {
			res.json({
				message: error
			})
		} else {
			res.json({
				message: "Anouncement Successfully deleted"
			})
		}
	})
})

module.exports = router;
