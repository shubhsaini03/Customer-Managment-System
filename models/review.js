const mongoose=require('mongoose')

const reviewSchema=mongoose.Schema({
username:String,
    company:String,
    review:String,
    designation:String,
    Name:String,
    status:String,
    img:String,
    Image:String,
    
    pushdata:Date
})

module.exports=mongoose.model('review',reviewSchema);