const express = require('express');
const chronics = require('../controllers/chronic.controller');
const router = express.Router();


router.route('/')
    .post(chronics.create)
    .get(chronics.findAll)
    .delete(chronics.deleteAll)
router.route('/:id')
    .put(chronics.update)
    .delete(chronics.deleteOne)
    .get(chronics.findOne)

module.exports = router;