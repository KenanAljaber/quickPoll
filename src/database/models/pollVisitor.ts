export default function (sequelize: any, DataTypes: any) {
    const PollVisitor = sequelize.define(
        "pollVisitor",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            visitorId: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
            },
            pollId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            ipAddress: {
                type: DataTypes.INET,
                allowNull: false,
            },
            count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            timestamps: true,
            indexes: [
                {
                    fields: ["visitorId", "pollId"],
                    unique: true, 
                },
            ],
        }
    );

    PollVisitor.associate = (models: any) => {
        PollVisitor.belongsTo(models.poll, { foreignKey: "pollId" });

    };

    return PollVisitor;
}
