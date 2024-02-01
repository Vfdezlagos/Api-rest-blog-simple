import conexion from './database/conexion.js';
import express from 'express';
import cors from 'cors';
import articleRouter from './routes/articleRoutes.js';

const app = express();
const port = 3000;

// Inicializar app
console.log('APP arrancada');

// configurar cors
app.use(cors());

// convertir body a objct js
app.use(express.json()); //Recibir datos con content-type aplication/json
app.use(express.urlencoded({extended: true})); // form-urlencode


// conectar a DB
conexion();


// crear rutas

// cargar las rutas
app.use('/api', articleRouter);


app.get('/', (req, res)=>{
    res.status(200).json({
        title: '<h1>Pagina de inicio 2</h1>'
    });
});



// Crear servidor node
app.listen(port, ()=>{
    console.log(`Servidor corriendo en el puerto ${port}`);
});

