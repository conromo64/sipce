//se importa bcrypt
const bcrypt = require('bcrypt');

//Es la funcion que redirecciona a la carpeta login y al index y si ya se registro redirecciona a la raiz
function index(req, res) {
  //si la sesion no esta abierta 
  if (req.session.loggedin != true) {
    res.render('login/index');//te manda al index
  } else {
    //si no te manda a la raiz
    res.redirect('/')
  }
}//fin

// Comprueba que al iniciar sesion el email ingresado exista //
function auth(req, res) {
  const data = req.body;
  //una conexion a la base de datos
  req.getConnection((err, conn) => {
    //seleccionamos todod de usurios donde el correo coincida con el correo
    conn.query('SELECT * FROM users WHERE BINARY email = ? AND status = 0', [data.email], (err, userdata) => {
      //verificamos que alla  algo
      if (userdata.length > 0) {
        //se hace un foreach para buscar 
        userdata.forEach(element => {
          //comparamos la contraseña para ver que no haya iguales 
          bcrypt.compare(data.password, element.password, (err, isMatch) => {
            //si las contraseñas no coinciden se renderiza a la pagina de login con un mensaje  
            if (!isMatch) {
              res.render('login/index', { passwordErrors: '¡Contraseña o email incorrectos!' })
              //si coinciden 
            } else {
              //se incio con exito la sesion 
              req.session.loggedin = true;
              //se alamcena en la propiedad name 
              req.session.name = element.nombre
              //se almacena el rol
              req.session.rol = element.rol
              req.session.idE = element.idUser
              
              //se redirije a la raiz
              res.redirect('/')
            }

          });
        })

        //si no lo mandamos al index en login y le aparezca un mensaje 
      } else {
        res.render('login/index', { passwordErrors : '¡Contraseña o email incorrectos!' })
      }
    })
  })
}//fin

// cierra las sesion iniciada del usuario //
function logout(req, res) {
  //si la sesion esta abierta
  if (req.session.loggedin == true) {
    req.session.destroy();//destruimos la sesion 
    res.redirect('/login');//redirijimos al login
  }
}


// Enivia las funciones utilizadas //
module.exports = {
  index,
  auth,
  logout
}