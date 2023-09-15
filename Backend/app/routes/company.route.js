const express = require('express');
const company = require('../controllers/company.controller');

const router = express.Router();

router.route('/')
    .post(company.create)
    .get(company.findAll)
    .delete(company.deleteAll)

router.route('/:id')
    .put(company.update)
    .get(company.findOne)
    .delete(company.deleteOne)

module.exports = router;

