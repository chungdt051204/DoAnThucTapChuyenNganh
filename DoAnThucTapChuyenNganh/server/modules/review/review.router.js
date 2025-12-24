const express = require("express");
const router = express.Router();
const reviewController = require("./review.controller");
const prefix = "";
router.get(`${prefix}/review`, reviewController.getReview);
router.post(`${prefix}/review`, reviewController.postReview);
module.exports = router;
