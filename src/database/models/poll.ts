import { on } from "events";
import { PollState } from "../DTO/iPollDTOs";

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
      state: {
        type: DataTypes.ENUM(PollState.OPEN, PollState.CLOSED),
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
      indexes: [{ fields: ["title"] },{ fields: ["createdByGuestId"] },{ fields: ["createdByUserId"] }],
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

    //view relations
    Poll.hasOne(models.pollView, {
      foreignKey: "pollId",
      as: "views",
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
      as: "options",
    });

    //configuration relations
    Poll.hasOne(models.pollConfiguration, {
      foreignKey: "pollId",
      onDelete: "CASCADE",
      as: "configuration",
    });

    //security relations
    Poll.hasOne(models.anonymousPollSecurity, {
      foreignKey: "pollId",
      onDelete: "CASCADE",
      as: "security",
    });

  };

  return Poll;
}
