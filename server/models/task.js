const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Task', {
    _id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    complexity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    masterId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'tasks',
    timestamps: true
  });
};
