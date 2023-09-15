const express = require('express');
const User_Family = require('../controllers/user_family.controller');

const router = express.Router();

router.route('/')
    .post(User_Family.create)
    .get(User_Family.findAll)

router.route('/:id')
    .get(User_Family.findOne)
    .post(User_Family.deleteOne)

router.route('/user/:UserId')
    .get(User_Family.findAllByUserId);
router.route('/family/:FamilyId')
    .get(User_Family.findAllByFamilyId);
module.exports = router;