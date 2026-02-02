const express = require('express')
const app = express()
const PORT = 8080
const { dbConnection } = require('./config/config.js')
const routes = require('./routes')

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use('/', routes)

dbConnection()

app.listen(PORT, () => console.log(`server started on port http://localhost:${PORT}`))