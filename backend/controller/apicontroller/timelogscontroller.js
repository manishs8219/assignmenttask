
const employeeDB = require("../../models/employee")

const timelogDB = require("../../models/timelogs")

const projectDB = require("../../models/projects.js")

const helper = require('../../helper/helper.js')

module.exports = {

addTimeLog: async (req, res) => {
  try {
    const required = {
      employeeId: req.body.employeeId,
      date: req.body.date,
      logsByProject: req.body.logsByProject
    };

    const nonRequired = {};

    const getData = await helper.vaildObject(required, nonRequired, res);

    if (!getData) return;

      if (!Array.isArray(getData.logsByProject)) {
      if (typeof getData.logsByProject === 'object' && getData.logsByProject !== null) {
        getData.logsByProject = [getData.logsByProject]; // wrap single object into array
      } else {
        return res.status(400).json({
          success: false,
          message: "logsByProject must be an array or a valid object"
        });
      }
    }
    
    // Calculate total hours from logs
const totalHours = getData.logsByProject.reduce((sum, log) => {
  const hours = parseFloat(log.hours);
  return sum + (isNaN(hours) ? 0 : hours);
}, 0);

    // Determine status
    const status = totalHours < 8 ? "⚠️ Less than 8 hours" : "✅ Complete";

    // Create new time log
    const newLog = await timelogDB.create({
      employeeId: getData.employeeId,
      date: getData.date,
        totalHours: Number(totalHours), // ensures it's saved as a Number
      status,
      logsByProject: getData.logsByProject
    });

    return helper.success(res, "Time log added successfully", newLog);

  } catch (err) {
    return helper.error(res, err);
  }
},

getEmployeeTimeLog: async (req, res) => {
  try {
    const { employeeId, date, page = 1, limit = 10 } = req.body;

    if (!employeeId || !date) {
      return res.status(400).json({ success: false, message: "employeeId and date are required" });
    }

    // Format date only (ignore time part)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const skip = (page - 1) * limit;

    const data = await timelogDB.aggregate([
      {
        $match: {
          employeeId,
          date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $lookup: {
          from: "projects",
          localField: "logsByProject",
          foreignField: "_id",
          as: "logsByProject"
        }
      },
      {
        $addFields: {
          logsByProject: {
            $map: {
              input: "$logsByProject",
              as: "log",
              in: {
                projectName: "$$log.projectName",
                hours: "$$log.hours"
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          employeeId: 1,
          date: 1,
          totalHours: 1,
          status: 1,
          logsByProject: 1
        }
      },
      { $skip: skip },
      { $limit: parseInt(limit) }
    ]);

    const totalCount = await timelogDB.countDocuments({
      employeeId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (data.length === 0) {
      return helper.error(res, "No time log found for this employee and date");
    }

    return helper.success(res, "Get successfully", {
      totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / limit),
      data
    });

  } catch (error) {
    console.error("Error in getEmployeeTimeLog:", error);
    return helper.error(res, error);
  }
},






}
