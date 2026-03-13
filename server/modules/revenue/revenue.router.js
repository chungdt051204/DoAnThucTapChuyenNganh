const express = require("express");
const router = express.Router();
const revenueController = require("./revenue.controller");
const prefix = "";
router.get(`${prefix}/revenue`, revenueController.getRevenue);
module.exports = router;
