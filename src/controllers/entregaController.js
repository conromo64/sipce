function entqr(req, res) {
    if (req.session.rol == 4) {
        res.render('perEntrega/qrEntrega', { name: req.session.name, layout: 'personalEn' })
    } else {
        res.redirect('/')
    }
}

function detalle(req, res) {
    //se obtiene el id del usuario que se va a editar
    if (req.session.rol == 4) {
        const id = req.params.folio;
        //se utiliza una conexion a la base de datos
        req.getConnection((err, conn) => {
            conn.query("SELECT * FROM encabezado WHERE Status = 'c' AND Folio = ?", [id], (err, ped) => {
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
                        res.render('perEntrega/detalle', { name: req.session.name, car, totales: tot, fecha: fe, Folio: id, layout: 'personalEn' });
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

function actualiza(req, res) {
    if (req.session.rol == 4) {
        const io = req.app.get("socket");
        const id = req.params.folio;
        const idS = req.session.idE;
        req.getConnection((err, conn) => {
            conn.query("SELECT * FROM encabezado WHERE Status = 'c' AND Folio = ?", [id], (err, ped) => {
                if (ped.length > 0) {
                    conn.query("UPDATE encabezado SET Status = 'e', id_empleado_entrega = ? WHERE encabezado.Folio = ?", [idS, id], (err, rows) => {
                        if (err) throw err
                        conn.query('SELECT correoUsuario FROM encabezado WHERE Folio = ?', [id], (err, user) => {
                            setTimeout(function () {
                                io.emit("reloadU", user[0].correoUsuario)
                                io.to(req.session.rol).emit("reloadEn")
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
    entqr,
    detalle,
    actualiza
}