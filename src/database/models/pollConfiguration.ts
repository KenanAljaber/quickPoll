import { GuestRequiredInfo, } from "../DTO/iPollDTOs";
import { VotesCountType } from "../DTO/iVoteDTOs";

export default function (sequelize: any, DataTypes: any) {
    const PollConfiguration = sequelize.define(
        "pollConfiguration",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            votesCountType: {
                type: DataTypes.ENUM(VotesCountType.BY_VOTE, VotesCountType.BY_PARTICIPANT),
                allowNull: false,
                defaultValue: VotesCountType.BY_VOTE,
            },
            multiAnswer: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            guestCanVote: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            voterCanSeeResults: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            guestRequiredInfo: {
                type: DataTypes.ENUM(GuestRequiredInfo.NONE, GuestRequiredInfo.EMAIL, GuestRequiredInfo.NAME, GuestRequiredInfo.BOTH),
                allowNull: false,
                defaultValue: GuestRequiredInfo.NONE,
            },
            isAnonymous: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

        },
        {
            indexes: [{ unique: true, fields: ["pollId"] },
            { fields: ["pollId", "guestRequiredInfo"] },
            { fields: ["pollId", "guestCanVote"] },
            { fields: ["pollId", "voterCanSeeResults"] },
            { fields: ["pollId", "multiAnswer"] },
            { fields: ["pollId", "votesCountType"] }],
        }
    );

    PollConfiguration.associate = (models: any) => {
        PollConfiguration.belongsTo(models.poll, { foreignKey: "pollId" });
    };

    return PollConfiguration;
}