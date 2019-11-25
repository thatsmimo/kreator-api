'use strict';
module.exports = (sequelize, DataTypes) => {
  const educations = sequelize.define('educations', {
    UserId: DataTypes.INTEGER,
    institution: DataTypes.STRING,
    course : DataTypes.STRING,
    completed : DataTypes.DATE
  }, {});
  educations.associate = function(models) {
    // associations can be defined here
  };
  return educations;
};