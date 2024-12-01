export default function (sequelize: any, DataTypes: any) {
    const Plan = sequelize.define(
        "plan",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('MONTHLY', 'YEARLY'),
                allowNull: false,
            },
        },
        {
            timestamps: true,
            indexes: [{ unique: true, fields: ["name"] }, { fields: ["type"] }],
        }
    );

    Plan.associate = function (models: any) {
        Plan.hasMany(models.userPlan, {
            foreignKey: "planId",
        });
    };


    return Plan;
}