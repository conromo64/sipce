function carqr(req, res) {
    if (req.session.rol == 2) {
        res.render('perCaja/qrCaja', { name: req.session.name, layout: 'personalCa' })
    } else {
        res.redirect('/')
    }
}


function resumen(req, res) {
    //se obtiene el id del usuario que se va a editar
    if (req.session.rol == 2) {
        const id = req.params.folio;
        //se utiliza una conexion a la base de datos
        req.getConnection((err, conn) => {
            conn.query("SELECT * FROM encabezado WHERE Status = 'l' AND Folio = ?", [id], (err, ped) => {
                if (ped.length > 0) {
                    conn.query('SELECT a.Fecha,a.correoUsuario,b.Cantidad,b.Precio,c.nombre FROM encabezado a,detalle b,articulos c WHERE a.Folio=b.Folio AND b.Clave_Articulo=c.id_art AND a.Folio = ?', [id], (err, car) => {
                        if (err) throw err
                        let toc = 0
                        let tot = 0
                        car.forEach(element => {
                            element.total = element.Precio * element.Cantidad
                            tot = tot + element.total
                            toc = toc + element.Cantidad
                        });
                        //es la variable de la fecha
                        const f = car[0].Fecha
                        const fe = f.toLocaleString("es-MX", { month: 'long', day: '2-digit', year: 'numeric', hour: "2-digit", minute: "2-digit", second: "2-digit" })
                        console.log(car);
                        res.render('perCaja/perCompra', { name: req.session.name, car, totales: tot, fecha: fe, Folio: id, layout: 'personalCa' });
                    })
                } else {
                    res.redirect('/')
                }
            })
        })
    } else {
        res.redirect('/')
    }
}
function cambiarLis(req, res) {
    if (req.session.rol == 2) {
        const io = req.app.get("socket");
        const id = req.params.folio;
        const idS = req.session.idE
        req.getConnection((err, conn) => {
            conn.query("SELECT * FROM encabezado WHERE Status = 'l' AND Folio = ?", [id], (err, ped) => {
                if (ped.length > 0) {
                    conn.query("UPDATE encabezado SET Status = 'c', id_empleado_caja = ? WHERE encabezado.Folio = ?", [idS, id], (err, rows) => {
                        if (err) throw err
                        conn.query('SELECT correoUsuario FROM encabezado WHERE Folio = ?', [id], (err, user) => {
                            setTimeout(function () {
                                io.emit("reloadU", user[0].correoUsuario)
                                io.to(req.session.rol).emit("reloadCa")
                                io.to(4).emit("reloadEn")
                            }, 500);
                            res.redirect('/')

                        })
                    })
                } else {
                    res.redirect('/')
                }
            })
        })
    } else {
        res.redirect('/')
    }
}

function cargarmenu(req, res) {
    //se obtiene el id del usuario que se va a editar
    if (req.session.rol == 2) {
        const id = req.params.folio;
        //se utiliza una conexion a la base de datos
        req.getConnection((err, conn) => {
            conn.query("SELECT * FROM encabezado WHERE Status = 'l' AND Folio = ?", [id], (err, ped) => {
                if (ped.length > 0) {
                    conn.query('SELECT  a.Precio,a.Folio,a.Clave_Articulo,b.nombre,b.image ,b.id_art, a.Cantidad FROM detalle a , articulos b WHERE a.Clave_Articulo = b.id_art AND a.Folio = ? ', [id], (err, car) => {
                        let carl = car.length
                        if (carl > 0) {
                            carl = carl - 1
                            req.getConnection((err, conn) => {
                                conn.query('SELECT a.image, a.nombre, b.Folio,a.id_art, a.precio FROM articulos a, encabezado b WHERE b.Folio = ?', [id], (err, per) => {
                                    let cant = 0
                                    for (let i = 0; i <= carl; i++) {
                                        let carp = car[i].Clave_Articulo
                                        let cantid = car[i].Cantidad
                                        let ind = per.findIndex(element => element.id_art === carp)
                                        cant = cant + cantid
                                        per[ind].Cantidad = cantid
                                        per[ind].validacion = 'si'
                                        console.log(per);
                                    }
                                    res.render('perCaja/perMenu', { name: req.session.name, menu: "soy menu", busca: "articulos", per, layout: 'personalCa' });
                                })
                            })
                        }
                    })
                } else {
                    res.redirect('/')
                }
            })
        })
    } else {
        res.redirect('/')
    }
}

function agregarus(req, res) {
    if (req.session.rol == 2) {
        const id = req.params.folio;
        const idart = req.params.id
        req.getConnection((err, conn) => {
            conn.query("SELECT * FROM encabezado WHERE Status = 'l' AND Folio = ?", [id], (err, ped) => {
                if (ped.length > 0) {
                    //selecciona todo de la tabla carrito
                    conn.query('SELECT * FROM detalle WHERE Folio = ? AND Clave_Articulo = ?', [id, idart], (err, carr) => {
                        if (carr.length > 0) {
                            //aumenta la cantidad
                            let cant = carr[0].Cantidad + 1
                            //aumenta la cantidad de articulos 
                            conn.query('UPDATE detalle SET Cantidad = ? WHERE Clave_Articulo = ? AND Folio = ?', [cant, idart, id], (err, per) => {
                                if (err) throw err
                                res.redirect('/menucompra/' + id)
                            })
                        } else {
                            throw "No sepudo modificar el articulo"
                        }
                    })
                } else {
                    res.redirect('/')
                }
            })
        })
    } else {
        res.redirect('/')
    }
}
function agregarn(req, res) {
    if (req.session.rol == 2) {
        const id = req.params.folio;
        const idart = req.params.id
        const precio = req.params.precio
        //selecciona todo de la tabla carrito
        req.getConnection((err, conn) => {
            conn.query("SELECT * FROM encabezado WHERE Status = 'l' AND Folio = ?", [id], (err, ped) => {
                if (ped.length > 0) {
                    //inserta en la pagina 
                    conn.query("INSERT INTO detalle (Folio, Clave_Articulo, Cantidad, Precio) VALUES (?,? , 1,?);", [id, idart, precio], (err, per) => {
                        if (err) throw err
                        res.redirect('/menucompra/' + id)
                    })
                } else {
                    res.redirect('/')
                }
            })
        })
    } else {
        res.redirect('/')
    }
}

module.exports = {
    carqr,
    resumen,
    cambiarLis,
    cargarmenu,
    agregarn,
    agregarus
}