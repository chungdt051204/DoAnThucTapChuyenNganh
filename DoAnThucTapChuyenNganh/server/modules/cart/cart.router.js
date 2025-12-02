const express = require("express");
const router = express.Router();
const cartController = require("./cart.controller");
const prefix = "";
router.post(`${prefix}/addCart`, cartController.addCart);
router.get(`${prefix}/cart`, cartController.getCartItem);
router.delete(`${prefix}/cart-items`, cartController.deleteCartItems);
module.exports = router;
