import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';

// Crear la app
const app = express();

// Routing
 app.use('/auth', usuarioRoutes);

 //Habilitar pug
 app.set('view engine', 'pug');
 app.set('views', './views');

 // Carpeta Pública
 app.use(express.static('public'));

// Definir un puerto
const port = 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);


});