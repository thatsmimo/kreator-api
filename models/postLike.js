module.exports = (sequelize, DataTypes) => {
  const postLike = sequelize.define('postLike', {
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
  }, {
    
  });
  postLike.associate = function(models) {
    postLike.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return postLike;
};