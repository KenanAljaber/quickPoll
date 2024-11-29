import { on } from "events";

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
        allowNull: true,
      },
      requiredInfo: {
        type: DataTypes.ENUM("NAME", "EMAIL", "NONE", "BOTH"),
        allowNull: false,
        defaultValue: "NONE",
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
        allowNull: true,
      },
    },
    {
      timestamps: true,
      indexes: [{ fields: ["title"] },{ fields: ["createdByGuestId"] },{ fields: ["requiredInfo"] } ],
    }
  );

  Poll.associate = function (models: any) {
    //creation relations
    Poll.belongsTo(models.user, {
      foreignKey: "createdByUserId",
      as: "ownerUser",
    });
    Poll.belongsTo(models.guest, {
      foreignKey: "createdByGuestId",
      as: "ownerGuest",
    });

    //participation relations
    Poll.belongsToMany(models.user, {
      through: "pollParticipants",
      foreignKey: "pollId",
      otherKey: "userParticipantId",
      as: "userParticipants",
    });
    Poll.belongsToMany(models.guest, {
      through: "pollParticipants",
      foreignKey: "pollId",
      otherKey: "guestParticipantId",
      as: "guestParticipants",
    });

    //votes and options relations
    Poll.hasMany(models.vote, {
      foreignKey: "pollId",
    });
    Poll.hasMany(models.option, {
      foreignKey: "pollId",
      onDelete: "CASCADE",
    });

  };

  return Poll;
}
