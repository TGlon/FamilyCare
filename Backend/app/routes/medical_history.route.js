const express = require('express');
const medicals = require('../controllers/medical_history.controller');
const router = express.Router();


router.route('/')
    .post(medicals.create)
    .get(medicals.findAll)
    .delete(medicals.deleteAll)
router.route('/:id')
    .put(medicals.update)
    .delete(medicals.deleteOne)
    .get(medicals.findOne)
router.route('/byUserId/:UserId')
    .get(medicals.findAllByUserId);
module.exports = router;