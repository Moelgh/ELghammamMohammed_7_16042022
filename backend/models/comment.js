module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      topicId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      postId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
    });
   
    return Comment;
  };