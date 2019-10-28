module.exports = (sequelize, DataTypes) => {
  const PostAttachment = sequelize.define('postAttachment', {
    filename: DataTypes.STRING,
    type: DataTypes.STRING,
    postId: DataTypes.INTEGER,
  }, {
    
  });
  return PostAttachment;
};