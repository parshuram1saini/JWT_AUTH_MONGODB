import mongoose  from "mongoose";

//defining schema //
const  userSchema = new mongoose.Schema({
    username:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true},
    password:{type:String,required:true,trim:true},
    confirmPassword:{type:String,trim:true}
})

const UserModal = mongoose.model("userdata",userSchema);

export default UserModal;