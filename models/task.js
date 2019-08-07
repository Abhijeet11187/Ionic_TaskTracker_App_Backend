const mongoose=require("mongoose");

const UserSchema=mongoose.Schema({

    taskName:String,
    taskDescription:String,
    taskDate:String,
    fav:Boolean,
    taskEndDate:String,
    taskNotify:Boolean,
    taskStartTime:String,
    taskEndTime:String,
    taskComplete:Boolean
})



module.exports=mongoose.model('UserTask',UserSchema);