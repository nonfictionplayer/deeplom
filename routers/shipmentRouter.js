const Router = require('express')
const ShipmentController = require('../controllers/shipmentController')
const router = new Router()
const authenticate = require('../middleware/autheticate')
const authorize = require('../middleware/authorize')


router.get('/',  ShipmentController.getAllShipments)
router.get('/:id', ShipmentController.getShipmentById)
router.post('/', ShipmentController.createShipment)
router.patch('/:id',ShipmentController.updateShipment)
router.delete('/:id',ShipmentController.deleteShipment)

module.exports = router