const express = require("express");
const { getOrders, createOrder, getOrder, updateOrder, deleteOrder } = require("../controllers/orderControllers");
const router = express.Router();

router.route("/").get(getOrders).post(createOrder);
router.route("/:id").get(getOrder).put(updateOrder).delete(deleteOrder);

module.exports = router;
