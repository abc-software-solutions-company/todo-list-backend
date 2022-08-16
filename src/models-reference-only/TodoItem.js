const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return TodoItem.init(sequelize, DataTypes);
}

class TodoItem extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('TodoItem', {
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
    },
    TodoListId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'TodoList',
        key: 'id'
      }
    }
  }, {
    tableName: 'TodoItem',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "TodoItem_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
