const { Shipment, ShipmentItem, Product, Warehouse } =  require('../models/model');

const ShipmentController = {
  // Получение всех отгрузок
  async getAllShipments(req, res) {
    try {
      const shipments = await Shipment.findAll({
        include: [
          { model: ShipmentItem, include: [{ model: Product }] },
          { model: Warehouse },
        ],
      });
      res.json(shipments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Получение информации о конкретной отгрузке
  async getShipmentById(req, res) {
    try {
      const { id } = req.params;
      const shipment = await Shipment.findByPk(id, {
        include: [
          { model: ShipmentItem, include: [{ model: Product }] },
          { model: Warehouse },
        ],
      });

      if (!shipment) {
        return res.status(404).json({ message: 'Отгрузка не найдена' });
      }

      res.json(shipment);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Создание новой отгрузки
  async createShipment(req, res) {
    try {
      const { name, date, status, warehouseId, shipmentItems } = req.body;
  
      // Получаем информацию о продуктах в отгрузке
      const products = await Promise.all(
        shipmentItems.map(async (item) => {
          const product = await Product.findByPk(item.productId);
          return { ...product.toJSON(), count: item.count };
        })
      );
  
      // Вычисляем общее количество и стоимость отгрузки
      const count = shipmentItems.reduce((total, item) => total + item.count, 0);
      const price = products.reduce((total, item) => total + (item.count * item.price), 0);
  
      const shipment = await Shipment.create({
        name,
        date,
        count,
        price,
        status,
        warehouseId,
      });
  
      await Promise.all(
        shipmentItems.map((item) =>
          ShipmentItem.create({
            count: item.count,
            productId: item.productId,
            shipmentId: shipment.id,
          })
        )
      );
  
      res.status(201).json(shipment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

    // Обновление отгрузки
    async updateShipment(req, res) {
    try {
        const { id } = req.params;
        const { name, date, count, price, status, warehouseId } = req.body;
        const shipment = await Shipment.findByPk(id);
        if (!shipment) {
        return res.status(404).json({ message: 'Отгрузка не найдена' });
        }
        await shipment.update({
        name,
        date,
        count,
        price,
        status,
        warehouseId,
        });
        res.json(shipment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    },

    // Удаление отгрузки
    async deleteShipment(req, res) {
    try {
        const { id } = req.params;
        const shipment = await Shipment.findByPk(id);
        if (!shipment) {
        return res.status(404).json({ message: 'Отгрузка не найдена' });
        }
        await shipment.destroy();
        res.json({ message: 'Отгрузка удалена' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    },
};

module.exports = ShipmentController;