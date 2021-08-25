import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';

interface MessageAtt {
  id: number;
  chatId: number;
  content: string;
  senderId: number;
}

interface MessageAttOpt extends Optional<MessageAtt, 'id'> {}

class Message extends Model<MessageAtt, MessageAttOpt> implements MessageAtt {
  public id!: number;
  public chatId!: number;
  public content!: string;
  public senderId!: number;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'messages',
    sequelize,
    updatedAt: false,
  }
);

export default Message;
