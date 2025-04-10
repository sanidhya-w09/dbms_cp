module.exports = (sequelize, Sequelize) => {
  const Seller = sequelize.define("seller", {
    sid: {
      type: Sequelize.STRING(15),
      primaryKey: true,
      allowNull: false
    },
    sname: {
      type: Sequelize.STRING(20)
    },
    pass: {
      type: Sequelize.STRING(60) // Increased length for bcrypt hashed passwords
    },
    address: {
      type: Sequelize.STRING(128)
    },
    phno: {
      type: Sequelize.BIGINT
    }
  }, {
    timestamps: false, // Disable createdAt and updatedAt fields
    tableName: 'seller' // Ensure the table name matches exactly
  });

  return Seller;
};