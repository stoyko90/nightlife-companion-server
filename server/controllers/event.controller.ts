import { Request, Response, NextFunction } from 'express';
// import { Sequelize } from 'sequelize';
import { IUserRequest } from '../interfaces';
import { Event, User } from '../models/index.model';

async function createEvent(
  req: IUserRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) throw new Error('cannot find user');
    const createdEvent = await user.createEvent(req.body.event);
    if (req.body.ids) {
      req.event = createdEvent;
      return next();
    }
    res.status(200).send(createdEvent);
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

async function requestEvent(req: IUserRequest, res: Response): Promise<void> {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) throw new Error('cannot find user');
    const event = await Event.findOne({ where: { id: req.body.id } });
    if (!event) throw new Error('cannot find event');

    await user.addSentRequestsEvents(event);
    await event.addReceivedRequestsGuests(user);

    res.status(200).send({ msg: 'request has been sent ' });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

async function acceptEventInvite(
  req: IUserRequest,
  res: Response
): Promise<void> {
  try {
    let user = await User.findOne({ where: { id: req.user.id } });
    if (!user) throw new Error('User not found');
    let event = await Event.findOne({ where: { id: req.body.id } });
    if (!event) throw new Error('Event not found');

    await user.addAttendingEvents(event);
    await event.addAttendingGuests(user);

    await user.removeReceivedInviteEvents(event);
    await event.removeInvitedGuests(user);

    res.status(201).send('User accepted event invite');
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

async function joinEvent(req: IUserRequest, res: Response): Promise<void> {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) throw new Error('User not found');
    const event = await Event.findOne({ where: { id: req.body.id } });
    if (!event) throw new Error('Event not found');

    await user.addAttendingEvents(event);
    await event.addAttendingGuests(user);
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

async function acceptUserRequest(
  req: IUserRequest,
  res: Response
): Promise<void> {
  try {
    const { id } = req.body;
    if (!id || !req.params['eventId'])
      throw new Error('FriendId or EventId not passed ');
    const event = await Event.findOne({ where: { id: req.params['eventId'] } });
    if (!event) throw new Error('cannot find event ');
    if (event.createdBy !== req.user.id) {
      res
        .status(401)
        .send({ msg: ' you do not have permissions for this event ' });
    }
    const attendingUser = await User.findOne({ where: { id } });
    if (!attendingUser) throw new Error('cannot find attending user');

    await event.addAttendingGuests(attendingUser);
    await attendingUser.addAttendingEvents(event);

    await event.removeReceivedRequestsGuests(attendingUser);
    await attendingUser.removeSentRequestsEvents(event);

    res.status(200).send('Event accepted user request');
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

async function inviteUsers(req: IUserRequest, res: Response): Promise<void> {
  try {
    let event;
    const { ids } = req.body;
    if (req.event) {
      event = await Event.findOne({ where: { id: req.event.id } });
    } else {
      event = await Event.findOne({ where: { id: req.params['eventId'] } });
    }
    if (!event) throw new Error('cannot find event ');
    if (event.createdBy !== req.user.id) {
      res
        .status(401)
        .send({ msg: ' you do not have permissions for this event ' });
    }

    const invitedUsers = await User.findAll({ where: { id: ids } });
    if (!invitedUsers) throw new Error('cannot find invited user(s)');

    const invitedGuests = await event.addInvitedGuests(invitedUsers);
    for (let user of invitedUsers) {
      await user.addReceivedInviteEvents(event);
    }
    res.status(200).send({ invitedGuests, event });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

async function getNearbyEvents(
  req: IUserRequest,
  res: Response
): Promise<void> {
  try {
    const allEvents = await Event.findAll({
      include: User,
    });
    res.status(200).send(allEvents);
  } catch (error) {
    res
      .status(401)
      .send({ error: error.message, msg: 'Cannot get nearby events' });
  }
}

async function getEventDetails(
  req: IUserRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.params['eventId']) throw new Error('EventId not pased || NaN');
    const event = await Event.findOne({
      where: { id: req.params['eventId'] },
      include: [
        {
          model: User,
          as: 'receivedRequestsGuests',
          attributes: ['id', 'username', 'profilePic'],
          through: { attributes: [] },
        },
        {
          model: User,
          as: 'invitedGuests',
          attributes: ['id', 'username', 'profilePic'],
          through: { attributes: [] },
        },
        {
          model: User,
          as: 'attendingGuests',
          attributes: ['id', 'username', 'profilePic'],
          through: { attributes: [] },
        },
      ],
    });
    if (!event) throw new Error('can not find event');

    const eventComplete: any = event?.get();
    const numberOfAttendees = eventComplete.attendingGuests.length;

    const adminUser = await User.findOne({
      where: { id: event.createdBy },
      attributes: ['id', 'username', 'profilePic'],
    });

    res
      .status(200)
      .send({ ...event.get(), createdBy: adminUser, numberOfAttendees });
  } catch (error) {
    res
      .status(401)
      .send({ error: error.message, msg: 'Cannot get event details' });
  }
}

async function updateEvent(req: Request, res: Response): Promise<void> {
  try {
    //TODO: to get event details from body and update in DB
  } catch (error) {
    res.status(401).send({ error: error.message, msg: 'Can not update event' });
  }
}

async function deleteEvent(req: Request, res: Response): Promise<void> {
  try {
    const { eventId } = req.params;
    await Event.destroy({ where: { id: eventId } });
    res.status(200).send('Event deleted');
  } catch (error) {
    res.status(401).send({ error: error.message, msg: 'Cannot delete event' });
  }
}

export {
  createEvent,
  getNearbyEvents,
  inviteUsers,
  acceptUserRequest,
  joinEvent,
  acceptEventInvite,
  requestEvent,
  getEventDetails,
  updateEvent,
  deleteEvent,
};
