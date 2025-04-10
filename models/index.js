const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config.js');

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  logging: false
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.customer = require('./customer.model.js')(sequelize, Sequelize);
db.seller = require('./seller.model.js')(sequelize, Sequelize);
db.product = require('./product.model.js')(sequelize, Sequelize);
db.inventory = require('./inventory.model.js')(sequelize, Sequelize);
db.orders = require('./order.model.js')(sequelize, Sequelize);

// Define relationships (based on your SQL foreign keys)
db.product.hasMany(db.inventory, { foreignKey: 'pid' });
db.inventory.belongsTo(db.product, { foreignKey: 'pid' });

db.seller.hasMany(db.inventory, { foreignKey: 'sid' });
db.inventory.belongsTo(db.seller, { foreignKey: 'sid' });

db.product.hasMany(db.orders, { foreignKey: 'pid' });
db.orders.belongsTo(db.product, { foreignKey: 'pid' });

db.seller.hasMany(db.orders, { foreignKey: 'sid' });
db.orders.belongsTo(db.seller, { foreignKey: 'sid' });

db.customer.hasMany(db.orders, { foreignKey: 'uid' });
db.orders.belongsTo(db.customer, { foreignKey: 'uid' });

module.exports = db;