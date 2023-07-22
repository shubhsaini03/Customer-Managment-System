const mongoose=require('mongoose')
const regschema=mongoose.Schema({
    username:String,
    password:String,
    firstName:String,
    lastName:String,
    email:String,
    status:String,
    img:String,
    role:String
    



})
module.exports=mongoose.model('userreg',regschema);