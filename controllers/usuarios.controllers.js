import { Usuarios } from "../models/usuarios.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

/////api/v1/users/login
export const login = async (req, res) => {
    try {
        const { correoElectronico, contrasena } = req.body;
        //console.log( correoElectronico, contrasena);

        // Validar que los campos no estén vacíos antes de consultar la BD
        if (!correoElectronico || !contrasena) {
            return res.status(400).json({
                message: 'La contraseña y el correo son obligatorios',
                type: "error"
            });
        }

        //console.log(req.body);

        // Buscar usuario en la base de datos
        const user = await Usuarios.buscarUsuario(correoElectronico);
        console.log(user);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Comparar la contraseña proporcionada con la almacenada
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        if (!isMatch) {
            return res.status(400).json({ message: "Credenciales incorrectas" });
        }


     //   console.log(user.correo_electronico, user.id_usuario, user.id_tipo_usuario);

        const token = jwt.sign(
            { correo_electronico: user.correo_electronico, id_usuario: user.id_usuario, id_tipo_usuario: user.id_tipo_usuario }, // Asegúrate de incluir el correo

            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
      //  console.log(" Token generado:", token); //  Verifica que el token tenga datos


        // Enviar respuesta correcta
        return res.status(200).json({
            message: "Login exitoso",
            token
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({ error: error.message });
    }
};

//recibiremos los datos por el usuario en el frontend
///api/v1/users/registrarUsuario
export const registro = async (req, res) => {
    try {
      //  console.log("Datos recibidos:", req.body);
        //estos son los datos que llegan en el json
        const { nombre, correoElectronico, contrasena, fechaCracion, fechaActualizacion, idTipoTsuarios } = req.body;

        if (/\d/.test(nombre)) {
            return res.status(400).json({ message: "El nombre no debe contener números", severity: "error" });
        }

        // Verificar si el usuario ya existe
        const usuarioRegistrado = await Usuarios.buscarUsuario(correoElectronico);
        if (usuarioRegistrado) {
            return res.status(400).json({ message: "Correo ya registrado", severity: "error" });
        }

        // Crear un nuevo usuario con la contraseña encriptada
        const hashedContrasena = await bcrypt.hash(contrasena, 1);
        const nuevoUsuario = new Usuarios(nombre, correoElectronico, hashedContrasena, fechaCracion, fechaActualizacion, idTipoTsuarios);
        const usuarioGuardado = await nuevoUsuario.guardar();

        const token = jwt.sign({
            correo: nuevoUsuario._correoElectronico
        },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            })

        res.status(201).json({ message: "Usuario creado exitosamente", user: usuarioGuardado, estado: 201, token: token });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ error: error.message, type: "error", message: error, severity: "error" });
    }
};

//api/v1/users/atualizarUsuarios/:id
export const actualizarUsuario = async (req, res) => {
    try {
        let hashedContrasena = "";
        const { id } = req.params;
        const { nombre, correoElectronico, contrasena, fechaCreacion, fechaActualizacion, tipoUsuario } = req.body;

        //       console.log("Datos recibidos para actualizar:", req.body);
        //     console.log("Contraseña recibida:", contrasena);

        if (/\d/.test(nombre)) {
            return res.status(400).json({ message: "El nombre no debe contener números", severity: "error" });
        }

        // Verificar si el usuario ya existe
        const usuarioRegistrado = await Usuarios.buscarUsuario(correoElectronico);
        if (usuarioRegistrado) {
            return res.status(400).json({ message: "Correo ya registrado", severity: "error" });
        }


        if (!id) {
            return res.status(400).json({ message: "El ID del usuario es requerido", severity: "error" });
        }

        // Buscar si el usuario existe
        const usuarioExistente = await Usuarios.buscarUsuarioPorId(id);
        if (!usuarioExistente) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Mantener la contraseña existente si no se proporciona una nueva válida
        if (contrasena && contrasena.trim() !== "") {
            hashedContrasena = await bcrypt.hash(contrasena, 1);
        } else {
            hashedContrasena = undefined; // Mantiene la contraseña anterior
        }

        // Crear instancia del usuario actualizado
        const usuarioActualizado = new Usuarios(
            nombre,
            correoElectronico,
            hashedContrasena,
            fechaCreacion,
            fechaActualizacion,
            tipoUsuario
        );

        const resultado = await usuarioActualizado.actualizar(id);

        res.json({ message: "Usuario actualizado exitosamente", user: resultado });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ error: error.message, message: error, severity: "error" });
    }
};


/////api/v1/users/perfil
export const perfil = async (req, res) => {
    try {
        const user = await Usuarios.buscarUsuario(req.correo_electronico);
       // console.log(user);

        return res.json({ ok: true })
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: error.message });
    }
};

///api/v1/users/usuarios
export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuarios.listarUsuarios() // Llamar al método de la clase
        res.json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const obtenerUsuarioID = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarios = await Usuarios.buscarUsuarioPorId(id) // Llamar al método de la clase
        res.json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};



export const obtenerRoles = async (req, res) => {
    try {
        const roles = await Usuarios.buscarRoles() // Llamar al método de la clase
        res.json(roles);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


export const eliminarUsuario = async (req, res) => {
    try {

        //Como el dato se llama en la ruta, asi se tiene que llamar en el req.params
        const { id } = req.params;
     //   console.log(id);

        if (!id) {
            return res.status(400).json({ error: "Se requiere un ID de usuario" });
        }

        const usuarioEliminado = await Usuarios.eliminarUsuario(id);

        res.status(201).json({ message: "Usuario eliminado correctamente", usuario: usuarioEliminado,severity:"success" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message,severity:"error" });
    }
};