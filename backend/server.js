const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const databaseRoutes = require("./src/routes/databases");
const tableRoutes = require('./src/routes/tables');

const app = express();

// Configuración de middleware
app.use(cors());
app.use(express.json());

// Configuración de MongoDB
const MONGODB_URI = "mongodb://127.0.0.1:27017/sw1-parcial2";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conexión exitosa a MongoDB.");
});

// Rutas
app.use("/api", databaseRoutes);
app.use('/api', tableRoutes);

// Inicio del servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}.`);
});
