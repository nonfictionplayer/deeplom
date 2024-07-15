const Router = require('express')
const ProductController = require('../controllers/productController')
const router = new Router()
const authenticate = require('../middleware/autheticate')
const authorize = require('../middleware/authorize')


router.get('/',  ProductController.getAllProducts)
router.get('/:id',  ProductController.getProductById)
router.post('/', ProductController.createProduct)
router.patch('/:id',ProductController.updateProduct)
router.delete('/:id',ProductController.deleteProduct)

module.exports = router