export default function (sequelize: any, DataTypes: any) {
    const UserPlan = sequelize.define(
        "userPlan",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            }

        },
        {
            timestamps: true,
            indexes: [{ unique: true, fields: ["userId", "isActive"] }],
        }
    );

    UserPlan.associate = function (models: any) {
        UserPlan.belongsTo(models.user, {
            foreignKey: "userId",
        });
        UserPlan.belongsTo(models.plan, {
            foreignKey: "planId",
        });
    };

    return UserPlan;
}