export default function (sequelize: any, DataTypes: any) {
  const Poll = sequelize.define(
    "poll",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      requiredInfo: {
        type: DataTypes.ENUM("NAME", "EMAIL", "NONE", "BOTH"),
        allowNull: false,
        defaultValue: "NONE",
      },
      createdByType: {
        type: DataTypes.ENUM("Guest", "User"),
        allowNull: false,
      },
      createdById: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      state: {
        type: DataTypes.ENUM("OPEN", "CLOSED"),
        allowNull: false,
      },
      multiAnswer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      imageURL: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      indexes: [{ fields: ["title"] }, ],
    }
  );

  Poll.associate = function (models: any) {
    Poll.belongsToMany(models.user, {
      through: "userPollOwnership",
      foreignKey: "pollId",
      as: "owners",
    });
    Poll.belongsToMany(models.user, {
      through: "pollParticipants",
      foreignKey: "pollId",
      otherKey: "participantId",
      scope: { participantType: "User" },
      as: "userParticipants",
    });
    Poll.belongsToMany(models.guest, {
      through: "pollParticipants",
      foreignKey: "pollId",
      otherKey: "participantId",
      scope: { participantType: "Guest" },
      as: "guestParticipants",
    });
    Poll.hasMany(models.vote, {
      foreignKey: "pollId",
    });
    Poll.hasMany(models.option, {
      foreignKey: "pollId",
    });
    Poll.belongsTo(models.guest, {
      foreignKey: "createdById",
      constraints: false,
      scope: { createdByType: "Guest" },
    });
    Poll.belongsTo(models.user, {
      foreignKey: "createdById",
      constraints: false,
      scope: { createdByType: "User" },
    });
  };

  return Poll;
}
