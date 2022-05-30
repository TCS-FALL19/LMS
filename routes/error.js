var express = require("express");
var router = express.Router();

/* GET Error Route. */
router.get("/error", function (req, res, next) {
  res.json("This is the Error Page!", { title: "Express" });
});

module.exports = router;
