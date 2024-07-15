const Router = require('express')
const router = new Router()
const productRouter = require('./productRouter')
const customerRouter = require('./customerRouter')
const ordertypeRouter = require('./ordertypeRouter')
const warehouseRouter = require('./warehouseRouter')
const shipmentRouter = require('./shipmentRouter')
const employeeRouter = require('./employeeRouter')
const orderRouter = require('./orderRouter')

router.use('/order', orderRouter)
router.use('/product', productRouter)
router.use('/customer', customerRouter)
router.use('/ordertype', ordertypeRouter)
router.use('/warehouse', warehouseRouter)
router.use('/shipment', shipmentRouter)
router.use('/employee', employeeRouter)

module.exports = router

