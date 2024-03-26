function ventaFecha(req, res) {
    if (req.session.rol == 1) {
        data = req.body
        if (data.fecha1 != undefined || (data.periodo1 != undefined && data.periodo2 != undefined)) {
            req.getConnection((err, conn) => {
                if (data.fecha1) {
                    const date1 = data.fecha1
                    console.log(date1);
                    conn.query('SELECT Folio,correoUsuario FROM encabezado WHERE Fecha between ? AND ?', [date1 + " 00:00:00", date1 + " 23:59:59"], (err, rows) => {
                        if (err) throw err
                        console.log(rows);
                        rows.forEach(element => {
                            conn.query('SELECT b.Cantidad,b.Precio FROM encabezado a,detalle b WHERE a.Folio=b.Folio AND a.Folio = ?', [element.Folio], (err, rowss) => {
                                if (err) throw err
                                let Total = 0
                                rowss.forEach(elem => {
                                    Total = Total + (elem.Cantidad * elem.Precio)
                                })
                                element.Total = Total
                                console.log(element);
                            });
                        });
                        console.log(rows);
                        res.render('reVenta/fecha', { name: req.session.name, rows, date1 })
                    })
                } else {
                    const date1 = data.periodo1
                    const date2 = data.periodo2
                    conn.query('SELECT CONVERT(encabezado.Fecha,date) AS Fecha, correoUsuario, SUM(detalle.Cantidad * detalle.Precio) AS Total FROM encabezado, detalle WHERE Fecha BETWEEN ? AND ? AND encabezado.Folio=detalle.Folio GROUP BY CONVERT(encabezado.Fecha,date), correoUsuario;', [date1 + " 00:00:00", date2 + " 23:59:59"], (err, rows) => {
                        if (err) throw err
                        rows.forEach(element => {
                            element.Fecha = element.Fecha.toLocaleString("es-MX", { month: 'long', day: '2-digit', year: 'numeric' })
                        });
                        console.log(rows);
                        conn.query('SELECT CONVERT(encabezado.Fecha,date) AS Fecha, SUM(detalle.Cantidad * detalle.Precio) AS Total FROM encabezado, detalle WHERE Fecha BETWEEN ? AND ? AND encabezado.Folio=detalle.Folio GROUP BY CONVERT(encabezado.Fecha,date);', [date1 + " 00:00:00", date2 + " 23:59:59"], (err, rowss) => {
                            rowss.forEach(element => {
                                element.Fecha = element.Fecha.toLocaleString("es-MX", { month: 'long', day: '2-digit', year: 'numeric' })
                            });
                            console.log(rows)
                            conn.query('SELECT SUM(detalle.Cantidad * detalle.Precio) AS Total FROM encabezado, detalle WHERE Fecha BETWEEN ? AND ? AND encabezado.Folio=detalle.Folio ', [date1 + " 00:00:00", date2 + " 23:59:59"], (err, total) => {
                                res.render('reVenta/periodo', { date1, date2, name: req.session.name, rows, date1, rowss, supertotal: total[0].Total })
                            })
                        })
                    })
                }
            })
        }else{
            res.render('home', {name: req.session.name,no:"No se puede acceder porque no tiene fecha, lo mas probable es que no pueda seleccionar la fecha por que no tiene pedidos realizados."})
        }
    } else {
        res.redirect('/')
    }
}

module.exports = {
    ventaFecha
}