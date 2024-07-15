const Router = require('express')
const OrderTypeController = require('../controllers/ordertypeController')
const router = new Router()
const authenticate = require('../middleware/autheticate')
const authorize = require('../middleware/authorize')


router.get('/', authenticate,  OrderTypeController.getAllOrderTypes)
router.get('/:id', authenticate,  OrderTypeController.getOrderTypeById)
router.post('/', authenticate, authorize('manager'),OrderTypeController.createOrderType)
router.patch('/:id',authenticate, authorize('manager'),OrderTypeController.updateOrderType)
router.delete('/:id',authenticate, authorize('manager'),OrderTypeController.deleteOrderType)

module.exports = router