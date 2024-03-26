function personal(req, res) {
    if (req.session.rol == 1) {
        data = req.body
        const selecre = data.SelecReportePersonal
        if ((data.fecha1 != undefined || (data.periodo1 != undefined && data.periodo2 != undefined)) && (selecre == "co" || selecre == "ca" || selecre == "en")){
            req.getConnection((err, conn) => {
                if (data.fecha1) {
                    const date1 = data.fecha1
                    if (selecre == "co"){
                        conn.query('SELECT idUser, Nombre, COUNT(encabezado.Folio) as Total FROM users, encabezado WHERE users.idUser=id_empleado_cocina AND Fecha BETWEEN ? AND ? GROUP BY idUser;',[date1 + " 00:00:00",date1 + " 23:59:59"],(err,rows)=>{
                            res.render('rePersonal/feCocina',{date1,name:req.session.name, rows})
                        })
                    }else if(selecre == "ca"){
                        conn.query('SELECT idUser, Nombre, COUNT(encabezado.Folio) as Total FROM users, encabezado WHERE users.idUser=id_empleado_caja AND Fecha BETWEEN ? AND ? GROUP BY idUser;',[date1 + " 00:00:00",date1 + " 23:59:59"],(err,rows)=>{
                            res.render('rePersonal/feCaja',{date1,name:req.session.name, rows})
                        })
                    }else if(selecre == "en"){
                        conn.query('SELECT idUser, Nombre, COUNT(encabezado.Folio) as Total FROM users, encabezado WHERE users.idUser=id_empleado_entrega AND Fecha BETWEEN ? AND ? GROUP BY idUser;',[date1 + " 00:00:00",date1 + " 23:59:59"],(err,rows)=>{
                            res.render('rePersonal/feCaja',{date1,name:req.session.name, rows})
                        })
                    }
                } else {
                    const date1 = data.periodo1
                    const date2 = data.periodo2
                    if (selecre == "co"){
                        conn.query('SELECT idUser, Nombre, COUNT(encabezado.Folio) as Total FROM users, encabezado WHERE users.idUser=id_empleado_cocina AND Fecha BETWEEN ? AND ? GROUP BY idUser;',[date1 + " 00:00:00",date2 + " 23:59:59"],(err,rows)=>{
                            res.render('rePersonal/peCocina',{date1,date2,name:req.session.name, rows})
                        })
                    }else if(selecre == "ca"){
                        conn.query('SELECT idUser, Nombre, COUNT(encabezado.Folio) as Total FROM users, encabezado WHERE users.idUser=id_empleado_caja AND Fecha BETWEEN ? AND ? GROUP BY idUser;',[date1 + " 00:00:00",date2 + " 23:59:59"],(err,rows)=>{
                            res.render('rePersonal/peCaja',{date1,date2,name:req.session.name, rows})
                        })
                    }else if(selecre == "en"){
                        conn.query('SELECT idUser, Nombre, COUNT(encabezado.Folio) as Total FROM users, encabezado WHERE users.idUser=id_empleado_entrega AND Fecha BETWEEN ? AND ? GROUP BY idUser;',[date1 + " 00:00:00",date2 + " 23:59:59"],(err,rows)=>{
                            res.render('rePersonal/peCaja',{date1,date2,name:req.session.name, rows})
                        })
                    }
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
    personal
}