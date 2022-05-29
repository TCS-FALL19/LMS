const express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
	res.send("Student Dashboard");
});

console.log("test")

module.exports = router;

