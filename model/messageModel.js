
import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Message = sequelize.define('Message', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  clientOffset: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true 
  },

  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
});

export default Message;

