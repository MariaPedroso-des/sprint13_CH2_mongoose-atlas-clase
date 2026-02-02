// Con esto podemos realizar operaciones en la base de datos de MongoDB.
// Este User contiene nuestro model de User para tener la estructura del uso de operaciones CRUD

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

module.exports = User;