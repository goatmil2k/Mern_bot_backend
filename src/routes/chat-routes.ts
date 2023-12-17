import { Router } from 'express';
import { verifyToken } from '../utils/token-manager';
import { messageCompletionValidator, validate } from '../utils/validators';
import { deleteChats, generateChatCompletion, sendChatsToUser } from '../controllers/chatcontroller';


//Protected API
const chatRoute = Router();

chatRoute.post('/new', validate(messageCompletionValidator), verifyToken, generateChatCompletion);
chatRoute.get('/all-chats',  verifyToken, sendChatsToUser);
chatRoute.delete('/delete',  verifyToken, deleteChats);

export default chatRoute;