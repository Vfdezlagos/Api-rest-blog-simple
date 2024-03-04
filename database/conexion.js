import mongoose from 'mongoose';

const conexion = async () => {
    try {
        await mongoose.connect('mongodb+srv://vfernandezlagos:mugs7PuIeCCrPkL2@blogapidb.hd394fx.mongodb.net/blogApiDB');
        console.log('DB mi_blog Conectada');
    }catch(error){
        console.log(error);
        throw new Error('No se pudo conectar a la base de datos');
    }
}

export default conexion;