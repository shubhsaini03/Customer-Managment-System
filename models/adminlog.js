const mongoose=require('mongoose');


const adminlogschema=mongoose.Schema({
    username:String,
    password:String
})

module.exports=mongoose.model('adminlog',adminlogschema);