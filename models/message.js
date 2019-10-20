module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    userId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    messageType : DataTypes.ENUM('message', 'attachment', 'customOffer'),
    attachmentLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    attachmentType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customOfferId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
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
