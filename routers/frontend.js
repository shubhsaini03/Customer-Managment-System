const router=require('express').Router()
const Banner=require('../models/banner');
const contact=require('../models/contact');
const userreg = require('../models/userreg');
const usereg=require('../models/userreg')
const reviewupdate=require('../models/review')

const bcrypt=require('bcrypt')
const multer=require('multer');
const review = require('../models/review');


let storage=multer.diskStorage({
   destination: function(req,file,cb){
      cb(null,'./public/upload')
   },
   filename:function(req,file,cb){
      cb(null,Date.now()+file.originalname)
   },
})
let upload=multer({
   storage:storage,
   limits:{fileSize:1024*1024*5}
})
let sess=null;

function handlelogin(req,res,next){
   if(req.session.isAuth){
       next()
   }
   else{
       res.redirect('/login')
   }
}
function handlerole(req,res,next){
   if(sess.role=='private'){
       next()
   }
   else{
       res.send('You dont have right to see this content')
   }
}
  





router.get('/',handlelogin,async(req,res)=>{
   const bannerRecords= await Banner.findOne()
   const userrecord= await userreg.findOne({username:sess.username})
  const reviewrecord= await reviewupdate.find({status:'publish'})
    res.render('index.ejs',{bannerRecords,reviewrecord,userrecord,username:sess.username})
})

router.get('/banner',handlelogin,handlerole,async(req,res)=>{
    const bannerRecords= await Banner.findOne()
    res.render('banner.ejs',{bannerRecords,username:sess.username})
})
router.post('/contactrecord',(req,res)=>{
   const {email,query}=req.body
   const contactrecord=new contact({email:email,query:query,status:'unread',postdata:new Date})
contactrecord.save();
   res.redirect('/')
})

router.get('/reg',(req,res)=>{
   res.render('userreg.ejs',{mess:"",username:'hello'})
})
router.post('/register',async(req,res)=>{
   const {username,password,firstName,lastName,email}=req.body
   const convertpass=await bcrypt.hash(password,10)
   const userrecord= await userreg.findOne({username:username})
   if(userrecord!==null){
      res.render('userreg.ejs',{mess:"username already exists",username:'hello'})
   }
   else{
   //console.log(userrecord)
   const regrecord=new userreg({username:username,password:convertpass,firstName:firstName,lastName:lastName,email:email,status:'suspend',img:'default.jpg',role:'public'})
   await regrecord.save()
   res.render('login',{mess:"succesfully register",username:'hello'})
   //console.log(regrecord)
}})
router.get('/login',(req,res)=>{
   if(sess!==null){

   
      res.render('login',{mess:"",username:sess.username})
   }
   else{
      res.render('login',{mess:"",username:'hello'})
   }})


router.get('/brand',handlerole,(req,res)=>{
   
   res.render('brand.ejs',{username:sess.username})
})
router.get('/company',handlelogin,handlerole,(req,res)=>{
   res.render('company.ejs',{username:sess.username})
})

router.post('/loginrecord',async(req,res)=>{
   const {username,password}=req.body
   const userrecord=await usereg.findOne({username:username})
if(userrecord!==null){
   const dd=await bcrypt.compare(password,userrecord.password)
   if(dd){
      if(userrecord.status=='active'){
         req.session.isAuth=true;
         sess=req.session
         sess.username=username;
         sess.role=userrecord.role;
         res.redirect('/profile')      
      }
      else{
         res.send("your account is suspend.Please coordinate with you admin")
      }
}else{
   res.render('login',{mess:"wrong credentials",username:'hello'})
}


}else{
   res.render('login',{mess:"wrong credentials",username:'hello'})
}


})

router.get('/profile',handlelogin,async(req,res)=>{
  const userrecord= await userreg.findOne({username:sess.username})

   if(sess!==null){

   
      res.render('profile',{userrecord,username:sess.username})
   }
   else{
      res.render('profile',{userrecord,username:'hello'})
   }
})
router.get('/profileupdate',handlelogin,async(req,res)=>{
   

   const userrecord= await userreg.findOne({username:sess.username})
   res.render('profileupdate',{userrecord,username:sess.username})
})
router.post('/update/:id',upload.single('img'),async(req,res)=>{

   const id=req.params.id
  const {firstName,lastName,email,username}=req.body
  if(req.file){
   const imgname= req.file.filename
  await userreg.findByIdAndUpdate(id,{firstName:firstName,lastName:lastName,email:email,img:imgname,username:username})
  }
  else{
   const imgname= 'default.jpg'
   await userreg.findByIdAndUpdate(id,{firstName:firstName,lastName:lastName,email:email,img:imgname,username:username})
  }
  res.redirect('/profile')
  
   //const imgname=req.file.filename;
   //const id=req.params.id;
   //const{firstName,lastName,email,username}=req.body;
 //await userreg.findByIdAndUpdate(id,{firstName:firstName,lastName:lastName,email:email,username:username})
 //const userrecord= await userreg.findOne({username:sess.username})
  //res.render('profile.ejs',{userrecord,username:sess.username})
 
})
router.get('/review',handlelogin,handlerole,async(req,res)=>{
   const reviewupdate=await review.findOne({username:sess.username})
   const userrecord= await userreg.findOne({username:sess.username})
   res.render('review',{reviewupdate,userrecord,username:sess.username})
})
router.post('/reviewupdate',upload.single('img'),async(req,res)=>{
   const imgname=req.file.filename

const {review,company,designation}=req.body
const userreview = new reviewupdate({review:review,company:company,designation:designation,Name:sess.username,img:imgname,status:'unpublish',pushdata:new Date})
 await userreview.save()
 res.redirect('/review')
 //console.log(userreview)
})

router.get('/logout',(req,res)=>{
   req.session.destroy()
   sess=null;
   res.redirect('login')
})


module.exports=router;

