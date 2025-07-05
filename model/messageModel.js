

import sequelize from "../config/db.js";
import User from "./userModel.js";
import { DataTypes } from "sequelize";

const Message = sequelize.define('Message', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  clientOffset: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true // optional if fallback is used
  },

  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
});

export default Message;

