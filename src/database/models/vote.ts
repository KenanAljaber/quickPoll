export default function (sequelize: any, DataTypes: any) {
  const Vote = sequelize.define(
    "vote",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      ipAddress: {
        type: DataTypes.INET,
        allowNull: false,
      },

    },
    {
      timestamps: true,
      indexes: [{ unique: true, fields: ["pollId", "ipAddress", "createdByUserId", "createdByGuestId"] },
      { unique: true, fields: ["pollId", "createdByUserId"] },
      { unique: true, fields: ["pollId", "createdByGuestId"] }],
    }
  );

  Vote.associate = function (models: any) {
    Vote.belongsTo(models.poll, {
      foreignKey: "pollId",
      as: "poll",
    });
    Vote.belongsTo(models.user, {
      foreignKey: "createdByUserId",
      allowNull: true,
    });
    Vote.belongsTo(models.guest, {
      foreignKey: "createdByGuestId",
      allowNull: true,
    });
    Vote.belongsToMany(models.option, {
      through: "optionVotes",
      foreignKey: "voteId",
      as: "options",
    });

  };

  return Vote;
}
