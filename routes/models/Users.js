const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avator:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = User = mongoose.model("users",UserSchema);