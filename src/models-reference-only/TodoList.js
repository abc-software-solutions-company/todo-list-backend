const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return TodoList.init(sequelize, DataTypes);
}

class TodoList extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('TodoList', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    listName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    tableName: 'TodoList',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "TodoList_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
