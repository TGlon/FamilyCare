const express = require('express');
const allergys = require('../controllers/allergy.controller');
const router = express.Router();


router.route('/')
    .post(allergys.create)
    .get(allergys.findAll)
    .delete(allergys.deleteAll)
router.route('/:id')
    .put(allergys.update)
    .delete(allergys.deleteOne)
    .get(allergys.findOne)

module.exports = router;