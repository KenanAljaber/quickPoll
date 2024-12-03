export default function (sequelize: any, DataTypes: any) {
    const AnonymousPollSecurity = sequelize.define(
        "anonymousPollSecurity",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            nickname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            timestamps: true,
            indexes: [{ unique: true, fields: ["pollId", "nickname"] }],
        }
    );

    AnonymousPollSecurity.associate = function (models: any) {
        AnonymousPollSecurity.belongsTo(models.poll, { foreignKey: "pollId", as: "poll", onDelete: "CASCADE" });
    };

    return AnonymousPollSecurity;
}