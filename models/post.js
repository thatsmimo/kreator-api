module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('posts', {
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    isSell: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
  }, {
    
  });
  Post.associate = function(models) {
    Post.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    Post.hasMany(models.postAttachment, {
      foreignKey: 'postId',
    })
    Post.hasMany(models.postLike, {
      foreignKey: 'postId',
      as : 'selfLike'
    }),
    Post.hasMany(models.postLike, {
      foreignKey: 'postId',
      as : 'totalLike'
    }),
    Post.hasMany(models.postComment, {
      foreignKey: 'postId',
    })
  };
  return Post;
};