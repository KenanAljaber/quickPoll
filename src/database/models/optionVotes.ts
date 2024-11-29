export default function (sequelize: any, DataTypes: any) {
    const OptionVotes = sequelize.define(
        "optionVotes",
        {
        },
        {
            timestamps: true,
            indexes: [{ unique: true, fields: ["optionId", "voteId"] }],
        }
    );

    OptionVotes.associate = function (models: any) {
        OptionVotes.belongsTo(models.option, {
            foreignKey: "optionId",
        });
        OptionVotes.belongsTo(models.vote, {
            foreignKey: "voteId",
        });
    };

    return OptionVotes;
};