import {
  DataTypes,
  Model,
  Association,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  Optional,
} from 'sequelize';
import sequelize from '../db/db';
import User from './user.model';
import Message from './message.model';

interface ChatAtt {
  id: number;
}

interface ChatAttOpt extends Optional<ChatAtt, 'id'> {}

class Chat extends Model<ChatAtt, ChatAttOpt> implements ChatAtt {
  public id!: number;
  public userChats?: number;

  public addMessage!: HasManyAddAssociationMixin<Message, number>;
  public createMessage!: HasManyCreateAssociationMixin<Message>;

  public addUser!: HasManyAddAssociationMixin<User, number>;

  public readonly messages?: Message[];
  public readonly users?: User[];

  public static override associations: {
    messages: Association<Chat, Message>;
    users: Association<Chat, User>;
  };
}

Chat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: 'chats',
    sequelize,
  }
);

export default Chat;
