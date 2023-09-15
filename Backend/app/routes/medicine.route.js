const express = require('express');
const medicine = require('../controllers/medicine.controller');

const router = express.Router();

router.route('/')
    .post(medicine.create)
    .get(medicine.findAll)
    .delete(medicine.deleteAll)

router.route('/:id')
    .put(medicine.update)
    .get(medicine.findOne)
    .delete(medicine.deleteOne)

module.exports = router;

