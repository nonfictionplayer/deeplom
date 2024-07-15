const { OrderType } = require('../models/model');

const OrderTypeController = {
  // Получение всех типов заказов
  async getAllOrderTypes(req, res) {
    try {
      const orderTypes = await OrderType.findAll();
      res.json(orderTypes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Получение информации о конкретном типе заказа
  async getOrderTypeById(req, res) {
    try {
      const { id } = req.params;
      const orderType = await OrderType.findByPk(id);

      if (!orderType) {
        return res.status(404).json({ message: 'Тип заказа не найден' });
      }

      res.json(orderType);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Создание нового типа заказа
  async createOrderType(req, res) {
    try {
      const { name, description } = req.body;
      const orderType = await OrderType.create({
        name,
        description,
      });

      res.status(201).json(orderType);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Обновление типа заказа
  async updateOrderType(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const orderType = await OrderType.findByPk(id);
      if (!orderType) {
        return res.status(404).json({ message: 'Тип заказа не найден' });
      }
      await orderType.update({
        name,
        description,
      });
      res.json(orderType);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Удаление типа заказа
  async deleteOrderType(req, res) {
    try {
      const { id } = req.params;
      const orderType = await OrderType.findByPk(id);
      if (!orderType) {
        return res.status(404).json({ message: 'Тип заказа не найден' });
      }
      await orderType.destroy();
      res.json({ message: 'Тип заказа удален' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = OrderTypeController;