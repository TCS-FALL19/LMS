const express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
	res.send("Student Dashboard");
});

module.exports = router;
