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
// Định nghĩa route mới để tìm tất cả thuốc cùng một MedicalHistoryId
router.route('/medical-history/:MedicalHistoryId')
    .get(medicine.findAllByMedicalHistoryId);
router.route('/create')
    .post(medicine.createName);
// Định nghĩa route để tìm tất cả thuốc của một người dùng dựa trên UserId
router.route('/user/:userId/medicines')
    .get(medicine.findAllByUserId);
module.exports = router;

