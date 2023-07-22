const mongoose=require('mongoose')

const contactSchema=mongoose.Schema({

    email:String,
    query:String,
    status:String,
    postdata:Date
})

module.exports=mongoose.model('contact',contactSchema);