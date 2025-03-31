import { Router } from "express";
import { registro, login, perfil,obtenerUsuarios,eliminarUsuario,actualizarUsuario, obtenerRoles,obtenerUsuarioID } from "../controllers/usuarios.controllers.js";
import { verificarToken } from "../middlewares/jwt.middlwares.js"

const router = Router();
//colocar verificarToken en todos menos ene le login
router.post('/registrarUsuario', verificarToken,registro)
router.post('/login', login)
router.get('/perfil', verificarToken, perfil)
router.get('/usuarios',verificarToken, obtenerUsuarios)
router.get('/roles',verificarToken, obtenerRoles)
router.get('/usuario/:id',verificarToken, obtenerUsuarioID)
router.delete("/usuarios/:id", verificarToken,eliminarUsuario);
router.put("/atualizarUsuarios/:id", verificarToken,actualizarUsuario); 

export default router;