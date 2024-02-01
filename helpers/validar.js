import validator from "validator";

const validarArticulo = (parametros) => {
    // Validar los datos

        let validarTitulo = !validator.isEmpty(parametros.title) &&
                            validator.isLength(parametros.title, {min: 5, max: undefined});

        let validarContenido = !validator.isEmpty(parametros.content);

        if(!validarTitulo || !validarContenido){
            throw new Error('No se ha validado la informacion');
        }

}

export {
    validarArticulo
}