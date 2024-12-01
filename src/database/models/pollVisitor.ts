export default function (sequelize: any, DataTypes: any) {
    const PollVisitor = sequelize.define(
        "pollVisitor",
        {
            visitorId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            ipAddress: {
                type: DataTypes.INET,
                allowNull: false,
            },
            count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            }
        },
        {
            timestamps: true,
            indexes: [{ fields: ["ipAddress"] }],
        }
    );

    PollVisitor.associate = (models: any) => {
        PollVisitor.belongsTo(models.poll, { foreignKey: "pollId" });
        PollVisitor.hasOne(models.geolocationData, { foreignKey: "visitorId", as: "geolocationData" });
    };

    return PollVisitor;
}
