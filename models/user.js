'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    profileImage: DataTypes.INTEGER,
  }, {
    
  });
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.UserImages);
  };
  return User;
};