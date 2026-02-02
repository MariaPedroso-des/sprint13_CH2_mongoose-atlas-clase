const express = require('express')
const router = express.Router()
const usersRoutes = require('./users.js')

router.use('/', usersRoutes)

module.exports = router;