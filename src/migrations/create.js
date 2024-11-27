const models = require('../../dist/database').default;

(async () => {
    try {
        // Initialize models and get the database object
        const database = await models();

        console.log('Database models loaded successfully:', Object.keys(database));

        // Synchronize the database schema
        await database.sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Error during database synchronization:', error);
        process.exit(1); // Exit with a failure code
    }
})();
