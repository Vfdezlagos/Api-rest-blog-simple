import mongoose from 'mongoose';

const conexion = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/mi_blog');
        console.log('DB mi_blog Conectada');
    }catch(error){
        console.log(error);
        throw new Error('No se pudo conectar a la base de datos');
    }
}

export default conexion;