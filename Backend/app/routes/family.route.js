const express = require("express");
const family = require("../controllers/family.controller");

const router = express.Router();

router
  .route("/")
  .post(family.create)
  .get(family.findAll)
  .delete(family.deleteAll);

router
  .route("/:id")
  .put(family.update)
  .get(family.findOne)
  .delete(family.deleteOne);
router.route("/fam/:familyId").get(family.findAllById);
module.exports = router;
