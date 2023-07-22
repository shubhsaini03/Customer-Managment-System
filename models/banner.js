const mongoose=require('mongoose')

const bannerschema=mongoose.Schema({

    title:String,
    desc:String,
    ldesc:String,
    img:String
})

module.exports=mongoose.model('banner',bannerschema);