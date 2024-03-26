// Carga de librerias 
const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const { Session } = require('express-session');
const server = require("http").Server(app)
const io = require("socket.io")(server)
const hbshelpers = require("handlebars-helpers");
const multihelpers = hbshelpers();

var client = require('socket.io-client');
// Usar socket.io-client para conectarse al otro servidor 
var socket = client.connect('http://localhost:5000');


//Definición de las rutas de acceso a procesos 
const loginRoutes = require('./routes/login');
const { log } = require('console');

// creacion de la aplicación y asignación del puerto 
app.set('port', 4000);

app.use(express.static('public'))
//definicion de la carpeta de plantillas (templates, views)
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
//Define al motor de vistas de Node.js para usar el "hbs" 
//este usa templetes para renderizar HTML.
app.engine('hbs', engine({
    extname: '.hbs',
    helpers: multihelpers
}))
//el motor de plantillas se define como Handlebars
app.set('view engine', 'hbs');
//configura el middleware mediante el paquete body-parser para analizar los cuerpos 
//de las solicitudes HTTP entrantes, Para analizar las solicitudes entrantes 
//con cargas útiles codificadas en URL, que a menudo se usan al enviar datos de 
//formularios HTML.
app.use(bodyParser.urlencoded({
    extended: true
}));
//configura el middleware para analizar las solicitudes entrantes con cargas JSON.
app.use(bodyParser.json());
//define las credenciales de conección a la Base de datos 
app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'sistema'
}));

//define los parametros para crear una sesión
const sessionMiddleware = session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
})

app.use(sessionMiddleware);

io.engine.use(sessionMiddleware);



//En este caso específico, el middleware que se configura es loginRoutes 
//y se monta en la ruta raíz ('/'). 
//Esto significa que cualquier solicitud a la aplicación pasará primero por el 
//middleware loginRoutes antes de pasar a cualquier middleware posterior.
app.use('/', loginRoutes);


io.on('connection', function (sockett) {
    const session = sockett.request.session;

    sockett.join(session.rol)

    socket.on('cocinaOrd', function (data) {
        io.to(3).emit("reloadC")
    });
})
app.set("socket", io);



//este es método Express.js configura una ruta para la aplicación. 
//Toma dos parámetros: el primer parámetro es la ruta de la ruta y 
//el segundo parámetro es una función de devolución de llamada 
//que se ejecuta cuando se realiza una solicitud a esa ruta.
app.get('/', (req, res) => {
    if (req.session.loggedin == true) {
        const idS = req.session.idE
        if (req.session.rol == 1) {
            const hoy = new Date();
            let fhd = hoy.getDate()
            let fhm = hoy.getMonth() + 1
            if (fhd <= 9){
                fhd = '0' + fhd
            }
            if (fhm + 1 <= 9){
                fhm = '0' + fhm
            }
            const fecha = hoy.getFullYear() + '-' + fhm + '-' + fhd;
            req.getConnection((err,conn) =>{
                conn.query('SELECT Fecha FROM encabezado WHERE Folio=1',(err,rows)=>{
                    if (rows.length > 0){
                    const fechaa = rows[0].Fecha.getFullYear()
                    let fecham = rows[0].Fecha.getMonth()+1
                    if (fecham <= 9){
                        fecham = '0' + fecham
                    }
                    let fechad = rows[0].Fecha.getDate()
                    if (fechad <= 9){
                        fechad = '0' + fechad
                    }
                    res.render('home', { name: req.session.name , fecha , fecham, fechaa , fechad}); 
                    }else{
                        res.render('home', {name: req.session.name,no:"No se encuentra ningun pedido hecho"})
                    }
                })
            })
        } else if (req.session.rol == 2) {
            req.getConnection((err,conn)=>{
                conn.query('SELECT correoUsuario, Folio FROM encabezado WHERE Status = "l"', (err, ped) => {
                    ped.forEach(element => {
                        conn.query('SELECT b.Cantidad,b.Precio FROM encabezado a,detalle b WHERE a.Folio=b.Folio AND a.Folio = ?', [element.Folio], (err, rows) => {
                            if(err) throw err
                            let prec = 0
                            rows.forEach(elem => {
                                prec = prec + (elem.Cantidad * elem.Precio)
                            })
                            element.Precio = prec
                            console.log(element);
                        });
                    });
                    res.render('perCaja/perCaja', { name: req.session.name,ped,qr: "si",busca: "folio ", layout: 'personalCa' })
                })
            })
        } else if (req.session.rol == 3) {
            req.getConnection((err, conn) => {
                //selecciona varios datos de varias tablas
                conn.query('SELECT Folio FROM encabezado WHERE Status = "o"', (err, ord) => {
                    ord.forEach(element => {
                        conn.query('SELECT  b.Cantidad,b.Precio FROM encabezado a,detalle b WHERE a.Folio=b.Folio AND a.Folio = ?', [element.Folio], (err, rows) => {
                            let prec = 0
                            rows.forEach(elem => {
                                prec = prec + (elem.Cantidad * elem.Precio)
                            })
                            element.Precio = prec
                            console.log(element);
                        });
                    });

                    conn.query('SELECT Folio FROM encabezado WHERE Status = "p" AND id_empleado_cocina = ?',[idS], (err, ped) => {
                        ped.forEach(element => {
                            conn.query('SELECT b.Cantidad,b.Precio FROM encabezado a,detalle b WHERE a.Folio=b.Folio AND a.Folio = ?', [element.Folio], (err, rows) => {
                                let prec = 0
                                rows.forEach(elem => {
                                    prec = prec + (elem.Cantidad * elem.Precio)
                                })
                                element.Precio = prec
                                console.log(rows)
                                console.log(element);
                            
                            });
                        });
                        res.render('perCocina/cocina', { name: req.session.name, ord, ped,menu:"si", layout: 'personalCo' })
                    })

                })
            })
        } else if(req.session.rol = 4) {
            req.getConnection((err,conn)=>{
                conn.query('SELECT correoUsuario, Folio FROM encabezado WHERE Status = "c"', (err, ped) => {
                    ped.forEach(element => {
                        conn.query('SELECT b.Cantidad,b.Precio FROM encabezado a,detalle b WHERE a.Folio=b.Folio AND a.Folio = ?', [element.Folio], (err, rows) => {
                            if(err) throw err
                            let prec = 0
                            rows.forEach(elem => {
                                prec = prec + (elem.Cantidad * elem.Precio)
                            })
                            element.Precio = prec
                            console.log(element);
                        });
                    });
                    res.render('perEntrega/entrega', { name: req.session.name,ped,busca: "folio", layout: 'personalEn' })
                })
            })
        }
    } else {
        res.redirect('/login')
    }
})

app.use(function (req, res, next) {
    res.status(404).send('No hay nada aqui pipipi');
});

app.use(function (err, req, res, next) {
    console.log("salchi")
    console.log(err.message);
    res.status(500).send('Ya no jalo pipipi y el error es el siguiente' + err.message);
});

//inicia la ejecución de la aplicación en el puert 4000
server.listen(app.get('port'), () => {
    console.log('listening on port ', app.get('port'));
})
//
