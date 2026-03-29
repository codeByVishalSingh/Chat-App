import React, { useState } from "react";
import Sidebar from "../Components/Sidebar"
import ChatContainer from "../Components/ChatContainer"
import RightSidebar from "../Components/RightSidebar"
const HomePage =() =>{

const [selectedUser,setSelectedUser] = useState(false);
    return ( 
        <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'> 

        <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative 
        ${selectedUser ? 'md:grid-cols-[1fr_1.5fr 1fr] xl:grid-cols-[1fr 2fr 1fr]' : 'md:grid-cols-2'}`}>
            <Sidebar></Sidebar>
            <ChatContainer></ChatContainer>
            <RightSidebar></RightSidebar>
        </div>
        </div>
    )
}

export default HomePage;