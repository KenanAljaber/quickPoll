export default function (sequelize: any, DataTypes: any) {
    const Feedback = sequelize.define(
        "feedback",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            archived: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            timestamps: true,
        }
    );

    Feedback.associate = function (models: any) {
        Feedback.belongsTo(models.user, {
            foreignKey: "userId",
        });
    }; 

    return Feedback;

}