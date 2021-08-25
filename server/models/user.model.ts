import {
  DataTypes,
  Model,
  Association,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  Optional,
  HasManyAddAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
} from 'sequelize';
import sequelize from '../db/db';
import Chat from './chat.model';
import UserFriends from './userFriends.model';
import Event from './event.model';

interface UserAtt {
  id: number;
  username: string;
  email: string;
  password: string;
  profilePic: string;
  DOB: Date;
  gender: string;
  typeOfNight: string;
  bio: string;
  longitude: number;
  latitude: number;
}
interface UserAttOpt extends Optional<UserAtt, 'id'> {}

class User extends Model<UserAtt, UserAttOpt> implements UserAtt {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public profilePic!: string;
  public DOB!: Date;
  public gender!: string;
  public typeOfNight!: string;
  public bio!: string;
  public longitude!: number;
  public latitude!: number;
  public userChats?: number;

  public addChat!: HasManyAddAssociationMixin<Chat, number>;
  public createChat!: HasManyCreateAssociationMixin<Chat>;

  public addFriends!: HasManyAddAssociationMixin<User, number>;
  public addSentRequest!: HasManyAddAssociationMixin<User, number>;
  public addReceivedRequest!: HasManyAddAssociationsMixin<User, number>;

  public createEvent!: HasManyAddAssociationMixin<Event, number>;

  public addReceivedInviteEvents!: BelongsToManyAddAssociationMixin<
    Event,
    number
  >;
  public removeReceivedInviteEvents!: BelongsToManyRemoveAssociationMixin<
    Event,
    number
  >;

  public addSentRequestsEvents!: BelongsToManyAddAssociationMixin<
    Event,
    number
  >;
  public removeSentRequestsEvents!: BelongsToManyRemoveAssociationMixin<
    Event,
    number
  >;

  public addNearbyEvents!: BelongsToManyAddAssociationMixin<Event, number>;
  public addAttendingEvents!: BelongsToManyAddAssociationMixin<Event, number>;

  public friends?: User[];
  public sentRequests?: User[];
  public receivedRequests?: User[];

  public createdEvents?: Event[];
  public nearbyEvents?: Event[];
  public attendingEvents?: Event[];
  public receivedInviteEvents?: Event[];
  public sentRequestsEvents?: Event[];

  public chats?: Chat[];

  public static override associations: {
    chats: Association<User, Chat>;
    friends: Association<User, User>;
    sentRequests: Association<User, User>;
    receivedRequests: Association<User, User>;

    createdEvents: Association<User, Event>;
    nearbyEvents: Association<User, Event>;
    receivedInviteEvents: Association<User, Event>;
    sentRequestsEvents: Association<User, Event>;
    attendingEvents: Association<User, Event>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DOB: {
      type: DataTypes.DATE,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePic: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    gender: {
      type: DataTypes.STRING,
    },
    typeOfNight: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'users',
    sequelize,
  }
);

User.belongsToMany(User, {
  through: UserFriends,
  foreignKey: 'receiverId',
  as: 'receivedRequests',
});

User.belongsToMany(User, {
  through: UserFriends,
  foreignKey: 'senderId',
  as: 'sentRequests',
});

User.belongsToMany(User, {
  through: 'confirmedFriends',
  as: 'friends',
});

export default User;
