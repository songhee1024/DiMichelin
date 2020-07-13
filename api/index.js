const { Router } = require("express");
const router = Router();

router.use("/opinion", require("./opinion"));

module.exports = router;
