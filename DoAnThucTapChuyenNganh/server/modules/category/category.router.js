const express = require("express");
const {
  createCat,
  deleteCat,
  getAllCats,
  updateCat,
} = require("./category.controller");

const router = express.Router();

router.get("/", getAllCats);
router.post("/", createCat);
router.put("/:id", updateCat);
router.delete("/:id", deleteCat);

module.exports = router;
