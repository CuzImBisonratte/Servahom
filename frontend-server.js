const express = require("express");
const router = express.Router();

router.get("*", express.static("frontend"));

module.exports = router;
