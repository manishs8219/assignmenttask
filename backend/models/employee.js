const mongoose = require('mongoose')

const epmloyeeSchema = mongoose.Schema({
    name:{
        type:String,
        default:null
    },
    email:{
        type:String,
        default:null
    },
    countryCode:{
        type:String,
        default:null
    },
    phoneNumber:{
        type:Number,
        default:0
    },
  
},{
    timestamps:true
})

module.exports = mongoose.model('employee',epmloyeeSchema)