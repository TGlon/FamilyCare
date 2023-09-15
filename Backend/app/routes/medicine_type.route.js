const express = require('express');
const medicine_type = require('../controllers/medicine_type.controller');

const router = express.Router();

router.route('/')
    .post(medicine_type.create)
    .get(medicine_type.findAll)
    .delete(medicine_type.deleteAll)

router.route('/:id')
    .put(medicine_type.update)
    .get(medicine_type.findOne)
    .delete(medicine_type.deleteOne)

module.exports = router;

