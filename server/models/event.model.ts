import {
  DataTypes,
  Model,
  Association,
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  Optional,
} from 'sequelize';
import sequelize from '../db/db';
import User from './user.model';

interface EventAtt {
  id: number;
  eventName: string;
  createdBy: number;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  typeOfNight: string;
  photoUrl: string;
  type: string;
  isOpen: boolean;
  googlePlaceId: string;
  placeName: string;
  openTime: string;
  closeTime: string;
}

interface EventAttOpt extends Optional<EventAtt, 'id'> {}

class Event extends Model<EventAtt, EventAttOpt> implements EventAtt {
  public id!: number;
  public eventName!: string;
  public createdBy!: number;
  public description!: string;
  public latitude!: number;
  public longitude!: number;
  public address!: string;
  public typeOfNight!: string;
  public photoUrl!: string;
  public type!: string;
  public isOpen!: boolean;
  public googlePlaceId!: string;
  public placeName!: string;
  public openTime!: string;
  public closeTime!: string;

  public addInvitedGuests!: BelongsToManyAddAssociationMixin<User[], number[]>;
  public removeInvitedGuests!: BelongsToManyRemoveAssociationMixin<
    User,
    number
  >;
  public addReceivedRequestsGuests!: BelongsToManyAddAssociationMixin<
    User,
    number
  >;
  public removeReceivedRequestsGuests!: BelongsToManyRemoveAssociationMixin<
    User,
    number
  >;

  public addAttendingGuests!: BelongsToManyAddAssociationMixin<User, number>;

  public invitedGuests?: User[];
  public receivedRequestsGuests?: User[];
  public attendingGuests?: User[];

  public static override associations: {
    invitedGuests: Association<Event, User>;
    receivedRequestsGuests: Association<Event, User>;
    attendingGuests: Association<Event, User>;
  };
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeOfNight: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    photoUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    googlePlaceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    placeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    openTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    closeTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'events',
    sequelize,
  }
);

export default Event;
