const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/request", authMiddleware, leaveController.requestLeave);

module.exports = router;
