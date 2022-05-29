const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz");

router.get("/", function (req, res, next) {
  res.send("hello teacvher");
});

module.exports = router;

// post routes
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
