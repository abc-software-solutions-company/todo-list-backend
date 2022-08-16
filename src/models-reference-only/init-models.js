const DataTypes = require("sequelize").DataTypes;
const _RefreshTokens = require("./RefreshTokens");
const _Roles = require("./Roles");
const _SequelizeMeta = require("./SequelizeMeta");
const _TodoItem = require("./TodoItem");
const _TodoList = require("./TodoList");
const _TodoLists = require("./TodoLists");
const _Users = require("./Users");

function initModels(sequelize) {
  const RefreshTokens = _RefreshTokens(sequelize, DataTypes);
  const Roles = _Roles(sequelize, DataTypes);
  const SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  const TodoItem = _TodoItem(sequelize, DataTypes);
  const TodoList = _TodoList(sequelize, DataTypes);
  const TodoLists = _TodoLists(sequelize, DataTypes);
  const Users = _Users(sequelize, DataTypes);

  TodoItem.belongsTo(TodoList, { as: "TodoList", foreignKey: "TodoListId"});
  TodoList.hasMany(TodoItem, { as: "TodoItems", foreignKey: "TodoListId"});
  RefreshTokens.belongsTo(Users, { as: "User", foreignKey: "UserId"});
  Users.hasMany(RefreshTokens, { as: "RefreshTokens", foreignKey: "UserId"});
  Roles.belongsTo(Users, { as: "User", foreignKey: "UserId"});
  Users.hasMany(Roles, { as: "Roles", foreignKey: "UserId"});
  TodoItem.belongsTo(Users, { as: "User", foreignKey: "UserId"});
  Users.hasMany(TodoItem, { as: "TodoItems", foreignKey: "UserId"});
  TodoList.belongsTo(Users, { as: "User", foreignKey: "UserId"});
  Users.hasMany(TodoList, { as: "TodoLists", foreignKey: "UserId"});

  return {
    RefreshTokens,
    Roles,
    SequelizeMeta,
    TodoItem,
    TodoList,
    TodoLists,
    Users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
