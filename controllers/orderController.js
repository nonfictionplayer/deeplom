const { Order, OrderItem, Product, Warehouse, Customer, OrderType, Employee } = require('../models/model');

const OrderController = {
  // Получение всех заказов
  async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: [
          { model: OrderItem, include: [{ model: Product }] },
          { model: Warehouse },
          { model: Customer },
          { model: OrderType },
          { model: Employee },
        ],
      });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Получение информации о конкретном заказе
async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, {
        include: [
          { model: OrderItem, include: [{ model: Product }] },
          { model: Warehouse },
          { model: Customer },
          { model: OrderType },
          { model: Employee },
        ],
      });
  
      if (!order) {
        return res.status(404).json({ message: 'Заказ не найден' });
      }
  
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Создание нового заказа
  async createOrder(req, res) {
    try {
      const { name, regionDelivery, deliveryPrice, orderDate, deliveryDate, status, customerId, warehouseId,employeeId, orderTypeId, orderItems } = req.body;
      
      // Получаем информацию о продуктах в заказе
      const products = await Promise.all(
        orderItems.map(async (item) => {
          const product = await Product.findByPk(item.productId);
          return { ...product.toJSON(), count: item.count };
        })
      );
      
        // Вычисляем общее количество и стоимость заказа
      const count = orderItems.reduce((total, item) => total + item.count, 0);
      const price = products.reduce((total, item) => total + (item.count * item.price), 0);

      const order = await Order.create({
        name,
        regionDelivery,
        deliveryPrice,
        orderDate,
        deliveryDate,
        count,
        price,
        status,
        customerId,
        warehouseId,
        orderTypeId,
        employeeId,
      });

      await Promise.all(
        orderItems.map((item) =>
          OrderItem.create({
            count: item.count,
            productId: item.productId,
            orderId: order.id,
          })
        )
      );

      res.status(201).json(order);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Обновление заказа
  async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const { name, regionDelivery, deliveryPrice, orderDate, deliveryDate, count, price, status, customerId, warehouseId,employeeId, orderTypeId } = req.body;
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ message: 'Заказ не найден' });
      }
      await order.update({
        name,
        regionDelivery,
        deliveryPrice,
        orderDate,
        deliveryDate,
        count,
        price,
        status,
        customerId,
        warehouseId,
        orderTypeId,
        employeeId,
      });
      res.json(order);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Удаление заказа
  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ message: 'Заказ не найден' });
      }
      await order.destroy();
      res.json({ message: 'Заказ удален' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = OrderController;