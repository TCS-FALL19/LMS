const express = require("express");
var multer = require("multer");
const router = express.Router();
const Quiz = require("../models/quiz");
const Assignment = require("../models/assignment");

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

//login authentication and authurization
router.post("/login", async (req, res) => {
  //Authenticate User
  const user = users.find((user) => user.username == req.body.username);
  if (user == null) {
    res.send("user not found");
  } else {
    const result = await bcrypt.compare(req.body.password, user.password);
    if (result == true) {
      //Generate JWT
      const username = req.body.username;
      //sign(payload,secretKey)
      const user = { name: username, role: req.body.role };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
      });
      res.cookie("token", accessToken).json({ accessToken: accessToken });
    } else {
      res.send("incorrect password");
    }
  }
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

// GET Routes

module.exports = router;
