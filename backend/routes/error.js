const express = require("express");
const { errorPage } = require("../controllers/error.js");

const router = express.Router();

router.use(errorPage);

module.exports = router;
