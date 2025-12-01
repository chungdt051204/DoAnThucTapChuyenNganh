const express = require("express");
const router = express.Router();
const cartController = require("./cart.controller");
const prefix = "";
router.post(`${prefix}/addCart`, cartController.addCart);
module.exports = router;
