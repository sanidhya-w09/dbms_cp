module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("orders", {
    oid: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    pid: {
      type: Sequelize.STRING(15),
      allowNull: false
    },
    sid: {
      type: Sequelize.STRING(15),
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER.UNSIGNED
    },
    timestamp: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    timestamps: false,
    tableName: 'orders'
  });

  return Order;
};