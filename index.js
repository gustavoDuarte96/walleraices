const express = require('express');

// Crear la app
const app = express();

// Definir un puerto
const port = 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);


});