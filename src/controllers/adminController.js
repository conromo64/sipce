// Funciones a las que accede un administrador
const bcrypt = require('bcrypt');

function verbaja (req,res){
    if (req.session.rol == 1) {
        res.render('pages/baja', { name: req.session.name});
    } else {
        // si no lo redirijimos a la raiz del sistema
        res.redirect('/')
    }
}

// Funcion que manda a alta personal para registrar un personal //
function personal(req, res) {
    //este if es para verificar si la sesion esta en verdadero osea que esta iniciada la sesion
    if (req.session.rol == 1) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM tipo_empleado', (err, rows) => {
                //si comprobo que se incio sesion correctamente te mande a la pagina de alta personal
                res.render('pages/altaPersonal', { name: req.session.name, rows });
            })
        })
    } else {
        // si no lo redirijimos a la raiz del sistema
        res.redirect('/')
    }
}//fin

// Muestra todos los datos de la tabla de usuarios //
// En el archivo de personal //
function tabla(req, res) {
    if (req.session.rol == 1) {
        //aqui hace una conexion a la base de datos con una fat arrow
        req.getConnection((err, conn) => {
            //se realiza una consulta a la base de datos donde selecciona a todos los usuarios 
            conn.query('SELECT * FROM users WHERE status = 0', (err, per) => {
                //se verifica que no haya errores al hacer la cosulta y si hay errores que aparezcan 
                if (err) {
                    console.log(err);
                    // si no hay errores 
                } else {
                    //si todo salio bien verificamos que este inciada sesion para llevarlo a la pagina de personal
                    res.render('pages/personal', { per, name: req.session.name })
                }
            })
        })
    } else {
        // si no lo redirijimos a la raiz del sistema
        res.redirect('/')
    }
}

// Se registran los datos ingresados en la table usuarios //
// Se revisa que los correos ingresados no se encuentren en uso //
function registraPerso(req, res) {
    if (req.session.rol == 1) {
        //se obrtienen los datos de registro del usuario y se almacenan en una variable
        const data = req.body;
        //utilizamos una conexion a la base de datos
        req.getConnection((err, conn) => {
            //hacemos una consulta para verificar que el email no este repetido en la base de datos
            conn.query('SELECT * FROM users WHERE email = ? and status = 0', [data.email], (err, userdata) => {
                //aqui comprueba de que no exista un correo similar al que se va a registrar nuevo en caso de que si le arroje el mensaje
                if (userdata.length > 0) {
                    conn.query('SELECT * FROM tipo_empleado', (err, rows) => {
                        res.render('pages/altaPersonal', { rows, name: req.session.name, errora: 'ya existe el email' })
                    })
                } else {
                    // si no encontro nada ahora verificamos que la contraseña no se repita
                    if (data.password == data.password1) {
                        //si las contraseñas coinciden eliminamos la contraseña
                        delete data.password1;
                        //la contraseña se cifra utilizando bcrypt
                        bcrypt.hash(data.password, 12).then(hash => {
                            //se actualiza con la nueva contraseña
                            data.password = hash;
                            //se realiza una consulta sql para insertar los nuevos datos
                            req.getConnection((err, conn) => {
                                conn.query('INSERT INTO `users` SET ?', [data], (err, rows) => {
                                    //si hay un error se detiene todo
                                    if (err) throw err
                                    //si inserto correctamente lo dirijimos de nuevo a la pagina de personal
                                    res.redirect('/personal');
                                })
                            })
                        })
                        // si la contraseña coincide no lo dejamos que inserte nada y le arrojamos un mensaje
                    } else {
                        conn.query('SELECT * FROM tipo_empleado', (err, rows) => {
                            res.render('pages/altaPersonal', {rows, name: req.session.name, errora: "No coinciden las contraseñas"})
                        })
                    }
                }
            })
        })
    } else {
        // si no lo redirijimos a la raiz del sistema
        res.redirect('/')
    }

}//fin

// Se eliminan los datos de un usuario de la tabla de usuarios segun su id // 
function elimina(req, res) {
    if (req.session.rol == 1) {
        //se obtiene el id del usuario que se va a eliminar
        id = req.params.idUser;
        //imprimimos en consola el id
        console.log(id)
        //se utiliza una conexion a la base de datos
        req.getConnection((err, conn) => {
            //se realiza una consulta a la base de datos para eliminar el usuario en la tabla users
            conn.query('UPDATE users SET status = 1 WHERE idUser = ?', [id], (err, rows) => {
                if (err) throw err
                res.redirect('/personal');
            });
        })
    } else {
        // si no lo redirijimos a la raiz del sistema
        res.redirect('/')
    }
}//fin

// Se selecciona los datos de un usuario segun su id, para poder modificarlos  // 
function editar(req, res) {
    if (req.session.rol == 1) {
        //se obtiene el id del usuario que se va a editar
        id = req.params.idUser;
        //se utiliza una conexion a la base de datos
        req.getConnection((err, conn) => {
            //hacemos una llamada a la base de datos para seleccionar el usuario de acuerdo con el id
            conn.query('SELECT * FROM users  WHERE idUser =?', [id], (err, per) => {
                //si sale un error lo imprimimos en consola
                if (err) {
                    console.log(err);
                } else {
                    //si no verificamos que aun tenga la sesion abierta
                    //lo mandamos a la pagina de editar personal
                    conn.query('SELECT * FROM tipo_empleado ', (err, rows) => {

                        res.render('pages/editaPer', { per, name: req.session.name, rows })
                    })
                }
            })
        })
    } else {
        // si no lo redirijimos a la raiz del sistema
        res.redirect('/')
    }
}//fin

//funcion para actualizar los cambios de la bd
function update(req, res) {
    if (req.session.rol == 1) {
        //se obtiene el id del usuario 
        const id = req.params.idUser;
        //mostramos el id en consola
        console.log(id);
        //se obrtienen los datos del usuario y se almacenan en una variable
        const data = req.body;
        //hacemos una conexion a la base de datos
        req.getConnection((err, conn) => {
            //hacmeos una consulta a la base de datos donde seleccionamos los usuarios de acuerdo al email
            conn.query('SELECT * FROM users WHERE email= ?', [data.email], (err, userdata) => {
                //se verifica si encontro algo la consulta
                if (userdata.length > 0) {
                    //hacemos otra conexion 
                    req.getConnection((err, conn) => {
                        //se hace otra consulta donde se verifica que el email es igual al nuevo email
                        conn.query('SELECT * FROM users WHERE idUser= ? AND email LIKE ?', [id, data.email], (err, userdatas) => {
                            //se ve si encontraron resultados
                            if (userdatas.length > 0) {
                                //se verifica que la nueva contraseña tenga mas de 5 caracteres
                                if (data.password.length > 5) {
                                    //se cifra la contraseña con bcrypt
                                    bcrypt.hash(data.password, 12).then(hash => {
                                        //se actualiza data.password
                                        data.password = hash;
                                        //se imprime en consola
                                        console.log(data.password)
                                        //se hace otra llamada a la base de datos
                                        req.getConnection((err, conn) => {
                                            //una consulta donde se actualizan o editan los datos 
                                            conn.query('UPDATE users SET ? WHERE idUser = ?', [data, id], (err, rows) => {
                                                //si hay un error lo imprimimos en consola 
                                                if (err) {
                                                    console.log(err);
                                                }
                                                // si no lo redirijimos al personal
                                                res.redirect('/personal')
                                            });
                                        });
                                    })
                                    //si la contraseña no tiene mas de 5 caracteres 
                                } else {
                                    //se elimina la contraseña guardada en data.password
                                    delete data.password;
                                    //se imprime en consola 'chico'
                                    console.log('chico');
                                    //hacemos otra conexion a la base de datos
                                    req.getConnection((err, conn) => {
                                        //otra consulta donde se hace un edita 
                                        conn.query('UPDATE users SET ? WHERE idUser = ?', [data, id], (err, rows) => {
                                            //si hay un error lo imprimos en consola
                                            if (err) {
                                                console.log(err);
                                            }
                                            //si no lo redirijimos al personal
                                            res.redirect('/personal')
                                        });
                                    });
                                }
                                // si encuentra un email igual
                            } else {
                                //hacemos una llamada a la base de datos
                                req.getConnection((err, conn) => {
                                    //hacemos una consulta donde seleccionamos todos los usuarios 
                                    conn.query('SELECT * FROM users WHERE idUser =?', [id], (err, per) => {
                                        //si el email se repite lo arrojamos un mensaje 
                                        res.render('pages/editaPer', { name: req.session.name, error: 'ya existe el email', per })
                                    })
                                })
                            }

                        })
                    })
                    // si la contraseña tiene mas de 5 caracteres 
                } else {
                    if (data.password.length > 5) {
                        //la encriptamos
                        bcrypt.hash(data.password, 12).then(hash => {
                            //actualizamos los datos
                            data.password = hash;
                            //imprimimos en consola 
                            console.log(data.password)
                            //hacemos otra conexion 
                            req.getConnection((err, conn) => {
                                //editamos la base de datos
                                conn.query('UPDATE users SET ? WHERE idUser = ?', [data, id], (err, rows) => {
                                    //si hay un error lo imprimos en consola
                                    if (err) {
                                        console.log(err);
                                    }
                                    //si no lo enviamos a la pagina de personal
                                    res.redirect('/personal')
                                });
                            });
                        })
                        //si la contraseña no es mayor a 5 caracteres
                    } else {
                        //se elimina los datos en data.password
                        delete data.password;
                        //imprimimos en consola 
                        console.log('chico');
                        //otra conexion 
                        req.getConnection((err, conn) => {
                            //una consulta donde se edita 
                            conn.query('UPDATE users SET ? WHERE idUser = ?', [data, id], (err, rows) => {
                                //si hay un error lo mostramos en consola
                                if (err) {
                                    console.log(err);
                                }
                                //lo redirijimos a la pagina de personal
                                res.redirect('/personal')
                            });
                        });
                    }
                }
            })
        })
    } else {
        // si no lo redirijimos a la raiz del sistema
        res.redirect('/')
    }
}

//Menu//

// Funcion que manda al archivo producto //
function productos(req, res) {
    //si l sesion esta abierta
    if (req.session.rol == 1) {
        //hacemos una conexion 
        req.getConnection((err, conn) => {
            //una consulta donde seleccionamos todo en tipo de articulo
            conn.query('SELECT * FROM tipo_articulo', (err, per) => {
                //otra conexion                
                req.getConnection((err, conn) => {
                    //seleccionamos todo de la tabla tipo_unidad en la base de datos
                    conn.query(' SELECT * FROM tipo_unidad', (err, uni) => {
                        //redirijimos a alta de producto
                        res.render('pages/altaProducto', { name: req.session.name, per, uni });

                    }
                    )
                })
            })
        })
        //si no a la raiz del sistema
    } else {
        res.redirect('/')
    }
}

// Muestra la informacon que se encuentra en la tabla de articulos //
// En el archivo de menu //
function prod(req, res) {
    if (req.session.rol == 1) {
        //hacemos una conexion a la base de datos
        req.getConnection((err, conn) => {
            //una consulta donde escogemos todo de los articulos
            conn.query('SELECT * FROM articulos WHERE activo = 1', (err, per) => {
                //si hay un error lo mostramos en consola
                if (err) {
                    console.log(err);
                    //si salio bien 
                } else {
                    //comprobamos que siga la sesion abierta 
                    //lo redirijimos al menu
                    res.render('pages/menu', { per, name: req.session.name })

                }
            })
        })
    } else {
        // si no lo redirijimos a la raiz del sistema
        res.redirect('/')
    }
}//fin

// Se registra un nuevo articulo en la tabla de articulos //
// Se rivisa que no se ingrese un tipo de articulo que no exista //
// Se checha que no se vuelva a registrar un articulo existente //
function registraMenu(req, res) {
    if (req.session.rol == 1) {
        //una variable 
        const data = req.body;
        if (req.file) {
            //una imagen
            data.image = '/images/' + req.file.filename

            //hacemos una conexion a la base de datos
            req.getConnection((err, conn) => {
                //una consulta seleccionamos todo de tipo de articulos
                conn.query('select * from tipo_articulo where tipo = ?', [data.tipo], (err, tp) => {
                    //vemos si encontro algo
                    if (tp.length > 0) {
                        //otra conexion
                        req.getConnection((err, conn) => {
                            //una consulta donde insertamos en articulos
                            conn.query('INSERT INTO `articulos` SET ?', [data], (err, rows) => {
                                //se redirije al menu
                                res.redirect('/menu');
                            })
                        })
                        //si no al alta de producto donde le mandamos un mensaje
                    } else {
                        res.render('pages/altaProducto', { name: req.session.name, error: 'No existe el tipo de articulo' })
                    }
                })
            })
            //si no
        } else {
            //una imagen
            data.image = '/images/producto_ejemplo.jpg'

            //hacemos otra conexion
            req.getConnection((err, conn) => {
                //seleccionamos todo de tipo de articulo
                conn.query('select * from tipo_articulo where tipo = ?', [data.tipo], (err, tp) => {
                    //comprobamos si encontro algo
                    if (tp.length > 0) {
                        //si encontro algo hacemos otra conexion
                        req.getConnection((err, conn) => {
                            //insertamos en articulos y lo redirijimos al menu
                            conn.query('INSERT INTO `articulos` SET ?', [data], (err, rows) => {
                                res.redirect('/menu');
                            })
                        })
                        //si no le ponemos un mensaje 
                    } else {
                        res.render('pages/altaProducto', { name: req.session.name, error: 'No existe el tipo de articulo' })
                    }
                })
            })
        }
    } else {
        // si no lo redirijimos a la raiz del sistema
        res.redirect('/')
    }
}//fin

// Se busca el articulo por su id, para borrar toda la informacion de este de la tabla //
function eliminaMen(req, res) {
    if (req.session.rol == 1) {
        //el id
        id = req.params.id_art;
        //imprimimos en consola el id
        console.log(id)
        //hacemos una conexion 
        req.getConnection((err, conn) => {
            //una consulta donde eliminamos los articulos por el id 
            conn.query('UPDATE articulos SET activo = 0 WHERE id_art = ?', [id], (err, rows) => {
                //otra consulta
                res.redirect('/menu')
            });
        })
    } else {
        // si no lo redirijimos a la raiz del sistema
        res.redirect('/')
    }
}//fin

// Se edita la informacion de un articulo segun su id //
function editarMen(req, res) {
    if (req.session.rol == 1) {
        //el id
        id = req.params.id_art;
        //hacemos una conexion
        req.getConnection((err, conn) => {
            //una consulta donde seleccionamos todo de diferentes tablas 
            conn.query('SELECT * FROM articulos a, tipo_unidad b,tipo_articulo c WHERE id_art =? and a.tipo = c.tipo and a.unidad=b.unidad', [id], (err, per) => {
                if (err) {//si hay errores lo mostramos
                    console.log(err);
                } else {
                    //si no hacemos otra conexion
                    req.getConnection((err, conn) => {
                        //seleccionamos todo de tipo de articulos
                        conn.query('SELECT * FROM tipo_articulo', (err, tip) => {
                            //otra conexion
                            req.getConnection((err, conn) => {
                                //seleccionamos todo de tipo de unidad
                                conn.query(' SELECT * FROM tipo_unidad', (err, uni) => {
                                    //si la sesion sigue abierta 
                                    //lo mandamos a edita menu
                                    res.render('pages/editaMenu', { per, name: req.session.name, tip, uni })
                                }
                                )
                            })
                        }
                        )
                    })
                }
            })
        })
    } else {
        // si no lo redirijimos a la raiz del sistema
        res.redirect('/')
    }
}//fin


// Se actualiza la informacion del articulo editado //
function updateMen(req, res) {
    if (req.session.rol == 1) {
        const id = req.params.id_art;//id
        const data = req.body;//datos
        console.log(data)//imprimimos el data
        //si hay datos 
        if (req.file) {
            //una imagen
            data.image = '/images/' + req.file.filename
            //hacemos otra conexion
            req.getConnection((err, conn) => {
                //editamos en articulos
                conn.query('UPDATE articulos SET ? WHERE id_art = ?', [data, id], (err, rows) => {
                    if (err) {//si hay errores lo imprimos en consola
                        console.log(err);
                    }
                    //se redirije al menu
                    res.redirect('/menu')
                });
            });
            //si no hay nada
        } else {
            //se elimina la imagen
            delete data.image
            //hacemos otra conexion
            req.getConnection((err, conn) => {
                //se edita en articulos 
                conn.query('UPDATE articulos SET ? WHERE id_art = ?', [data, id], (err, rows) => {
                    if (err) {//si hay errores lo imprimimos
                        console.log(err);
                    }
                    //lo redirijimos al menu
                    res.redirect('/menu')
                });
            });
        }
    } else {
        // si no lo redirijimos a la raiz del sistema
        res.redirect('/')
    }
}//fin






// Enivia las funciones utilizadas //
module.exports = {
    personal,
    tabla,
    editar,
    update,
    elimina,
    registraPerso,
    registraMenu,
    prod,
    productos,
    eliminaMen,
    editarMen,
    updateMen,
    verbaja
}