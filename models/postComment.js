module.exports = (sequelize, DataTypes) => {
  const postComment = sequelize.define('postComment', {
    userId : DataTypes.INTEGER,
    postId : DataTypes.INTEGER,
    comment : DataTypes.STRING
  }, {
    
  });

  postComment.associate = function(models) {
    postComment.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return postComment;
};