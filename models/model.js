const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Warehouse = sequelize.define('warehouse', {
    id : {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    address: {type: DataTypes.STRING, unique: true, allowNull: false },
    reservCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        get() {
          return this.getDataValue('reservCount');
        },
        set(value) {
          this.setDataValue('reservCount', value);
        }
      },
      reservPrice: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0.00,
        get() {
          return this.getDataValue('reservPrice');
        },
        set(value) {
          this.setDataValue('reservPrice', value);
        }
      }
},{
    hooks: {
        beforeUpdate: async (warehouse, options) => {
          // Получаем все связанные продукты
          const products = await warehouse.getProducts();
    
          // Рассчитываем общее количество и суммарную стоимость
          let totalCount = 0;
          let totalPrice = 0;
          products.forEach(product => {
            totalCount += product.count;
            totalPrice += product.count * product.price;
          });
    
          // Обновляем reservCount и reservPrice
          warehouse.reservCount = totalCount;
          warehouse.reservPrice = totalPrice;
        }
    }
})

const Product = sequelize.define('product',{
    id : {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true,  allowNull: false},
    description: {type: DataTypes.STRING,  allowNull: false},
    count: {type: DataTypes.INTEGER, allowNull: false},
    price: {type: DataTypes.DOUBLE,  allowNull: false},
},{
    hooks: {
        afterCreate: async (product, options) => {
            // Получаем склад, к которому относится этот продукт
            const warehouse = await Warehouse.findByPk(product.warehouseId);
      
            // Обновляем склад
            await warehouse.save();
          },
          afterUpdate: async (product, options) => {
            // Получаем склад, к которому относится этот продукт
            const warehouse = await Warehouse.findByPk(product.warehouseId);
      
            // Обновляем склад
            await warehouse.save();
          }
    }
})

const Shipment = sequelize.define('shipment', {
    id : {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true,  allowNull: false},
    date :{type:DataTypes.DATEONLY, allowNull: false},
    count :{type: DataTypes.INTEGER, allowNull: false},
    price: {type: DataTypes.DOUBLE, allowNull: false},
    status: {type: DataTypes.ENUM('created', 'expected', 'completed'), defaultValue: 'created'},
},{
    hooks: {
        afterUpdate: async (shipment, options) => {
            if (shipment.status === 'completed' && shipment.previousStatus !== 'completed') {
              // Получаем связанные ShipmentItem объекты
              const shipmentItems = await shipment.getShipmentItems();
      
              for (const item of shipmentItems) {
                const product = await Product.findByPk(item.productId);
                product.count += item.count;
                await product.save();
      
                // Получаем склад, к которому относится этот продукт
                const warehouse = await Warehouse.findByPk(product.warehouseId);
                await warehouse.update({
                  reservCount: warehouse.reservCount + item.count,
                  reservPrice: warehouse.reservPrice + (item.count * product.price)
                });
                await warehouse.save();
              }
            }
        }
    }
})

const Order = sequelize.define('order',{
    id : {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true,  allowNull: false},
    regionDelivery: {type: DataTypes.STRING, allowNull: false},
    deliveryPrice: {type: DataTypes.DOUBLE, allowNull: false},
    orderDate:{type: DataTypes.DATEONLY, allowNull: false},
    deliveryDate: {type: DataTypes.DATEONLY, allowNull: false},
    count: {type:DataTypes.INTEGER, allowNull: false},
    price: {type:DataTypes.DOUBLE, allowNull: false},
    status: {type: DataTypes.ENUM('created', 'delivering', 'completed', 'cancelled'), defaultValue: 'created'},
},{
    hooks: {
        afterUpdate: async (order, options) => {
          // Если статус был изменен на "cancelled"
          if (order.status === 'cancelled' && order.previousStatus !== 'cancelled') {
            const orderItems = await order.getOrderItems();
    
            for (const item of orderItems) {
              const product = await Product.findByPk(item.productId);
              product.count += item.count;
              await product.save();
    
              const warehouse = await Warehouse.findByPk(product.warehouseId);
              await warehouse.update({
                reservCount: warehouse.reservCount + item.count,
                reservPrice: warehouse.reservPrice + (item.count * product.price)
              });
              await warehouse.save();
            }
          }
        }
      }
})

const Customer = sequelize.define('customer',{
    id : {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true,  allowNull: false},
    address: {type: DataTypes.STRING, unique: true,  allowNull: false},
    phone: {type: DataTypes.INTEGER, unique: true},
})

const OrderType = sequelize.define('orderType',{
    id : {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true,  allowNull: false},
    description: {type: DataTypes.STRING,  allowNull: false},
})

const ShipmentItem = sequelize.define('shipmentItem', {
    id : {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    count: {type:DataTypes.INTEGER, allowNull: false},
})

const OrderItem = sequelize.define('orderItem', {
    id : {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    count: {type:DataTypes.INTEGER, allowNull: false},
},{
    hooks: {
        afterCreate: async (orderItem, options) => {
          const product = await Product.findByPk(orderItem.productId);
          product.count -= orderItem.count;
          await product.save();
    
          const warehouse = await Warehouse.findByPk(product.warehouseId);
          await warehouse.update({
            reservCount: warehouse.reservCount - orderItem.count,
            reservPrice: warehouse.reservPrice - (orderItem.count * product.price)
          });
          await warehouse.save();
        }
    }
})

const Employee = sequelize.define('employee',{
  id : {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  login: {type: DataTypes.STRING, unique: true},
  phone: {type: DataTypes.INTEGER, unique: true},
  name: {type: DataTypes.STRING, unique: true},
  password: {type: DataTypes.STRING},
  role: {type: DataTypes.ENUM('manager', 'worker','admin'), defaultValue: 'worker'},
})

sequelize.sync({ alter: true })
  .then(() => {
    console.log('База данных успешно обновлена!');
  })
  .catch((error) => {
    console.error('Ошибка при обновлении базы данных:', error);
  });

Warehouse.hasMany(Shipment)
Shipment.belongsTo(Warehouse)

Warehouse.hasMany(Product)
Product.belongsTo(Warehouse)

Warehouse.hasMany(Order)
Order.belongsTo(Warehouse)

Warehouse.hasMany(Employee)
Employee.belongsTo(Warehouse)

Employee.hasMany(Order)
Order.belongsTo(Employee)

Product.hasMany(ShipmentItem)
ShipmentItem.belongsTo(Product)

Shipment.hasMany(ShipmentItem)
ShipmentItem.belongsTo(Shipment)

Product.hasMany(OrderItem)
OrderItem.belongsTo(Product)

Order.hasMany(OrderItem)
OrderItem.belongsTo(Order)

Customer.hasOne(Order)
Order.belongsTo(Customer)

OrderType.hasOne(Order)
Order.belongsTo(OrderType)

module.exports = {
    Warehouse,
    Shipment,
    Product,
    Order,
    Customer,
    OrderType,
    OrderItem,
    ShipmentItem,
    Employee,
}