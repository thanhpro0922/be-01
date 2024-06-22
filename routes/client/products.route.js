const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/product.controller");

router.get("/", controller.index);

router.get("/:slugCategory", controller.category);

router.get("/detail/:slugProduct", controller.detail); // những cái động thay đổi như id hay slug thì phải có dấu : trước

module.exports = router;
