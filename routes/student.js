const express = require("express");
const multer = require("multer");

var router = express.Router();

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

router.get("/", (req, res, next) => {
	res.send("Student Dashboard");
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
		// res.send(file.filename);
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

module.exports = router;
