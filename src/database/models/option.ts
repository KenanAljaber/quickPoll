export default function (sequelize: any, DataTypes: any) {
  const Option = sequelize.define(
    "option",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      indexes: [{ unique: true, fields: ["pollId", "order"] }],
    }
  );

  Option.associate = function (models: any) {
    Option.belongsTo(models.poll, {
      foreignKey: "pollId",
      onDelete: "CASCADE",
    });
    Option.belongsToMany(models.vote, {
      through: "optionVotes",
      foreignKey: "optionId",
    });
  };

  return Option;
}
