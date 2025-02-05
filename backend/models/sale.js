const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Sale extends Model {
    static associate(models) {
      Sale.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
    }
  }

  Sale.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      soldAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Sale",
      tableName: "Sales",
      timestamps: true,
    }
  );

  return Sale;
};
