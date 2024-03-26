//importa el módulo multer que se utiliza para el manejo de subida de archivos
const multer = require('multer')

//una variable que configura el almacenamiento de los archivos subidos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/images')
    },
    //define cómo se debe nombrar el archivo subido
    filename: function (req, file, cb) {
        req.getConnection((err, conn) => {
            //realiza una consulta a la base de datos para obtener información sobre los articulos existentes
            conn.query('SELECT * FROM articulos', (err, data) => {
                const long = data.length - 1
                const ida = data[long].id_art + 1
                //se crea un nombre del archivo utilizando el id del artículo.
                cb(null, 'img-' + ida + '.jpg')
            })
        })
    }
})

const upload = multer({ storage })

//exportamos el modulo
module.exports = upload