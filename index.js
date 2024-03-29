import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js';
import db from './config/db.js';

// Crear la app
const app = express();

// Habilitar body parser
app.use(express.urlencoded({extended: true}));

// Habilitar cookie parser
app.use(cookieParser());

// Habilitar CSRF
app.use(csrf({cookie: true}));

// Conectar a la base de datos
try{
    await db.authenticate();
    db.sync();
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
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);


});