

import sequelize from "../config/db.js";

import User from "./userModel.js";

import Message from "./messageModel.js";


  User.hasMany(Message, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Message.belongsTo(User, { foreignKey: 'userId' });


export { sequelize, User, Message}
