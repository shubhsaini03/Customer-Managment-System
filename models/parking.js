const mongoose=require('mongoose');


const parkingschema=mongoose.Schema({
    vecno:String,
    vtype:String,
    vintime:String,
    vouttime:Number,
    totalcharge:Number,
    status:String
})

module.exports=mongoose.model('parking',parkingschema);