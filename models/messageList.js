module.exports = (sequelize, DataTypes) => {
  const MessageList = sequelize.define('messageList', {
    userId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    lastMessage: DataTypes.STRING,
  }, {
    
  });
  MessageList.associate = function(models) {
    // associations can be defined here
    MessageList.belongsTo(models.User, {
      as : 'User',
      foreignKey: 'userId',
    });
    MessageList.belongsTo(models.User, {
      as : 'Receiver',
      foreignKey: 'receiverId',
    });
  };
  return MessageList;
};