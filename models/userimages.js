'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserImages = sequelize.define('UserImages', {
    name: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  UserImages.associate = function(models) {
    // associations can be defined here
  };
  return UserImages;
};