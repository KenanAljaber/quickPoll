export default function (sequelize: any, DataTypes: any) {
  const Guest = sequelize.define(
    "guest",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      timestamps: true,
    }
  );

  Guest.associate = function (models: any) {
    Guest.belongsTo(models.user, {
      foreignKey: "userId",
      allowNull: true,
    });

    Guest.hasMany(models.poll, {
      foreignKey: "createdById",
      scope: { createdByType: "Guest" },
      allowNull: true,
    });

    Guest.belongsToMany(models.poll, {
      through: "pollParticipants",
      foreignKey: "participantId",
      otherKey: "pollId",
      scope: { participantType: "Guest" },
    });
  };

  return Guest;
}
