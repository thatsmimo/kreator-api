module.exports = (sequelize, DataTypes) => {
  const otp = sequelize.define('otp', {
    otp : DataTypes.STRING,
    userId : DataTypes.INTEGER,
  }, {
    
  });
  otp.associate = function(models) {
    otp.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return otp;
};