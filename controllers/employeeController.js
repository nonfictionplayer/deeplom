const { Employee,  Warehouse} = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const apiError = require('../error/apiError')

const generateJwt = (id, email, role) =>{
  return jwt.sign(
      {id, email, role},
      process.env.SECRET_KEY,
      {expiresIn: '24h'}
  )
}
const employeeController = {
  registerAdmin: async (req, res) => {
    try {
      const { name, phone, role, login, password, warehouseId } = req.body;
      if(!email || !password) {
        return next(apiError.badRequest('no email or pass'))
    }
    const candidate = await User.findOne({where: {email}})
    if(candidate){
        return next(apiError.badRequest('email used'))
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user =await Employee.create({login, phone, name, role, password: hashPassword})
    const token = generateJwt(user.id, user.login)
    return res.json({token})
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { login, password } = req.body;
      const employee = await Employee.findOne({where:{email}})
        if(!employee){
            return next(apiError.badRequest('No user'))
        }
        let coparePassword = bcrypt.compareSync(password, employee.password)
        if(!coparePassword){
            return next(apiError.badRequest('uncorrect pass'))
        }
        const token = generateJwt(employee.id, employee.login)
        return res.json({token})
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  check: async (req,res) =>{
    const token = generateJwt(req.employee.id, req.employee.email, req.employee.role)
    return res.json({token})
},
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, phone, login, password, role  } = req.body;
      const employee = await Employee.findByPk(id);
      if (!employee) {
        return res.status(404).json({ message: 'Работник не найден' });
      }
      await employee.update({ name, phone, login, password, role  });
      res.json(employee);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  // Получение списка всех сотрудников
  getAllEmployees: async (req, res) => {
    try {
      const employees = await Employee.findAll();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Получение информации о конкретном сотруднике
  getEmployeeById: async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await Employee.findByPk(id);
      if (!employee) {
        return res.status(404).json({ message: 'Сотрудник не найден' });
      }
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Удаление сотрудника
  deleteEmployee: async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await Employee.findByPk(id);
      if (!employee) {
        return res.status(404).json({ message: 'Сотрудник не найден' });
      }
      await employee.destroy();
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
};

module.exports = employeeController;