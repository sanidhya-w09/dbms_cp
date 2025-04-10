const db = require('./index');

// Function to initialize database tables
const initializeDatabase = async () => {
  try {
    // Sync all models with database
    await db.sequelize.sync();
    console.log("Database synchronized successfully.");
    
    // Check if we need to seed the database with initial data here
    // You can add code to check if tables are empty and insert sample data if needed
    
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
};

module.exports = initializeDatabase;