const express = require("express");
var router = express.Router();
var Result = require("../models/result");
var Assignment = require("../models/assignment");
var Admin = require("../models/admin");
var Class = require("../models/class");
var Teacher = require("../models/teacher");
var Student = require("../models/student");
var Announcement = require("../models/announcement");
var Quiz = require("../models/quiz");

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


router.get("/results/student/:sid", async (req, res, next) => {
	const student_id = req.params.sid;
	const subject = req.body.subject;


	try {
		const result = await Result.findOne({ student_id: student_id });
		res.json(result);
	} catch (err) {
		throw next(err);
	}
});

router.get("/results/student", async (req, res, next) => {
	const subject = req.body.subject;
	const stud_id = req.body.sid;
	const cls = req.body.class;

	try {
		const assignment = await Assignment.find({
			student_submissions: { $elemMatch: { student_id: stud_id } },
			subject: subject,
		});

		let totalMarks = JSON.parse(assignment[0].totalMarks);
		let attainedmarks = assignment[0].student_submissions.find((submission) => {
			return submission.student_id == stud_id;
		}).marks;

		const quiz = await Quiz.find({
			subject: subject,
			submissions: { $elemMatch: { student: stud_id } },
		});

		totalMarks += JSON.parse(quiz[0].totalMarks);
		attainedmarks += quiz[0].submissions.find((submission) => {
			return submission.student == stud_id;
		}).marks;

		const uploaded = await Result.create({
			student: stud_id,
			totalMarks: totalMarks,
			acquiredMarks: attainedmarks,
			subject: subject,
			cls: cls,
		});

		res.json(uploaded);
	} catch (err) {
		next(err);
	}
});

router.get('/head/result/class', function(req,res,next){
	result_schema.findById(req.body.id).populate('results').exec(function(err,foundClass){
		if (err) next (err)
		else{
			var response = {
				type: 'Success',
				message: `Results of class ${foundClass.name} fetched successfully.`,
				data: foundClass.results
			}
		   res.status(200).send(response)
		}
	})
});

module.exports = router;
