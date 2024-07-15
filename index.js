const express = require('express')
require('dotenv').config()
const sequelize = require('./db')
const models = require('./models/model.js')
const router = require('./routers/index.js')
const cors = require('cors')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, ()=> console.log(`Server is started on port ${PORT}`))
    } catch (e){
        console.log(e)
    }
}

start()
