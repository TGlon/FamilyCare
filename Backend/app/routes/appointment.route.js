const express = require('express');
const appointments = require('../controllers/appointment.controller');
const router = express.Router();


router.route('/')
    .post(appointments.create)
    .get(appointments.findAll)
    // .delete(appointments.deleteAll)
router.route('/:id')
    .put(appointments.update)
    .delete(appointments.deleteOne)
    .get(appointments.findOne)

module.exports = router;