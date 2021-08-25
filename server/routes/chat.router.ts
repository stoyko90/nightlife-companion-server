import { Router } from 'express';
import {
  createChat,
  getUserChats,
  deleteChat,
} from '../controllers/chat.controller';
import { createMessage, getMessages } from '../controllers/message.controller';
import authToken from '../middlewares/auth.middleware';

const router = Router();

router.post('/createchat', authToken, createChat);
router.post('/createmessage/:chatId', authToken, createMessage);

router.get('/getchats', authToken, getUserChats);
router.get('/getmessages/:chatId', getMessages);

router.delete('/chat/:chatId', deleteChat);

export default router;
