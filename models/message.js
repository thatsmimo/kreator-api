module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    userId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    messageType : DataTypes.ENUM('message', 'attachment', 'customOffer'),
    attachmentLink: DataTypes.STRING,
    attachmeype: DataTypes.STRING,
    customOfferId: DataTypes.INTEGER,
  }, {
    
  });
  Message.associate = function(models) {
    // associations can be defined here
    Message.belongsTo(models.User, {
      as : 'User',
      foreignKey: 'userId',
    });
    Message.belongsTo(models.User, {
      as : 'Receiver',
      foreignKey: 'receiverId',
    });
  };
  return Message;
};