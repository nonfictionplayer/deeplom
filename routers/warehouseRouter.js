const Router = require('express')
const WarehouseController = require('../controllers/warehouseController')
const router = new Router()
const authenticate = require('../middleware/autheticate')
const authorize = require('../middleware/authorize')


router.get('/',WarehouseController.getWarehouse)
router.post('/', WarehouseController.createWarehouse)
router.patch('/:id', WarehouseController.updateWarehouse)
router.delete('/:id',WarehouseController.deleteWarehouse)

module.exports = router