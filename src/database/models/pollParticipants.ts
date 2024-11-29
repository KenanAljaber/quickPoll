export default function (sequelize: any, DataTypes: any) {
  const pollParticipants = sequelize.define(
    "pollParticipants",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      timestamps: true,
      indexes: [{ unique: true, fields: ["pollId", "userParticipantId"] },
      { unique: true, fields: ["pollId", "guestParticipantId"] }
    ,{ unique: true, fields: ["pollId", "voteId"] }],
    }
  );

  pollParticipants.associate = function (models: any) {
    pollParticipants.belongsTo(models.poll, {
      foreignKey: "pollId",
    });
    pollParticipants.belongsTo(models.user, {
      foreignKey: "userParticipantId",
      constraints: false,
    });
    pollParticipants.belongsTo(models.guest, {
      foreignKey: "guestParticipantId",
      constraints: false,
    });
    pollParticipants.belongsTo(models.vote, {
      foreignKey: "voteId",
      as: "vote",
      allowNull: false,
    });
  };

  return pollParticipants;
}
