const mongoose=require('mongoose');


const adressschema=mongoose.Schema({
    adress:String,
    phone:String,
    telephone:String,
    about:String
})

module.exports=mongoose.model('adress',adressschema);