import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';

interface UserFriendAtt {
  id: number;
  senderId: number;
  receiverId: number;
}

interface UserFriendAttOpt extends Optional<UserFriendAtt, 'id'> {}

class UserFriend
  extends Model<UserFriendAtt, UserFriendAttOpt>
  implements UserFriendAtt
{
  public id!: number;
  public senderId!: number;
  public receiverId!: number;
}

UserFriend.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'userFriends',
    sequelize,
  }
);

export default UserFriend;
