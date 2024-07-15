const { Customer } = require('../models/model');

const CustomerController = {
  // Получение всех клиентов
  async getAllCustomers(req, res) {
    try {
      const customers = await Customer.findAll();
      res.json(customers);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Получение информации о конкретном клиенте
  async getCustomerById(req, res) {
    try {
      const { id } = req.params;
      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({ message: 'Клиент не найден' });
      }

      res.json(customer);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Создание нового клиента
  async createCustomer(req, res) {
    try {
      const { name, address } = req.body;
      const customer = await Customer.create({
        name,
        address,
      });

      res.status(201).json(customer);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Обновление клиента
  async updateCustomer(req, res) {
    try {
      const { id } = req.params;
      const { name, address } = req.body;
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ message: 'Клиент не найден' });
      }
      await customer.update({
        name,
        address,
      });
      res.json(customer);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Удаление клиента
  async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ message: 'Клиент не найден' });
      }
      await customer.destroy();
      res.json({ message: 'Клиент удален' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

module.exports = CustomerController;