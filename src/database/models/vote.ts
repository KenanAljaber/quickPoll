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
      createdByType: {
        type: DataTypes.ENUM("Guest", "User"),
        allowNull: false,
      },
      createdById: {
        type: DataTypes.UUID,
        allowNull: false,
      },

    },
    {
      timestamps: true,
      indexes: [{ unique: true, fields: ["pollId", "createdById"] }],
    }
  );

  Vote.associate = function (models: any) {
    Vote.belongsTo(models.poll, {
      foreignKey: "pollId",
      as: "poll",
    });
    Vote.belongsTo(models.user, {
      foreignKey: "createdById",
      constraints: false,
      scope: { createdByType: "User" },
    });
    Vote.belongsTo(models.guest, {
      foreignKey: "createdById",
      constraints: false,
      scope: { createdByType: "Guest" },
    });
    Vote.belongsToMany(models.option, {
      through: "optionVotes",
      foreignKey: "voteId",
      as: "options",
    });

  };

  return Vote;
}
