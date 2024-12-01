export default function (sequelize: any, DataTypes: any) {
    const PollView = sequelize.define(
        "pollView",
        {
            pollId: {
                type: DataTypes.UUID, 
                primaryKey: true,      
                allowNull: false,      
            },
            viewCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            timestamps: true,
        }
    );

    PollView.associate = (models: any) => {
        PollView.belongsTo(models.poll, {
            foreignKey: "pollId",
            as: "poll",
        });
    };

    return PollView;
}