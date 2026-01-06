const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Master', {
    _id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    fio: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'masters',
    timestamps: true
  });
};
