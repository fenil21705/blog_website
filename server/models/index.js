const sequelize = require('../config/db');
const User = require('./User');
const Blog = require('./Blog');
const Category = require('./Category');
const Comment = require('./Comment');
const Like = require('./Like');

// Associations
User.hasMany(Blog, { foreignKey: 'authorId' });
Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Category.hasMany(Blog, { foreignKey: 'categoryId' });
Blog.belongsTo(Category, { foreignKey: 'categoryId', as: 'categoryData' });

// Comment Associations
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Blog.hasMany(Comment, { foreignKey: 'blogId' });
Comment.belongsTo(Blog, { foreignKey: 'blogId' });

// Like Associations
User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { foreignKey: 'userId' });

Blog.hasMany(Like, { foreignKey: 'blogId' });
Like.belongsTo(Blog, { foreignKey: 'blogId' });

module.exports = {
    sequelize,
    User,
    Blog,
    Category,
    Comment,
    Like,
};

