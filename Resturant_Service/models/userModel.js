import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim:true 
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    contactNumber: { 
        type: String, 
        required: true 
    },
    isAvailable: { 
        type: Boolean, 
        default: undefined 
    },
    verifiedByAdmin: { 
        type: Boolean,
        default: undefined 
    },
    lat: {
        type: Number,
        // required: function () {
        //     return this.role === '2';
        //   }
    },
    lng: {
        type: Number
    },
    role:{
        type:Number,
        enum:[ 0 , 1 , 2 , 3],
        default:0 // 0-customer, 1-admin, 2- restaurant, 3-driver
    },
    DriverId: { 
        type: String, 
        default: undefined 
    },
},{timestamps:true});

export default mongoose.model('users',userSchema);