module.exports = (sequelize, Sequelize) => {
  const Inventory = sequelize.define("inventory", {
    pid: {
      type: Sequelize.STRING(15),
      primaryKey: true,
      allowNull: false
    },
    pname: {
      type: Sequelize.STRING(20)
    },
    quantity: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0
    },
    sid: {
      type: Sequelize.STRING(15),
      primaryKey: true,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'inventory'
  });

  return Inventory;
};