const mongoose = require('mongoose')

const timeLogSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  date: { type: Date, required: true },
  totalHours: { type: Number, required: true },
  status: { type: String },
  logsByProject: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects"  // Ensure your model name matches this or change to "Project" if that's the correct model name
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('timelogs',timeLogSchema)

