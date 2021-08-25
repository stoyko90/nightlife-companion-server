import { Response } from 'express';
import { User } from '../models/index.model';
import UserFriend from '../models/userFriends.model';
import { IUserRequest } from '../interfaces';

async function addFriends(req: IUserRequest, res: Response): Promise<void> {
  try {
    const user1 = await User.findOne({ where: { id: req.user.id } });
    if (!user1) throw new Error('User not found');
    const { id } = req.body;
    if (!id) throw new Error('Friend ID not passed');
    await user1.addSentRequest(id);
    const user2 = await User.findOne({ where: { id } });
    if (!user2) throw new Error('Friend not found');

    await user2.addReceivedRequest(req.user.id);

    res.status(200).send({ user1, user2 });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

async function getFriends(req: IUserRequest, res: Response): Promise<void> {
  try {
    const user = await User.findOne({
      attributes: { exclude: ['password'] },
      where: { id: req.user.id },
      include: [
        {
          model: User,
          as: 'sentRequests',
          attributes: { exclude: ['password'] },
          through: { attributes: [] },
        },
        {
          model: User,
          as: 'receivedRequests',
          attributes: { exclude: ['password'] },
          through: { attributes: [] },
        },
        {
          model: User,
          as: 'friends',
          attributes: { exclude: ['password'] },
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .send({ error: error.message, msg: 'get friends not successful' });
  }
}

async function acceptFriendsRequest(
  req: IUserRequest,
  res: Response
): Promise<void> {
  try {
    const { id } = req.body;
    if (!id) throw new Error('Friend ID not passed');

    let user1 = await User.findOne({
      where: { id: req.user.id },
    });

    if (!user1) throw new Error('user not found');
    let user2 = await User.findOne({
      where: { id },
    });

    if (!user2) throw new Error('friend not found');

    await user1.addFriends(user2);
    await user2.addFriends(user1);

    const deleted = await UserFriend.destroy({
      where: {
        senderId: user2.id,
        receiverId: user1.id,
      },
    });

    user1 = await User.findOne({
      where: { id: req.user.id },
      include: ['sentRequests', 'receivedRequests'],
    });
    user2 = await User.findOne({
      where: { id },
      include: ['sentRequests', 'receivedRequests'],
    });

    res
      .status(200)
      .send({ userAccepting: user1, userRequesting: user2, deleted: deleted });
  } catch (error) {
    res.status(401).send({ error: error.message, msg: 'Not successful' });
  }
}

export { addFriends, getFriends, acceptFriendsRequest };
