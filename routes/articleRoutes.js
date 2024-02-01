import express from 'express';
import * as articleController from '../controllers/articleController.js';
import multer from 'multer';

const articleRouter = express.Router();

const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './imagenes/articulos/');
    },

    filename: function(req, file, cb){
        cb(null, 'articulo' + Date.now() + file.originalname);
    }
});

const subidas = multer({storage: almacenamiento});

// ruta de prueba
articleRouter.get('/ruta-de-prueba', articleController.test);
articleRouter.get('/ruta-de-curso', articleController.curso);

// Ruta Util
articleRouter.post('/crear', articleController.crear);

articleRouter.get('/articulos/:ultimos?', articleController.listar);
articleRouter.get('/articulo/:id', articleController.listarUno);

articleRouter.delete('/articulo/:id', articleController.eliminar);

articleRouter.put('/articulo/:id', articleController.actualizar);

articleRouter.post('/subir-imagen/:id', [subidas.single('file0')], articleController.subir);
articleRouter.get('/imagen/:fichero', articleController.imagen);


articleRouter.get('/buscar/:busqueda', articleController.buscador);





export default articleRouter;