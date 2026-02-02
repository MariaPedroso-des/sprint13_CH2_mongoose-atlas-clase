//Aquí el código que necesitamos para la conexión a la base de datos.

const mongoose = require('mongoose')
require('dotenv').config()

const dbConnection = async() => {
  try {
    console.log(process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Base de datos conectada con éxito')
  } catch (err) {
    console.error(err)
    throw new Error('Error a la hora de iniciar la base de datos')
  }
};

module.exports = {
  dbConnection,
}
