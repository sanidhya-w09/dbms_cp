module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
    pid: {
      type: Sequelize.STRING(15),
      primaryKey: true,
      allowNull: false
    },
    pname: {
      type: Sequelize.STRING(20),
      unique: true
    },
    manufacturer: {
      type: Sequelize.STRING(20)
    },
    mfg: {
      type: Sequelize.DATEONLY
    },
    exp: {
      type: Sequelize.DATEONLY
    },
    price: {
      type: Sequelize.INTEGER
    }
  }, {
    timestamps: false,
    tableName: 'product'
  });

  return Product;
};