import { Router } from 'express';
import {
  login,
  register,
  profile,
  updateUser,
  updateProfile,
  updateUserLocation,
  discoverUsers,
  deleteUser,
} from '../controllers/user.controller';
import {
  addFriends,
  getFriends,
  acceptFriendsRequest,
} from '../controllers/friends.controller';
import authToken from '../middlewares/auth.middleware';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/addfriends', authToken, addFriends);
router.post('/acceptfriendrequest', authToken, acceptFriendsRequest);

router.put('/updateuser', authToken, updateUser);
router.put('/updateProfile', authToken, updateProfile);
router.put('/updateuserlocation', authToken, updateUserLocation);

router.get('/profile', authToken, profile);
router.get('/getfriends', authToken, getFriends);
router.get('/discover', authToken, discoverUsers);

router.delete('/user/:userId', deleteUser);

export default router;
