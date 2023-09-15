const express = require('express');
const UserWorks = require('../controllers/work_user.controller');

const router = express.Router();

router.route('/')
    .post(UserWorks.create)
    .get(UserWorks.findAll)

router.route('/:id')
    .put(UserWorks.update)
    .get(UserWorks.findOne)
    .delete(UserWorks.deleteOne)

module.exports = router;
