const Router = require('express')
const OrderController = require('../controllers/orderController')
const router = new Router()
const authenticate = require('../middleware/autheticate')
const authorize = require('../middleware/authorize')


router.get('/',authenticate,  OrderController.getAllOrders)
router.get('/:id', authenticate, OrderController.getOrderById)
router.post('/',authenticate,authorize('manager'), OrderController.createOrder)
router.patch('/:id', authenticate,authorize('manager'), OrderController.updateOrder)
router.delete('/:id',authenticate,authorize('manager'), OrderController.getAllOrders)

module.exports = router

