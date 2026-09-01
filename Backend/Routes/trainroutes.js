const express = require("express");
const router = express.Router();

const trainController = require("../controllers/traincontroller");

router.get("/search", trainController.searchTrains);

module.exports = router;