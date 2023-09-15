const express = require('express');
const vaccinations = require('../controllers/vacination.controller');
const router = express.Router();


router.route('/')
    .post(vaccinations.create)
    .get(vaccinations.findAll)
    .delete(vaccinations.deleteAll)
router.route('/:id')
    .put(vaccinations.update)
    .delete(vaccinations.deleteOne)
    .get(vaccinations.findOne)

module.exports = router;