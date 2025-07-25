const mongoose = require('mongoose')

const projectLogSchema = new mongoose.Schema({
  projectName: { type: String,},
  hours: { type: Number,}
},{
    timestamps:true
});

module.exports = mongoose.model('projects',projectLogSchema)