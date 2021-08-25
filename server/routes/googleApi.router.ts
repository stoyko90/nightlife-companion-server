import { Router } from 'express';
import {
  findPlaces,
  getPlaceDetails,
} from '../controllers/googleApi.controller';
import authToken from '../middlewares/auth.middleware';

const router = Router();

router.post('/findplaces', authToken, findPlaces);
router.get('/placedetails/:placeId', getPlaceDetails);

export default router;
