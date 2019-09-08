module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('posts', {
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    isSell: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
  }, {
    
  });
  // Post.associate = function(models) {
  //   // associations can be defined here
  //   Post.belongsTo(models.User, {
  //     foreignKey: 'userId',
  //   });
  // };
  return Post;
};