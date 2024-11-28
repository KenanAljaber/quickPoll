export default function (sequelize: any, DataTypes: any) {
  const pollParticipants = sequelize.define(
    "pollParticipants",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      participantType: {
        type: DataTypes.ENUM("Guest", "User"),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      indexes: [{ unique: true, fields: ["pollId", "participantId"] }],
    }
  );

  pollParticipants.associate = function (models: any) {
    pollParticipants.belongsTo(models.poll, {
      foreignKey: "pollId",
    });
    pollParticipants.belongsTo(models.user, {
      foreignKey: "participantId",
      constraints: false,
      scope: { participantType: "User" },
    });
    pollParticipants.belongsTo(models.guest, {
      foreignKey: "participantId",
      constraints: false,
      scope: { participantType: "Guest" },
    });
    pollParticipants.belongsTo(models.vote, {
      foreignKey: "voteId",
      as: "vote",
    });
  };

  return pollParticipants;
}
