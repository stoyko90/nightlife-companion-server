import { Request, Response } from 'express';
import { User, Chat, Message } from '../models/index.model';
import { IUserRequest } from '../interfaces';

async function createChat(req: IUserRequest, res: Response): Promise<void> {
  try {
    const userCreatingChat = await User.findOne({ where: { id: req.user.id } });
    const userJoiningChat = await User.findOne({
      where: { id: req.body.chatUserId },
    });

    if (!userCreatingChat) throw new Error();
    if (!userJoiningChat) throw new Error();

    const chat = await userCreatingChat.createChat();
    chat.addUser(userJoiningChat);
    res.send({ chat, userCreatingChat, userJoiningChat });
  } catch (error) {
    res.send({ error: error.message, mesg: 'Unable to create chat' });
  }
}

async function getUserChats(req: IUserRequest, res: Response): Promise<void> {
  try {
    const { id } = req.user;
    const result = await User.findOne({
      where: { id },
      attributes: ['id', 'username', 'profilePic'],
      include: [
        {
          model: Chat,
          attributes: ['id'],
          through: { attributes: [] },
          include: [
            {
              model: User,
              attributes: ['id', 'username', 'profilePic'],
              through: { attributes: [] },
            },
            {
              model: Message,
              limit: 1,
              order: [['createdAt', 'DESC']],
            },
          ],
        },
      ],
    });

    if (!result) throw new Error();

    res.send(result);
  } catch (error) {
    res.status(400).send({
      error: error.message,
      msg: 'Can not get user chats and messages',
    });
  }
}

async function deleteChat(req: Request, res: Response): Promise<void> {
  try {
    const { chatId } = req.params;
    await Chat.destroy({ where: { id: chatId } });
    res.status(200).send('Chat deleted');
  } catch (error) {
    res.status(401).send({
      error: error.message,
      msg: 'Cannot delete chat',
    });
  }
}

export { createChat, getUserChats, deleteChat };
