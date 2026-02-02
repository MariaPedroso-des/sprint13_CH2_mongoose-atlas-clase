// Aquí las rutas y en ellas los diferentes endpoints(CRUD)

const express = require('express')
const router = express.Router()
const User = require('../models/User.js')


//CREATE
router.post('/create', async (req, res) => {
  try{
    const user = await User.create(req.body)
    res.status(201).send(user)
  } catch(error) {
    console.error(error)
    res.status(500).send({ message: 'There was a problem trying to create a user'})
  }
})


module.exports = router;