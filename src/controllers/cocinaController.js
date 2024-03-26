function pedidoOrdenado(req, res) {
    //se obtiene el id del usuario que se va a editar
    if (req.session.rol == 3) {
        const id = req.params.folio;
        //se utiliza una conexion a la base de datos
        req.getConnection((err, conn) => {
            conn.query("SELECT * FROM encabezado WHERE Status = 'o' AND Folio = ?", [id], (err, ped) => {
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
                        res.render('perCocina/cocinaPed', { name: req.session.name, car, totales: tot, fecha: fe, Folio: id, layout: 'personalCo' });
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
function cambiarOrd(req, res) {
    if (req.session.rol == 3) {
        const io = req.app.get("socket");
        const idS = req.session.idE
        const id = req.params.folio;
        req.getConnection((err, conn) => {
            conn.query("SELECT * FROM encabezado WHERE Status = 'o' AND Folio = ?", [id], (err, ped) => {
                if (ped.length > 0) {
                    conn.query("UPDATE encabezado SET Status = 'p', id_empleado_cocina = ? WHERE encabezado.Folio = ?", [idS, id], (err, rows) => {
                        if (err) throw err
                        conn.query('SELECT correoUsuario FROM encabezado WHERE Folio = ?', [id], (err, user) => {
                            setTimeout(function () {
                                io.emit("reloadU", user[0].correoUsuario)
                                io.to(req.session.rol).emit("reloadC")
                            }, 500);
                            res.redirect('/pedidoPre/' + id)

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

function pedidoPreparando(req, res) {
    //se obtiene el id del usuario que se va a editar
    if (req.session.rol == 3) {
        const id = req.params.folio;
        //se utiliza una conexion a la base de datos
        req.getConnection((err, conn) => {
            conn.query("SELECT * FROM encabezado WHERE Status = 'p' AND Folio = ?", [id], (err, ped) => {
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

                        res.render('perCocina/cocinaPre', { name: req.session.name, car, totales: tot, fecha: fe, Folio: id, layout: 'personalCo' });
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

function cambiarPre(req, res) {
    if (req.session.rol == 3) {
        const io = req.app.get("socket");
        const id = req.params.folio;
        req.getConnection((err, conn) => {
            conn.query("SELECT * FROM encabezado WHERE Status = 'p' AND Folio = ?", [id], (err, ped) => {
                if (ped.length > 0) {
                    conn.query("UPDATE encabezado SET Status = 'l' WHERE encabezado.Folio = ?", [id], (err, rows) => {
                        if (err) throw err
                        conn.query('SELECT correoUsuario FROM encabezado WHERE Folio = ?', [id], (err, user) => {
                            console.log(user[0].correoUsuario);

                            setTimeout(function () {
                                io.emit("reloadU", user[0].correoUsuario)
                                io.to(req.session.rol).emit("reloadC")
                                io.to(2).emit("reloadCa")
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

module.exports = {
    pedidoOrdenado,
    cambiarOrd,
    pedidoPreparando,
    cambiarPre
}