const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Roles.init(sequelize, DataTypes);
}

class Roles extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('Roles', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    role: {
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
    tableName: 'Roles',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "Roles_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
