const express = require('express');
const healths = require('../controllers/health_statistics.controller');
const router = express.Router();


router.route('/')
    .post(healths.create)
    .get(healths.findAll)
    .delete(healths.deleteAll)
router.route('/:id')
    .put(healths.update)
    .delete(healths.deleteOne)
    .get(healths.findOne)

module.exports = router;