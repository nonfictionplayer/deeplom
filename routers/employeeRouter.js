const Router = require('express')
const EmployeeController = require('../controllers/employeeController')
const router = new Router()
const authenticate = require('../middleware/autheticate')
const authorize = require('../middleware/authorize')

router.get('/', EmployeeController.getAllEmployees)
router.get('/:id',EmployeeController.getEmployeeById)
router.get('/auth', EmployeeController.check)
router.post('/registration',EmployeeController.registerAdmin)
router.post('/login',EmployeeController.login)
router.patch('/:id',EmployeeController.updateProfile)
router.delete('/:id', EmployeeController.deleteEmployee)

module.exports = router