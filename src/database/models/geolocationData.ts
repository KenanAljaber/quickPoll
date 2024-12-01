import { time } from "console";

export default function (sequelize: any, DataTypes: any) {
    const GeolocationData = sequelize.define(
        "geolocationData",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            ipAddress: {
                type: DataTypes.INET,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            countryCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            region: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            timezone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            timestamps: true,
            indexes: [{ fields: ["ipAddress"] }],
        }
    );

    GeolocationData.associate = (models: any) => {
        GeolocationData.belongsTo(models.user,
            {
                as: "user",
                allowNull: true
            }
        );
        GeolocationData.belongsTo(models.guest,
            {
                as: "guest",
                allowNull: true
            }
        );
        GeolocationData.belongsTo(models.vote,
            {
                as: "vote",
                allowNull: true
            }
        );
    };

    return GeolocationData;
}