import { Request, Response } from 'express';
import { User, Event } from '../models/index.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userToken, IUserRequest } from '../interfaces';
const ACCESS_TOKEN_SECRET = 'apple';
import { Op } from 'sequelize';

async function register(req: Request, res: Response): Promise<Response> {
  try {
    const { email, password } = await req.body;
    if (!email || !password) throw new Error('email or password not passed');
    const user = await User.findOne({ where: { email } });
    if (user)
      return res
        .status(409)
        .send({ error: 409, message: 'User already exists' });

    if (password === '') throw new Error('password should not be empty');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = (await User.create({
      ...req.body,
      password: hashedPassword,
    }).then((data) => data.get({ plain: true }))) as userToken;

    newUser.password = '';
    const accessToken = jwt.sign({ email }, ACCESS_TOKEN_SECRET);
    newUser.token = accessToken;
    return res.status(201).send(newUser);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
}

async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = await req.body;
    if (!email || !password) throw new Error('email or password not passed');
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Account not found');
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) throw new Error('Incorrect email or password');
    const accessToken = jwt.sign({ email }, ACCESS_TOKEN_SECRET);
    res.status(200).send(accessToken);
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

async function updateUser(req: IUserRequest, res: Response): Promise<void> {
  try {
    const { bio, DOB, profilePic, gender } = await req.body;
    const user = await User.findOne({
      where: { email: req.user.email },
      attributes: { exclude: ['password'] },
    });
    if (!user) throw new Error('user not found');
    const updatedUser = await user!.update({ bio, DOB, profilePic, gender });
    // if (!updatedUser) throw new Error('User could not be updated ');
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

async function profile(req: IUserRequest, res: Response): Promise<void> {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: Event,
          as: 'receivedInviteEvents',
          through: { attributes: [] },
        },
        {
          model: Event,
          as: 'sentRequestsEvents',
          through: { attributes: [] },
        },
        {
          model: Event,
          as: 'attendingEvents',
          through: { attributes: [] },
        },
      ],
    });
    if (!user) throw new Error('could not get user');
    res.status(200).send(user);
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

async function updateProfile(req: IUserRequest, res: Response): Promise<void> {
  try {
    const user = await req.user;
    res.status(200).send(user);
  } catch (error) {
    res
      .status(401)
      .send({ error: error.message, msg: 'Can not update user profile' });
  }
}

async function updateUserLocation(
  req: IUserRequest,
  res: Response
): Promise<void> {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    const { latitude, longitude } = req.body;
    const updatedUser = await user!.update({ latitude, longitude });
    updatedUser.password = '';
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

async function discoverUsers(req: IUserRequest, res: Response): Promise<void> {
  try {
    const nearbyUsers = await User.findAll({
      where: {
        id: {
          [Op.ne]: req.user.id,
        },
        latitude: {
          [Op.gt]: -90,
          [Op.lt]: 90,
        },
        longitude: {
          [Op.gt]: -180,
          [Op.lt]: 180,
        },
      },
    });

    res.status(200).send(nearbyUsers);
  } catch (error) {
    res.status(401).send({ error: error.message, msg: 'Could not find users' });
  }
}

async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    await User.destroy({ where: { id: userId } });
    res.status(200).send('User deleted');
  } catch (error) {
    res.status(401).send({ error: error.message, msg: 'Cannot delete user' });
  }
}

export {
  login,
  register,
  profile,
  updateUser,
  updateUserLocation,
  discoverUsers,
  updateProfile,
  deleteUser,
};
