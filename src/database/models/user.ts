export default (sequelize: any, DataTypes: any) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      photoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
      ],
    }
  );

  User.associate = (models: any) => {
    User.hasMany(models.userPlan, {
      foreignKey: "userId",
    });
    User.belongsTo(models.role, {
      foreignKey: "roleId",
    });
    User.belongsToMany(models.poll, {
      through: "pollParticipants",
      foreignKey: "participantId",
      otherKey: "pollId",
      scope: { participantType: "User" },
    });
    User.belongsToMany(models.poll, {
      through: "userPollOwnership",
      foreignKey: "userId",
    });
  };

  return User;
};
