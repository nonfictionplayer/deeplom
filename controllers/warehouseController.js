const { Warehouse, Product } = require('../models/model');

const warehouseController = {
  // Создание нового склада
  async createWarehouse(req, res) {
    try {
      
      const warehouse = await Warehouse.create({ address });
      res.status(201).json(warehouse);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Получение информации о складе
  async getWarehouse(req, res) {
    try {

      const warehouse = await Warehouse.findAll( {
        include: [
          {
            model: Product,
            attributes: ['id', 'name', 'count', 'price'],
          },
        ],
      });
      if (!warehouse) {
        return res.status(404).json({ message: 'Склад не найден' });
      }
      res.json(warehouse);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Обновление информации о складе
  async updateWarehouse(req, res) {
    try {
      const { id } = req.params;
      const { address } = req.body;
      const warehouse = await Warehouse.findByPk(id);
      if (!warehouse) {
        return res.status(404).json({ message: 'Склад не найден' });
      }
      await warehouse.update({ address });
      res.json(warehouse);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Удаление склада
  async deleteWarehouse(req, res) {
    try {
      const { id } = req.params;
      const warehouse = await Warehouse.findByPk(id);
      if (!warehouse) {
        return res.status(404).json({ message: 'Склад не найден' });
      }
      await warehouse.destroy();
      res.json({ message: 'Склад успешно удален' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = warehouseController;