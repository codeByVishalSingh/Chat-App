import mongoose from "mongoose";

export const connectDb = async ()=>{
    try{
        mongoose.connection.on('connected', ()=> console.log("Database is Connected"));
        await mongoose.connect(`${process.env.MONGODB_URi}/chat-app`)
    
    } catch(error){
         console.log(error);
         
    }
}