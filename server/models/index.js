const { Sequelize } = require('sequelize');
const MasterModel = require('./master');
const TaskModel = require('./task');

const sequelize = new Sequelize(
  process.env.MYSQL_DB || 'ip_manager_db',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASS || '',
  {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    dialect: 'mysql',
    logging: false
  }
);

const Master = MasterModel(sequelize);
const Task = TaskModel(sequelize);

// Associations
Master.hasMany(Task, { foreignKey: 'masterId', sourceKey: '_id', onDelete: 'CASCADE' });
Task.belongsTo(Master, { foreignKey: 'masterId', targetKey: '_id' });

module.exports = { sequelize, Master, Task };
