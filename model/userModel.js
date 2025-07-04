
import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";


const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'offline',
  },
});

export default User;