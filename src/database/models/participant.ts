export default function (sequelize: any, DataTypes: any) {
  const Participant = sequelize.define(
    "participant",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
    }
  );

  Participant.associate = function (models: any) {
    Participant.belongsTo(models.user, {
      foreignKey: "userId",
      allowNull: true,
    });
  };

  return Participant;
}
