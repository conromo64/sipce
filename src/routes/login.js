const express = require('express');
const LoginController = require('../controllers/LoginController');
const adminController = require('../controllers/adminController.js');
const cocinaController = require('../controllers/cocinaController.js');
const cajaController = require('../controllers/cajaController')
const entregaController = require('../controllers/entregaController')
const reVentaController = require('../controllers/reportesVenta.js')
const rePErController = require('../controllers/reportesPersonal.js')
const reProController = require('../controllers/reportesProducto.js')
const upload = require('../middlewares/subirimg');
const update = require('../middlewares/editimg')

const router = express.Router();

///Son las redirecciones para que funcione el sistema //

// Redirreciones del logincontrollers //
router.get('/login', LoginController.index);
router.post('/entrar', LoginController.auth);
router.get('/logout', LoginController.logout);

// Redirreciones del admincontrollers //

router.get('/personal', adminController.tabla);
router.get('/altaPersonal', adminController.personal);
router.post('/registraPer', adminController.registraPerso)
router.get('/editar/:idUser', adminController.editar);
router.get('/elimina/:idUser', adminController.elimina);
router.post('/editar/:idUser', adminController.update);

router.get('/menu', adminController.prod);
router.get('/altaProducto', adminController.productos);
router.post('/registraMen', upload.single('image'), adminController.registraMenu);
router.get('/eliminaMen/:id_art', adminController.eliminaMen);
router.get('/editarMen/:id_art', adminController.editarMen);
router.post('/editarMen/:id_art', update.single('image'), adminController.updateMen);

router.get('/pedidoOrd/:folio', cocinaController.pedidoOrdenado)
router.get('/cambiarOrd/:folio', cocinaController.cambiarOrd)
router.get('/pedidoPre/:folio', cocinaController.pedidoPreparando)
router.get('/cambiarPre/:folio', cocinaController.cambiarPre)

router.get('/detallecaja/:folio', cajaController.resumen)
router.get('/qrcaja', cajaController.carqr)
router.get('/modificacaja/:folio', cajaController.cambiarLis)
router.get('/menucompra/:folio', cajaController.cargarmenu)
router.get('/agregan/:folio/:id/:precio', cajaController.agregarn)
router.get('/agregau/:folio/:id', cajaController.agregarus)

router.get('/modificaentrega/:folio', entregaController.detalle)
router.get('/entregalis/:folio',entregaController.actualiza)
router.get('/qrentrega', entregaController.entqr)

router.post('/ventaFecha', reVentaController.ventaFecha)

router.post('/repersonal', rePErController.personal)

router.post('/reprocto',reProController.productos)

router.get('/suspender',adminController.verbaja)

module.exports = router;