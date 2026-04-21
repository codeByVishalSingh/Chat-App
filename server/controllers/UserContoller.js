
import { generateToken } from "../lib/Utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudniary.js";

export const signup = async () => {
   const {fullName,email,password,bio}  = req.body;
   try{
    if(!fullName|| !email|| !password|| !bio){
        return res.json({success: false,message:"Missing Details"})
    }
    const user = await User.findOne({emal});
    if(user){
        return res.json({success:false, message:"Account is allready exist"})
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = await User.create({
        fullName,emal,password:hashedPassword,bio
    });
    const token = generateToken(newUser._id)
    res.json({success:true, userData:newUser, token, message:"Account Created Successfylly"})
   }
   catch(error)
   {
console.log(error.message);
   res.json({success:false, message:error.message})
   }
}  


// Login User

export const login = async (req,res)=>{
try {
    const {email,password}  = req.body;
    const userData = await User.findOne({email})
    const isPasswordCorrect = await bcrypt.compare(password,userData.password);

    if(!isPasswordCorrect){
        return req.json({
            success:false, message:"Invaild Password"
        })
    }
    const token = generateToken(userData._id)
    res.json({success:true, userData, token, message:"Login Successfylly"})
} catch (error) {
    console.log(error.message);
   res.json({success:false, message:error.message})
}
}


// Contorller to check if user authenticate

export const checkAuth=(req,res)=>{
  res.json({
    success:true,user:req.user
  })
}

// Update User Profile Pic


export const updateProfile = async (req,res)=>{
    try {
        const {profilePic,bio,fullName} = req.body;

        const userId = req.user._id;
        let updatedUser;

        if(!profilePic){
            updatedUser= await User.findByIdAndUpdate(userId,{bio,fullName},
                {new:true});
        }
        
        else{
            const upload= await cloudinary.uploader.upload(profilePic)
            updatedUser = await User.findByIdAndUpdate(userId, {profilePic:upload.secure_url, bio,fullName},
                {new:true});
        }

            res.json({
                success:true,
                user:updatedUser
            })
    } catch (error) {
                       res.json({
                success:false, message: message.error
                
            })   
    }
}