import { Router } from "express";
import { obtenerFranquicias,obtenerTipoProducto,obtenerProducto, obtenerVenta,obtenerVentaId,registrarVenta,eliminarVenta,actualizarVenta,obtenerVentaIdList } from "../controllers/ventaProductos.controllers.js";
import { verificarToken } from "../middlewares/jwt.middlwares.js"

const router = Router();

router.use(verificarToken)

router.get('/franquicia', obtenerFranquicias)
router.get('/tipoProducto', obtenerTipoProducto)
router.get('/producto', obtenerProducto)
router.get('/venta', obtenerVenta)
router.get('/venta/:id',obtenerVentaId )
router.get('/ventaId/:id',obtenerVentaIdList )
router.post('/venta',registrarVenta )
router.put('/venta/:id',actualizarVenta )
router.delete('/venta/:id',eliminarVenta )
export default router;