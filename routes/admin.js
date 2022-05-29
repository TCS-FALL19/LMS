const express = require("express");
var router = express.Router();

var Admin = require("../models/admin");
var Class = require("../models/class");
var Teacher = require("../models/teacher");
var Student = require("../models/student");
var Announcement = require("../models/announcement");
const { route } = require("express/lib/application");

//GET Methods

//................Implemented By Hiba Shafqat................
//get dashboard route

router.get("/", (req, res, next) => {
  res.status(200).render("Admin", { title: "Admin" });
});

//..................................................
//Implemented by Asaad Habib
//..................................................

router.get("/classes", (req, res, next) => {
  Class.find({})
    .populate("teacher")
    .populate("students.sid")
    .exec(function (error, results) {
      if (error) {
        return next(error);
      }
      res.json(results);
    });
});

//..................................................
//Implemented by Alishba Iftikhar
//..................................................

router.get("/teachers", (req, res, next) => {
  Teacher.find()
    .sort("name")
    .exec(function (error, results) {
      if (error) {
        return next(error);
      }
      // Respond with valid data
      res.json(results);
    });
});

//Implemented by Hassan Afzal (FA17-BCS-031)

router.get("/students", (req, res, next) => {
  Student.find()
    .sort("name")
    .exec(function (error, results) {
      //It will enlist and sort names of added Students
      if (error) {
        //In case of error
        return next(error);
      }
      // Respond with valid data/result
      res.json(results); //Response
    });
});

router.get("/classes/:cid", (req, res, next) => {
  Class.find({ _id: req.params.cid })
    .populate("teacher")
    .populate("students.sid")
    .exec(function (error, results) {
      if (error) {
        return next(error);
      }
      // Respond with valid data
      res.json(results);
    });
});

router.get("/teachers/:tid", (req, res, next) => {
  Teacher.findById(req.params.id)
    .then(
      (teacher) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(teacher);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/students/:sid", (req, res, next) => {
  Student.findById(req.params.id)
    .then(
      (student) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(student);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/Announcement", (req, res, next) => {
  Announcement.find().exec((err, result) => {
    if (err) {
      return next(err);
    }
    // Respond with valid data
    res.json(result);
  });
});

//POST Methods

//..................................................
// Implemented by Aneesa Farooq (FA19-BCS-015)
//..................................................
router.post("/teacher", function (req, res, next) {
  Teacher.create(req.body)
    .then(
      (teacher) => {
        console.log("Teacher has been Added ", teacher);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(teacher);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

//implemented by Momin Ali

router.post("/addClass", function (req, res, next) {
  Class.create(req.body)
    .then(
      (result) => {
        console.log("Class has been Added ", result);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

// router.post('/addStudent', function (req, res, next) {
//   Student.create(req.body)
//   .then((student) => {
//       console.log('Student has been Added ', student);
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'application/json');
//       res.json(student);
//   }, (err) => next(err))
//   .catch((err) => next(err));
// })

router.post("/addStudent", function (req, res, next) {
  Student.create(req.body, (err, student) => {
    if (err) {
      res.status(400).json({ msg: "Error" });
    }

    console.log("Student has been Added ", student);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(student);
  });
});

router.post("/addAnnouncement", (req, res, next) => {
  Announcement.create(req.body)
    .then(
      (result) => {
        console.log("Announcement has been Added ", result);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

//PUT methods

router.put("/classes/:cid", (req, res, next) => {
  Class.findOneAndUpdate(
    { _id: req.params.tid },
    req.body,
    { new: true },
    function (error, results) {
      if (error) {
        return next(error);
      }
      res.json(results);
    }
  );
});

// Implemented by Muhammad Bilal Haider

router.put("/teachers/:tid", (req, res, next) => {
  Teacher.findOneAndUpdate(
    { _id: req.params.tid },
    req.body,
    { new: true },
    function (error, results) {
      if (error) {
        return next(error);
      }
      res.json(results);
    }
  );
});

//Route Implemented by Arif Shahzad

router.put("/assignTeacher/:cid/:tid", (req, res, next) => {
  // Assigns teacher to the class.

  Class.findOneAndUpdate(
    { _id: req.params.cid },
    { teacher: req.params.tid },
    function (error, results) {
      if (error) {
        return next(error);
      }
      res.json(results);
    }
  );
});

router.put("/assignStudent/:cid/:sid", (req, res, next) => {
  Class.findOneAndUpdate(
    { _id: req.params.cid },
    {
      $push: {
        students: {
          sid: req.params.sid,
        },
      },
    },
    { new: true, upsert: false },
    function (error, results) {
      if (error) {
        return next(error);
      }
      res.json(results);
    }
  );
});

router.put("/Announcement/:id", (req, res, next) => {
  Announcement.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, upsert: false },
    (error, result) => {
      if (error) {
        return next(error);
      }
      res.json(result);
    }
  );
});

//DELETE methods

//Implemented by Muhammad Ashar Ayub (FA18-BCS-014)
router.delete("/student/:id", function (req, res, next) {
  //finding the specific student document with student id and deleting it
  Student.deleteOne({ _id: req.params.id }, function (error, results) {
    if (error) {
      //returning in case of error
      return next(error);
    }
    //sending results back to client if operation is successful
    res.json(results);
  });
}); //Muhammad Ashar Ayub

// Muhammad Sarmad Qadeer (SP19-BCS-037)
router.delete("/teacher/:id", function (req, res, next) {
  Teacher.deleteOne({ _id: req.params.id }, function (error, results) {
    if (error) {
      return next(error);
    }
    res.json(results);
  });
});

router.delete("/delclass/:id", function (req, res, next) {
  Class.deleteOne({ _id: req.params.id }, function (error, results) {
    if (error) {
      return next(error);
    }
    res.json(results);
  });
});

//----------ROUTE BY FAIQ SHAHZAD---------------------
//Using deleteOne() function to Delete the announcement

router.delete("/Announcement/:id", (req, res, next) => {
  Announcement.deleteOne({ _id: req.params.id }, (error, result) => {
    if (error) {
      return next(error);
    }
    res.json(result);
  });
});

//----------------------------------------------------

module.exports = router;
