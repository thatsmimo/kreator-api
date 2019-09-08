'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    active: DataTypes.INTEGER,
    profileImage: DataTypes.INTEGER,
    address:DataTypes.STRING,
    email:DataTypes.STRING,
  }, {
    
  });
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.UserImages);
  };
  return User;
};