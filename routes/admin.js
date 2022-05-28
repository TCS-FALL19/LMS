const express = require('express');
var router = express.Router();

var Admin = require('../models/admin');
var Class = require('../models/class');
var Teacher = require('../models/teacher');
var Student = require('../models/student');

//GET Methods

router.get('/', (req, res, next) => {
  res.status(200).render('Admin', {title:'Admin'})
})

router.get('/classes', (req, res, next) => {
  Class.find({}).populate('teacher').populate('students.sid').exec(function(error, results) {
    if (error) {
        return next(error);
    }
    res.json(results);
  });
})

router.get('/teachers', (req, res, next) => {
  Teacher.find().sort('name').exec(function(error, results) {
    if (error) {
        return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
})

router.get('/students', (req, res, next) => {
  Student.find().sort('name').exec(function(error, results) {
    if (error) {
        return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
})


router.get('/classes/:cid', (req, res, next) => {
  Class.find({ _id: req.params.cid }).populate('teacher').populate('students.sid').exec(function(error, results) {
    if (error) {
        return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
})

router.get('/teachers/:tid', (req, res, next) => {
  Teacher.findById(req.params.id)
  .then((teacher) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(teacher);
  }, (err) => next(err))
  .catch((err) => next(err));
})

router.get('/students/:sid', (req, res, next) => {
  Student.findById(req.params.id)
  .then((student) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(student);
  }, (err) => next(err))
  .catch((err) => next(err));
})

//POST Methods

router.post('/addTeacher', function (req, res, next) {
  Teacher.create(req.body)
  .then((teacher) => {
      console.log('Teacher has been Added ', teacher);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(teacher);
  }, (err) => next(err))
  .catch((err) => next(err));
})

router.post('/addClass', function (req, res, next) {
  Class.create(req.body)
  .then((result) => {
      console.log('Class has been Added ', result);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(result);
  }, (err) => next(err))
  .catch((err) => next(err));
})

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

router.post('/addStudent', function (req, res, next) {
  Student.create(req.body, (err, student) => {

    if(err){
      res.status(400).json({msg:"Error"})
    }

    console.log('Student has been Added ', student);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(student);
  })
})

//PUT methods

router.put('/classes/:cid', (req, res, next) => {
    res.send('Editing class info')
})

router.put('/teachers/:tid', (req, res, next) => {
    res.send('Editing teacher info')
})

router.put('/assignTeacher/:cid/:tid', (req, res, next) => {
    res.send('Assigning Teahcer to class')
})

router.put('/assignStudent/:cid/:sid', (req, res, next) => {
    res.send('Assigning Student to class')
})

//DELETE methods

router.delete('/delClass/:cid', (req, res, next) => {
    res.send('Deleting Class')
})

router.delete('/delStudent/:sid', (req, res, next) => {
    res.send('Deleting Student')
})

router.delete('/delTeacher/:tid', (req, res, next) => {
    res.send('Deleting Teacher')
})


module.exports = router
