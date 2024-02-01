import { articleModel } from "../models/Article.js";
import { validarArticulo } from "../helpers/validar.js";
import fs from 'node:fs';
import path from "node:path";

const test = (req, res) => {
    return res.status(200).json({
        mensaje:"Soy una acción de prueba en mi controlador"
    })
}

const curso = (req, res) => {
    console.log('Ejecutando endpoint curso');

    return res.status(200).json([
        {
            curso: "Master en React",
            autor: 'Victor Robles',
            url: 'victorroblesweb.es/master_react'
        },
        {
            curso: "Master en React",
            autor: 'Victor Robles',
            url: 'victorroblesweb.es/master_react'
        },
    ]);
}



const crear = async (req, res) => {

    // Recoger los parametros por post a guardar
    let parametros = req.body;

    // Validar los datos
    try {
        validarArticulo(parametros);
    }catch(error){
        return res.status(400).json({
            status: 'Error',
            mensaje: 'Faltan datos por enviar'
        });
    }


    // Crear el objeto a guardar
    // Asignar valores a objeto basado en el modelo (manual o automatico)

    // Manera automatica
    const article = new articleModel(parametros);


    // // manera manual
    // article.title = parametros.title;
    // article.content = parametros.content;


    // guardar el articulo en la DB

    await article.save()
            .then(response => {
                if(response === article){
                    let result = {
                        status: 'success',
                        article: article,
                        message: 'Articulo guardado con exito'
                    }
                
                    return res.status(200).json(result);
                }
            })
            .catch(err => {
                let result = {
                    status: 'Error',
                    message: 'No se pudo guardar el articulo'
                }
                return res.status(400).json(result);
            });
    
    
    
    
    // return res.status(result.statusCode).json(result);

}

const listar = async (req, res) => {
    let consulta = articleModel.find({});

    // aplicar limite a la consulta
    if(req.params.ultimos){
        consulta.limit(3);
    }
    

    consulta.sort({date: -1});

    await consulta.exec()
    .then(articulos => {
        return res.status(200).send({
            status: 'success',
            parametro: req.params.ultimos,
            count: articulos.length,
            articulos
        });
    })
    .catch(error => {
        return res.status(404).json({
            status: 'Error',
            message: 'No se han encontrado articulos'
        });
    });
}

const listarUno = async (req, res) => {
    // obtener un id por la url
    let articuloId = req.params.id;

    // buscar el articulo
    await articleModel.findById(articuloId)
                .exec()
                .then(articulo => {
                    // si existe devolver resultado
                    if(articulo != null){
                        return res.status(200).json({
                            status: 'success',
                            article: articulo
                        });
                    }
                    // Si no existe devolver error
                    return res.status(404).json({
                        status: 'Error',
                        mensaje: 'Articulo no encontrado',
                    });
                })
                .catch(error => {
                    // Si no existe devolver error
                    return res.status(404).json({
                        status: 'Error',
                        mensaje: 'Articulo no encontrado',
                        Detalle: error
                    });
                });
}

const eliminar = async (req, res) => {

    let articuloId = req.params.id;

    await articleModel.findOneAndDelete({_id: articuloId})
                .exec()
                .then(resultado => {
                    if(resultado !== null){
                        return res.status(200).json({
                            status: 'success',
                            mensaje: 'Articulo Borrado',
                            articulo: resultado
                        });
                    }

                    return res.status(404).json({
                        status: 'Error',
                        mensaje: 'Articulo no encontrado',
                    });
                })
                .catch(error => {
                    return res.status(404).json({
                        status: 'Error',
                        mensaje: 'Articulo no encontrado',
                        detalle: error
                    });
                });
}

const actualizar = async (req, res) =>{
    
    // Obtener id del body
    let articuloId = req.params.id;

    // Recoger datos del body
    let parametros = req.body;

    // Validar los datos
    try {
        validarArticulo(parametros);
    }catch(error){
        return res.status(400).json({
            status: 'Error',
            mensaje: 'Faltan datos por enviar'
        });
    }

    await articleModel.findOneAndUpdate({_id: articuloId}, parametros, {new: true})
                .exec()
                .then(resultado => {
                    if(resultado !== null){
                        return res.status(200).json({
                            status: 'success',
                            mensaje: 'Articulo Actualizado',
                            articulo: resultado
                        });
                    }

                    return res.status(404).json({
                        status: 'Error',
                        mensaje: 'Articulo no encontrado',
                    });
                })
                .catch(error => {
                    return res.status(500).json({
                        status: 'Error',
                        mensaje: 'Error al actualizar el articulo',
                        detalle: error
                    });
                });
}

const subir = (req, res) => {

    // configurar multer

    // Recoger el fichero de imagen subido
    if(!req.file && !req.files){
        return res.status(404).json({
            status: 'Error',
            mensaje: 'Peticion invalida'
        });
    }

    // Nombre del archivo o imagen
    let nombreArchivo = req.file.originalname;

    // conseguir la extension

    let archivoSplit = nombreArchivo.split('\.');
    let archivoExtension = archivoSplit[archivoSplit.length - 1].toLowerCase();

    // Comprobar la extension correcta
    if(archivoExtension != 'png' && archivoExtension != 'jpg' && 
        archivoExtension != 'jpeg' && archivoExtension != 'gif'){

        // Borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error)=> {
            return res.status(400).json({
                status: 'Error',
                mensaje: 'tipo de archivo no es valido'
            });
        })

    }else{
        // si todo va bien, actualizar el articulo

        // Obtener id del body
        let articuloId = req.params.id;


        articleModel.findOneAndUpdate({_id: articuloId}, {image: req.file.filename}, {new: true})
                    .exec()
                    .then(resultado => {
                        if(resultado !== null){
                            return res.status(200).json({
                                status: 'success',
                                mensaje: 'Articulo Actualizado',
                                articulo: resultado,
                                fichero: req.file
                            });
                        }

                        return res.status(404).json({
                            status: 'Error',
                            mensaje: 'Articulo no encontrado',
                        });
                    })
                    .catch(error => {
                        return res.status(500).json({
                            status: 'Error',
                            mensaje: 'Error al actualizar el articulo',
                            detalle: error
                        });
                    });
    }
}

const imagen = (req, res) => {
    let fichero = req.params.fichero;

    let ruta_fisica = './imagenes/articulos/' + fichero;

    fs.stat(ruta_fisica, (error, existe) => {
        if(existe){
            return res.sendFile(path.resolve(ruta_fisica));
        }else{
            return res.status(404).json({
                status: 'error',
                mensaje: 'La imagen no existe'
            });
        }
    })
}

const buscador = async (req, res) => {
    // Sacar el string de busqueda
    let busqueda = req.params.busqueda;

    // Find OR
    let queryBusqueda = articleModel.find({
        "$or": [
            {"title": {"$regex": busqueda, "$options": "i"}},
            {"content": {"$regex": busqueda, "$options": "i"}},
        ]
    });

    // Orden
    queryBusqueda.sort({fecha: -1});

    // Ejecutar consulta
    await queryBusqueda.exec()
            .then(resultado => {
                if(resultado != null && resultado.length !== 0){
                    return res.status(200).json({
                        status: 'success',
                        resultado
                    });
                }
                
                return res.status(404).json({
                    status: 'Error',
                    mensaje: 'No hay coincidencias',
                });
            })
            .catch(error => {
                return res.status(400).json({
                    status: 'Error',
                    mensaje: 'Error al ejecutar la busqueda',
                    detalle: error
                });
            });

    // Devolver resultado
}



export {
    test,
    curso,
    crear,
    listar,
    listarUno,
    eliminar,
    actualizar,
    subir,
    imagen,
    buscador
}