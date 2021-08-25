// import { Request, Response } from 'express';
import { Response } from 'express';
import { Chat } from '../models/index.model';
import Message from '../models/message.model';
import { IUserRequest } from '../interfaces';

async function createMessage(req: IUserRequest, res: Response): Promise<void> {
  try {
    const { chatId } = req.params;
    const { id } = req.user;
    if (!chatId || !id) throw new Error('chatId not passed');
    const chat = await Chat.findOne({ where: { id: chatId } });
    if (!chat) throw new Error('chat not found');
    const { content } = req.body;

    const createdMessage = await chat.createMessage({
      chatId: chat.id,
      senderId: id,
      content,
    });
    res.send(createdMessage);
  } catch (error) {
    res.send({ error: error.message, message: 'Could not create message ' });
  }
}

// async function getMessages(req: Request, res: Response): Promise<void> {
//   try {
//     const { chatId } = req.params;
//     if (!chatId) throw new Error('ChatID not passed ');

//     const chat = await Chat.findOne({
//       where: { id: chatId },
//       include: [Message],
//     });
//     res.send(chat);
//   } catch (error) {
//     res.send({ error: error.message, message: 'Could not get messages' });
//   }
// }

async function getMessages(chatId: number): Promise<any> {
  try {
    console.log('message controller=========');
    if (!chatId) throw new Error('ChatID not passed ');
    const chat = await Chat.findOne({
      where: { id: chatId },
      include: [Message],
    });
    const chatPlain = chat?.get({ plain: true });
    return chatPlain;
  } catch (error) {
    return 'cannot get messages';
  }
}

export { createMessage, getMessages };
