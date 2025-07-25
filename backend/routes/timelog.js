var express = require('express');
var router = express.Router();

const timelogscontroller = require('../controller/apicontroller/timelogscontroller')

router.post("/addTimeLog",timelogscontroller.addTimeLog)

router.post("/getEmployeeTimeLog",timelogscontroller.getEmployeeTimeLog)

module.exports = router;
