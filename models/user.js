const mongoose=require("mongoose");

const UserSchema=mongoose.Schema({

    userName:String,
    password:String,
    tasks:[{ type: mongoose.Schema.Types.ObjectId, ref: 'UserTask' }]
})



module.exports=mongoose.model('UserToDo',UserSchema);