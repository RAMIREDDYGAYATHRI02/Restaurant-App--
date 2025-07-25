import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

//login user
const loginUser=async(req,res)=>{
    const{email,password}=req.body;
    try{
         const user=await userModel.findOne({email});
         if(!user){
            return res.json({success:false,message:"User Dosen't Exists"})
         }
         const isMatch=await bcrypt.compare(password,user.password);
         if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"})
         }
         const token=createToken(user._id);
         res.json({success:true,token})

    }
    catch(error){
        console.log(error)
        res.json({success:false,mesasge:"Error"})

    }
}

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//resgister user
const registerUser=async(req,res)=>{
    const{name,password,email}=req.body;
    try{
      //checking if the user exists
      const exists=await userModel.findOne({email})
      if(exists){
           return res.json({success:false,message:"User already exists"})
      }
   
    //validating email and strong passsword
    if(!validator.isEmail(email)){
        return res.json({success:false,message:"Please enter a valid email"})
    }
    if(password.length<8){
        return res.json({success:false,message:"Please enter a strong passord"})

    }

    //hashing user model
    const salt=await bcrypt.genSalt(10)
    const hashPassword=await bcrypt.hash(password,salt)
    const newUser=new userModel({
        name:name,
        email:email,
        password:hashPassword
    })

    const user=await newUser.save()
    const token=createToken(user._id)
    res.json({success:true,token});


 }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})

    }

}

export{loginUser,registerUser}