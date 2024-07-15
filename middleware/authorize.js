const jwt = require('jsonwebtoken')
require('dotenv').config()
const { Employee} = require('../models/model');

const authorize = (...allowedRoles) => {
    return async (req, res, next) => {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const employee = await Employee.findByPk(decoded.employeeId);
  
        if (!employee || !allowedRoles.includes(employee.role)) {
          return res.status(403).json({ message: 'Недостаточно прав для выполнения этого действия' });
        }
  
        req.employee = employee;
        next();
      } catch (error) {
        res.status(401).json({ message: 'Неавторизованный доступ' });
      }
    };
  };

  module.exports = authorize

  