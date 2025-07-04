

import sequelize from "../config/db.js";
import User from "./userModel.js";
import { DataTypes } from "sequelize";

const Message = sequelize.define('Message', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  // ✅ Save the username redundantly for fast access without join
  username: {
    type: DataTypes.STRING,
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

// ✅ Associate Message to User
User.hasMany(Message, { foreignKey: 'userId', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'userId' });

export default Message;





// import sequelize from "../config/db.js";
// import User from "./userModel.js";
// import { DataTypes } from "sequelize";

// const Message = sequelize.define('Message', {
//   content: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//     clientOffset: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: true // optional for now
//   },
//   timestamp: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
// });

// // Optional: associate with User (1-to-many)
// User.hasMany(Message, { foreignKey: 'userId', onDelete: 'CASCADE' });
// Message.belongsTo(User, { foreignKey: 'userId' });

// export default Message;
