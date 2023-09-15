const express = require("express");
const users = require("../controllers/user.controller");

const router = express.Router();

router.route("/").post(users.create).get(users.findAll);
// .delete(accounts.deleteAll)
// router
//   .route("/family/:FamilyId") // Định nghĩa route cho findAllByFamily, sử dụng FamilyId làm tham số
//   .get(users.findAllByFamily); // Gọi phương thức findAllByFamily từ controller
router
  .route("/:id")
  .put(users.update)
  .get(users.findOne)
  .delete(users.deleteOne);

module.exports = router;
