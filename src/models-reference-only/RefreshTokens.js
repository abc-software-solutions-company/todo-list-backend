const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return RefreshTokens.init(sequelize, DataTypes);
}

class RefreshTokens extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('RefreshTokens', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: DataTypes.TEXT,
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
    tableName: 'RefreshTokens',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "RefreshTokens_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
