const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return TodoLists.init(sequelize, DataTypes);
}

class TodoLists extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('TodoLists', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: "TodoLists_username_key"
    }
  }, {
    tableName: 'TodoLists',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "TodoLists_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "TodoLists_username_key",
        unique: true,
        fields: [
          { name: "username" },
        ]
      },
    ]
  });
  }
}
