const router = require('express').Router();
const adminlogin = require('../models/adminlog');
//const banner = require('../models/banner');
const Banner=require('../models/banner');
const contact=require('../models/contact');
const userreg=require('../models/userreg')
const userreview=require('../models/review')
const userparking=require('../models/parking')
const multer=require('multer');
const { render } = require('ejs');
const review = require('../models/review');
const { findOne } = require('../models/banner');
const nodemailer=require('nodemailer')

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

let sess;

function handlelogin(req,res,next){
    if(req.session.isAuth){
        next()
    }
    else{
        res.redirect('/admin/')
    }
}


router.get('/', (req, res) => {
    res.render('admin/adminlogin.ejs',{mess:""})
})
router.post('/adminrecord', async (req, res) => {

     const username = req.body.username;
     const pass = req.body.password;
    const adminrecord = await adminlogin.findOne({username:username});
    console.log(adminrecord);
    if (adminrecord!== null) {
        if (adminrecord.password == pass) {
            req.session.isAuth=true;
            sess=req.session;
            sess.username=username;
            console.log(sess.username)

            res.redirect('/admin/dashboard')
        }
        else {
            res.render('admin/adminlogin.ejs',{mess:"wrong username and password"})

        }

    }else{
        res.render('admin/adminlogin.ejs',{mess:"wrong username and password"})

    }
}

)

router.get('/dashboard',handlelogin,(req,res)=>{
    
 res.render('admin/dashboard.ejs',{username:sess.username});
})

router.get('/logout',(req,res)=>{
    req.session.destroy()
    sess='';
    console.log(sess.username)
    res.redirect('/admin/')
})



router.get('/banner',handlelogin,async(req,res)=>{
  const bannerRecords= await Banner.findOne()
    res.render('admin/banner.ejs',{message:"hello",bannerRecords,username:sess.username})
})

router.get('/bannerupdate/:id', handlelogin,async(req,res)=>{
    
    const id=req.params.id;
    const bannerdata=await Banner.findById(id);
    res.render('admin/bannerupdate.ejs',{bannerdata,username:sess.username})
})

router.post('/bannerupdate/:id',upload.single('img'),async(req,res)=>{
    const imgname=req.file.filename
    const id=req.params.id;

    const {title,desc,ldesc}=req.body
    await Banner.findByIdAndUpdate(id,{title:title,desc:desc,ldesc:ldesc,img:imgname})
  const bannerRecords= await Banner.findOne()
  res.render('admin/banner.ejs',{message:"successfully update",bannerRecords,username:sess.username})
})

router.get('/contact',async(req,res)=>{
    const contactrecord=await contact.find()
    res.render('admin/contact.ejs',{message:'hello',contactrecord,username:sess.username})
})

router.get('/contactusupdate/:id',async(req,res)=>{
    const id=req.params.id
const contactrecord =await contact.findById(id)
let newstatus=null;
if(contactrecord.status=='unread'){
    newstatus='read'

}
else{
    newstatus='unread'
}
await contact.findByIdAndUpdate(id,{status:newstatus})
res.redirect('/admin/contact')
})
router.get('/contactdelete/:id',async(req,res)=>{
   const id=req.params.id;
  await contact.findByIdAndDelete(id)
  const contactrecord=await contact.find()
  res.render('admin/contact.ejs',{message:' succesfully deleted',contactrecord,username:sess.username})
}
)

router.post('/contactsearch',async(req,res)=>{
   const searchvalue= req.body.search;
   const searchrecord= await contact.find({status:searchvalue})
   res.render('admin/contact.ejs',{message:'hello',contactrecord:searchrecord,username:sess.username})

})
 
router.get('/user',async(req,res)=>{
const userrecord=await userreg.find()
    res.render('admin/usermanagement',{userrecord,username:sess.username})
})
router.get('/userstatusupdate/:id',async(req,res)=>{
    const id=req.params.id
    const userrecord= await userreg.findById(id)
    let newstatus=null;
    if(userrecord.status=='suspend'){
        newstatus='active'

    }else{
        newstatus='suspend'
    }
     await userreg.findByIdAndUpdate(id,{status:newstatus})
     res.redirect('/admin/user')
    })


    router.get('/userdelete/:id',async(req,res)=>{
        const id=req.params.id;
       await userreg.findByIdAndDelete(id)
       const userrecord=await userreg.find()
       res.render('admin/usermanagement.ejs',{message:' succesfully deleted',userrecord,username:sess.username})
     }
     )

router.get('/userreview',handlelogin,async(req,res)=>{
    
   const reviewupdate= await userreview.find()
    res.render('admin/review.ejs',{message:'hello',reviewupdate,username:sess.username})
})

router.get('/reviewdelete/:id',async(req,res)=>{
    const id=req.params.id;
   await userreview.findByIdAndDelete(id)
   const reviewupdate=await userreview.find()
   res.render('admin/review.ejs',{message:' succesfully deleted',reviewupdate,username:sess.username})
 }
 )
router.get('/statusupdate/:id',async(req,res)=>{
    const id=req.params.id
    const statusupdate=await userreview.findById(id)
    let newstatus=null;
if(statusupdate.status=='unpublish'){
    newstatus='publish'

}
else{
    newstatus='unpublish'
}
await userreview.findByIdAndUpdate(id,{status:newstatus})
res.redirect('/admin/userreview')
})
router.post('/reviewsearch',async(req,res)=>{
    const searchvalue= req.body.search;
    const searchrecord= await userreview.find({status:searchvalue})
    res.render('admin/review.ejs',{message:'hello',reviewupdate:searchrecord,username:sess.username})
 
 })

router.get('/service',handlelogin,async(req,res)=>{
   const userrecord =await userreg.find()
    res.render('admin/service',{userrecord,username:sess.username})
})

router.get('/userroleupdate/:id',async(req,res)=>{
    const id=req.params.id
    const roleupdate=await userreg.findById(id)
    let newrole=null;
if(roleupdate.role=='public'){
    newrole='private'

}
else{
    newrole='public'
}
await userreg.findByIdAndUpdate(id,{role:newrole})
res.redirect('/admin/service')
})


router.get('/userroledelete/:id',async(req,res)=>{
    const id=req.params.id;
   await userreg.findByIdAndDelete(id)
   const userrecord=await userreg.find()
   res.render('admin/usermanagement.ejs',{message:' succesfully deleted',userrecord,username:sess.username})
 }
 )
 router.get('/email/:id',(req,res)=>{
const id=req.params.id
    res.render('admin/email',{id})
 })


router.post('/emailrecord/:id',upload.single('img'),async(req,res)=>{
    //const imgname=req.file.filename
   const emailrecord=await contact.findById(req.params.id)
    const{emailto,subject,body}=req.body
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'shubhsaini2020@gmail.com', // generated ethereal user
        pass: 'ztwtiyulkjlppkmi', // generated ethereal password
      },
    });
    let info = await transporter.sendMail({
        from: 'shubhsaini2020@gmail.com', // sender address
        to: emailrecord.email, // list of receivers
        subject: subject, // Subject line
        text: body, // plain text body
        //html: "<b>Hello world?</b>", // html body
        attachments:[{
            path:''
        }]
    
      });
      res.redirect('/admin/email')
})


//router.get('/email',async(req,res)=>{
    
//})

router.get('/parking',async(req,res)=>{
   const parkrecord= await userparking.find()
   const statuspark=await userparking.count({status:'IN'})
  // console.log(parkrecord)
  let totalparking=100
  let availableparking=(100-statuspark)
    res.render('admin/parking',{parkrecord,statuspark,availableparking})
})


router.get('/parkingadd',async(req,res)=>{
    const parkrecord=await userparking.find()
    res.render('admin/parkingadd',{parkrecord})
})
router.post('/parkingrecord',async(req,res)=>{
    const{vecno,vtype,vintime}=req.body
const parkrecord=new userparking({vecno:vecno,vtype:vtype,vintime:vintime,vouttime:'',totalcharge:'',status:'IN'})
await parkrecord.save();
console.log(parkrecord)
res.redirect('/admin/parking')
})

router.get('/parkingdelete/:id',async(req,res)=>{
    const id=req.params.id;
   await userparking.findByIdAndDelete(id)
   const parkrecord=await userparking.find()
   res.redirect('/admin/parking')
 }
 )

router.get('/parkstatusupdate/:id',async(req,res)=>{
//const parkrecord=req.body 
    const id=req.params.id
    
    const parkrecord=await userparking.find()
    res.render('admin/parkingupdate',{id,parkrecord})

})

router.post('/parkstatusupdate/:id',async(req,res)=>{
    const id=req.params.id
    const vout=req.body.out
      
   // console.log(req.params.id)
    console.log(req.body)

    const parkingrecord=await userparking.findById(id)
    //console.log(parkingrecord)
let totaltime= Number(vout)-Number(parkingrecord.vintime)
//console.log(totaltime)
let amount=null
if(parkingrecord.vtype=='2w'){
    amount=totaltime*50
}
else if(parkingrecord.vtype=='3w'){
    amount=totaltime*70
}
else if(parkingrecord.vtype=='4w'){
    amount=totaltime*100
}
else if(parkingrecord.vtype=='hw'){
    amount=totaltime*40
}
else if(parkingrecord.vtype=='lw'){
    amount=totaltime*120
}
await userparking.findByIdAndUpdate(id,{vouttime:vout,totalcharge:amount,status:'out'})
res.redirect('/admin/parking')
})




router.get('/test',(req, res) => {
    let pass=123;
    const adminrecord = new Banner({ title:'title',desc:'desc',ldesc:'ldesc'})
    adminrecord.save();
    
})


module.exports = router;


