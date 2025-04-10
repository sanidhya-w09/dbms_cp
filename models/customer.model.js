module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customer", {
    uid: {
      type: Sequelize.STRING(15), // Changed from 20 to 15 to match orders table
      primaryKey: true,
      allowNull: false
    },
    pass: {
      type: Sequelize.STRING(60) // Increased length for bcrypt hashed passwords
    },
    fname: {
      type: Sequelize.STRING(15)
    },
    lname: {
      type: Sequelize.STRING(15)
    },
    email: {
      type: Sequelize.STRING(30)
    },
    address: {
      type: Sequelize.STRING(128)
    },
    phno: {
      type: Sequelize.BIGINT
    }
  }, {
    timestamps: false, // Disable createdAt and updatedAt fields
    tableName: 'customer' // Ensure the table name matches exactly
  });

  return Customer;
};