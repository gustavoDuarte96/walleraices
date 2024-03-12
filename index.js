import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';
import db from './config/db.js';

// Crear la app
const app = express();

// Conectar a la base de datos
try{
    await db.authenticate();
    console.log('Conectado a la base de datos');
}catch(error){
    console.log(error);
}



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