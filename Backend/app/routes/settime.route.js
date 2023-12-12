const express = require('express');
const router = express.Router();
const setTimeController = require('../controllers/settime.controller'); 
router.route('/')
    .post(setTimeController.create)
    .get(setTimeController.findAll)
router.route('/:id')
    .put(setTimeController.update)
module.exports = router;
