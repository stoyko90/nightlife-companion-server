import { Router } from 'express';
import authToken from '../middlewares/auth.middleware';
import {
  createEvent,
  acceptEventInvite,
  requestEvent,
  joinEvent,
  acceptUserRequest,
  inviteUsers,
  getNearbyEvents,
  getEventDetails,
  deleteEvent,
  updateEvent,
} from '../controllers/event.controller';
const router = Router();

router.post('/createevent', authToken, createEvent, inviteUsers);
router.post('/accepteventinvite', authToken, acceptEventInvite);
router.post('/requestevent', authToken, requestEvent);
router.post('/joinevent', authToken, joinEvent);
router.post('/event/:eventId/acceptuserrequest', authToken, acceptUserRequest);
router.post('/event/:eventId/inviteuser', authToken, inviteUsers);

router.get('/getnearbyevents', authToken, getNearbyEvents);
router.get('/event/:eventId/eventdetails', getEventDetails);

router.put('/event/:eventId', updateEvent);

router.delete('/event/:eventId', deleteEvent);

export default router;
