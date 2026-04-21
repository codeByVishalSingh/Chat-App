import express from "express"
import { protectRotes} from "../Middleware/auth.js";
import { getMesssages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRotes, getUsersForSidebar)
messageRouter.get("/:id", protectRotes, getMesssages)
messageRouter.put("mark/:id", protectRotes, markMessageAsSeen)
messageRouter.post("/send/:id", protectRotes, sendMessage)


export default messageRouter;

