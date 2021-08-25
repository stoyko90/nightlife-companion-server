import Chat from './chat.model';
import User from './user.model';
import Message from './message.model';
import Event from './event.model';

Chat.belongsToMany(User, {
  through: 'userChats',
});
User.belongsToMany(Chat, {
  through: 'userChats',
});

User.hasMany(Message, {
  foreignKey: 'senderId',
});

Chat.hasMany(Message, {
  foreignKey: 'chatId',
});

User.hasMany(Event, {
  foreignKey: 'createdBy',
});

Event.belongsTo(User, { foreignKey: 'createdBy' });

Event.belongsToMany(User, {
  through: 'receivedGuestsRequest',
  as: 'receivedRequestsGuests',
});

Event.belongsToMany(User, {
  through: 'invitedEventGuests',
  as: 'invitedGuests',
});

Event.belongsToMany(User, {
  through: 'confirmedAttenders',
  as: 'attendingGuests',
});

User.belongsToMany(Event, {
  through: 'eventsSentRequests',
  as: 'sentRequestsEvents',
});

User.belongsToMany(Event, {
  through: 'eventsReceivedInvites',
  as: 'receivedInviteEvents',
});

User.belongsToMany(Event, {
  through: 'eventsAttending',
  as: 'attendingEvents',
});

User.belongsToMany(Event, {
  through: 'eventsAvailable',
  as: 'nearbyEvents',
});

export { Chat, User, Message, Event };
