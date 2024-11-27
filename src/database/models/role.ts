

export default function (sequelize: any, DataTypes: any) {
    const Role = sequelize.define(
        "role",
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
        },
        {
            timestamps: true,
            indexes: [{ unique: true, fields: ["name"] }],
        }
    );

    Role.associate = function (models: any) {
        Role.hasMany(models.user, {
            foreignKey: "roleId",
        });
    };

    return Role;
};