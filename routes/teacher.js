const express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Teacher Dashboard");
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

module.exports = router;
