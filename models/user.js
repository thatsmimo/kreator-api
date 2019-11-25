'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    active: DataTypes.INTEGER,
    profileImage: DataTypes.INTEGER,
    address:DataTypes.STRING,
    email:DataTypes.STRING,
    location:DataTypes.STRING,
    title:DataTypes.STRING,
    bio:DataTypes.TEXT,
    website:DataTypes.STRING
  }, {
    
  });
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.UserImages,{
      as : 'Image',
    });
  };
  return User;
};