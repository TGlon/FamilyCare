const express = require('express');
const vaccine = require('../controllers/vaccine_type.controller');

const router = express.Router();

router.route('/')
    .post(vaccine.create)
    .get(vaccine.findAll)
    .delete(vaccine.deleteAll)

router.route('/:id')
    .put(vaccine.update)
    .get(vaccine.findOne)
    .delete(vaccine.deleteOne)

module.exports = router;

