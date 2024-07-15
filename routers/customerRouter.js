const Router = require('express')
const CustomerController = require('../controllers/customerController')
const router = new Router()
const authenticate = require('../middleware/autheticate')
const authorize = require('../middleware/authorize')

router.get('/',  CustomerController.getAllCustomers)
router.get('/:id',CustomerController.getCustomerById)
router.post('/',CustomerController.createCustomer)
router.patch('/:id',CustomerController.updateCustomer)
router.delete('/:id',CustomerController.deleteCustomer)

module.exports = router