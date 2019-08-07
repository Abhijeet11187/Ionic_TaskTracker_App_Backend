const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const User = require("../models/user");
const Task=require("../models/task");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './upload/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, new Date().toISOString() + file.originalname);
//     }
// });

const upload = multer();

router.get('/:userName', async(req, res, next) => {
   console.log("in the get method");
    userName=req.params.userName;
    await User.findOne({userName:userName}).populate("tasks").then((reds)=>{
        try{
            console.log(res);
            //return res;
            res.status(200).json({message:reds})
            //res.send({message:res})
        }
        catch(e)
        {
        console.log(e);
        }
    }).catch((err)=>{
        console.log('hiq');
        console.log(err);
        res.status(500).json({err:err})
    })
})

//Login User

router.post('/login/:userName', upload.single(),(req, res, next) => {
   // console.log("sadsasdsdd")
   
    let userName=req.params.userName;
    let password=req.body.password;
   // console.log("sadsad")
  //  console.log(userName);
   // console.log(password);
    User.findOne({userName:userName})
    .exec()
    .then((result)=>{
        //console.log("result",result)
        if(result===null){
            console.log("dfsdf")
            res.status(200).json({
                message:"Not Found"
             })
        }
       else{
       // console.log("result",result)
        if(password===result.password)
        {
             res.status(200).json({
                 
                message:result
             })
        }
       else{
        res.status(200).json({
            message:"Not Found"
         })
       }
       }
    })
    .catch((err)=>{
     //   console.log(err);
        res.status(400).json({
            error:err
        })
    })

})


// Regsiter User

router.post('/register', upload.single(),(req, res, next) => {
    const userData = new User({
        userName: req.body.userName,
        password: req.body.password
    });
   // console.log("name",req.body.userName)
   // console.log("bosy",req.body);
    userData.save().then((result) => {
        res.status(200).json({ message: result });
    })
        .catch(
            (err) => {
                console.log(err);
                res.status(404).json({ err: err });
            }
        )
})

//updatetask

router.post('/updatetask/:oldtaskName', upload.single(),(req, res, next) => {
    oldtaskName=req.params.oldtaskName
    console.log("in the post");
    console.log(oldtaskName);
    const task=new Task({
        taskName:req.body.taskName,
        taskDescription:req.body.taskDescription,
        taskDate:req.body.taskDate,
        fav:false
    });
    //console.log(task);
    try{
        Task.update({taskName:oldtaskName},{taskName:req.body.taskName,taskDescription:req.body.taskDescription,taskDate:req.body.taskDate})
        .then(result=>{
            res.status(200).json({ message: result });
        })
    }catch(err){
        console.log("In error");
        console.log(err);

    }

})

//Delete  Task

router.delete('/:taskName', (req, res, next) => {
    console.log("in the delete")
   let taskName=req.params.taskName;
    console.log(taskName);
    Task.remove({taskName:taskName}).then((result)=>{
        res.send(200).json({message:result})
    })
});

//update fav



router.post('/favourite/:taskName',upload.single(), async(req, res, next) => {
    console.log("in the get color method");
    let taskName=req.params.taskName;
    console.log(req.body.fav);
    console.log("task name is ",taskName);
    //fav=true;
   // console.log("In the Fav post method ",fav)
        try{
            Task.updateOne({taskName:taskName},{fav:req.body.fav})
        .then(result=>{
            console.log(result);
            res.status(200).json({ message: result });
        })   
        }catch(e){
            console.log(e);
        }
})

// Task Completed


router.post('/complete/:taskName',upload.single(), async(req, res, next) => {
    console.log("in the complete method");
    let taskName=req.params.taskName;
    console.log(req.body.taskComplete);
    console.log("task name is ",taskName);
    //fav=true;
   // console.log("In the Fav post method ",fav)
        try{
            Task.updateOne({taskName:taskName},{taskComplete:true})
        .then(result=>{
            console.log(result);
            res.status(200).json({ message: result });
        })   
        }catch(e){
            console.log(e);
        }
})


//Register Task
 
router.post('/registerTask/:userName',upload.single(),async(req,res,next)=>{
    //console.log("in the register task");
    let userName=req.params.userName;
    //console.log("userNameis",userName)
    const task=new Task({
        taskName:req.body.taskName,
        taskDescription:req.body.taskDescription,
        taskDate:req.body.taskDate,
        fav:false,
        taskComplete:false
    });
   var user=await task.save();
   console.log("task saved details",user._id);
     await User.updateOne({userName:userName},{$push:{tasks:(user._id)}}).then((result)=>{
         //console.log(result);
         res.status(201).json({result})  
     },(err)=>{
       //  console.log(err);
     }).catch((err=>{
         //console.log(err);
     }))  

});


//Update all details



router.post('/updateDetails/:oldtaskName', upload.single(),(req, res, next) => {
    oldtaskName=req.params.oldtaskName
    console.log("in the post");
    console.log(oldtaskName);
    
    //console.log(task);
    try{
        Task.update({taskName:oldtaskName},{
            taskName:req.body.taskName,
            taskDescription:req.body.taskDescription,
            taskDate:req.body.taskDate,
            fav:req.body.fav,
            taskEndDate:req.body.taskEndDate,
            taskNotify:req.body.taskNotify,
            taskStartTime:req.body.taskStartTime,
            taskEndTime:req.body.taskEndTime
        })
        .then(result=>{
            res.status(200).json({ message: result });
        })
    }catch(err){
        console.log("In error");
        console.log(err);

    }

})


module.exports = router;