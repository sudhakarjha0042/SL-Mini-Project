const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

console.log("markAttendance.js");
router.get('/markAttendace', attendanceController.markAttendancesid)


module.exports = router;