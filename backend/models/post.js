module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
    });
  
    return Post;
  }; 