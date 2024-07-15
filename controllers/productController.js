const { Product, Warehouse } = require('../models/model');

const ProductController = {
  // Получение всех продуктов
  async getAllProducts(req, res) {
    try {
      const products = await Product.findAll({
        include: [{ model: Warehouse }],
      });
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

   // Получение информации о конкретном продукте
   async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: [{ model: Warehouse }],
      });

      if (!product) {
        return res.status(404).json({ message: 'Продукт не найден' });
      }

      res.json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Создание нового продукта
  async createProduct(req, res) {
    try {
      const { name, description, count, price, warehouseId } = req.body;
      const product = await Product.create({
        name,
        description,
        count,
        price,
        warehouseId,
      });

      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Обновление продукта
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, description, count, price, warehouseId } = req.body;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Продукт не найден' });
      }
      await product.update({
        name,
        description,
        count,
        price,
        warehouseId,
      });
      res.json(product);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Удаление продукта
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Продукт не найден' });
      }
      await product.destroy();
      res.json({ message: 'Продукт удален' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = ProductController;