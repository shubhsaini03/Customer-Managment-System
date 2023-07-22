const express=require('express')
const app=express()
app.use(express.urlencoded({extended:'false'}))
const adminrouter=require('./routers/admin');
const frontrouter=require('./routers/frontend');


const mongoose=require('mongoose')
const sesion=require('express-session')


mongoose.connect('mongodb://127.0.0.1:27017/project',()=>{
    console.log("conect to express")
})


app.use(sesion({
    secret:'shubh',
    resave:false,
    saveUninitialized:false 
    
}))
app.use('/admin',adminrouter);
app.use(frontrouter);
app.use(express.static('public'));
app.set('view engine','ejs');
app.listen(5000,()=>{console.log("server runing on 5000")});