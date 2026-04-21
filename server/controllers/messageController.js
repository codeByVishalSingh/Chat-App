import Message from "../models/Message.js";
import User from "../models/User.js"
import cloudinary from "../lib/cloudniary.js";
import { io, userSocketMap } from "../server.js";

export const getUsersForSidebar = async (req,res)=>{
    try {
        const userId =req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

        // Count Number of Message not seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId: user._id, receiverId:userId, seen:false})
            
            if(messages.length >0 ){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({
            success:true, Users:filteredUsers, unseenMessages
        })
        
    } catch (error) {
        console.log(error.message);
        
         res.json({
            success:false, message:message.error
        })
        
        
    }
}

// Get All Messages From Selected User

export const getMesssages = async (req,res)=>{
    try {
        const {id: SelectedUserId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: SelectedUserId},
                {senderId: SelectedUserId, receiverId: myId},

            ]
        })
        await Message.updateMany({senderId: SelectedUserId, receiverId:myId},
            {seen:true}
        )
        res.json({
            success:true, messages
        })
        
    } catch (error) {
           console.log(error.message);
        
         res.json({
            success:false, message:message.error
        })
    }
}
// api to marks messages as seen

export const markMessageAsSeen = async ()=>{
    try {
        const {id} = req.params
        await Message.findByIdAndDelete(id,{seen:true})
            res.json({
                success:true,
            })

        
    } catch (error) {
                  console.log(error.message);
        
         res.json({
            success:false, message:message.error
        })   
    }
}

// Send Message to Selected User 

export const sendMessage = async ()=>{
    try {

        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        // Emit the new Message

        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        } 

        res.json({
            success:true, newMessage
        })
        
    } catch (error) {
               console.log(error.message);
        
         res.json({
            success:false, message:message.error
        })   
    } 
}