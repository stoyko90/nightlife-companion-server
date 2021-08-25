import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { IUserRequest, TokenInterface } from '../interfaces';

const ACCESS_TOKEN_SECRET = 'apple';

async function authToken(
  req: IUserRequest,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === undefined) return res.sendStatus(401);
  try {
    const { email } = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenInterface;
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error();
    user.password = '';
    req.user = user;
    next();
    return;
  } catch (error) {
    return res.sendStatus(401);
  }
}

export default authToken;
