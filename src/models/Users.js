import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Users extends Model {
    // static associate(models) {
    //   Users.RefreshToken = Users.hasOne(models.RefreshToken);
    //   Users.Roles = Users.hasMany(models.Role);
    // }

    static async testLoadModel() {
      console.log('Users model load successfully');
    }

    static async createNewUser ({
      username
    }) {
      return sequelize.transaction(() => {

        return Users.create(
          {
            username
          }
        );
      });
    }
  }

  Users.init(
    {
      username: {
        type: DataTypes.STRING(50),
        unique: true,
        validate: {
          len: {
            args: [2, 50],
            msg: 'Username must contain between 2 and 50 characters',
          },
        },
      },

    },
    {
      sequelize,
      updatedAt:false,
      modelName: 'Users'
    }
  );

  Users.beforeSave(async (user, options) => {
    console.log('Keep this beforeSave function for future usecase');
  });

  Users.afterCreate((user, options) => {
    console.log('Keep this afterCreate function for future usecase');
  });

  return Users;
};
