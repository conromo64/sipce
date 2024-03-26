//mporta el módulo multer que se utiliza para el manejo de subida de archivos
const multer = require('multer')

//una variable que configura el almacenamiento de los archivos subidos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/images')
    },
    //define cómo se debe nombrar el archivo subido
    filename: function (req, file, cb) {
        const id = req.params.id_art;
        req.getConnection((err, conn) => {
            //realiza una consulta a la base de datos para obtener información sobre el artículo
            conn.query('SELECT * FROM articulos WHERE id_art = ?', [id], (err, data) => {
                const ida = data[0].id_art;
                console.log(ida)
                //se crea un nombre del archivo utilizando el id del artículo.
                cb(null, 'img-' + ida + '.jpg')
                
            })
        })
    }
})

const upload = multer({ storage })

//exportamos el modulo
module.exports = upload