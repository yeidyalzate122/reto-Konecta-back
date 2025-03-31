import { POOL } from "../database/database.js";

export class Usuarios {
    constructor(nombre, correoElectronico, contrasena, fechaCracion, fechaActualizacion, idTipoTsuarios) {
        this._nombre = nombre;
        this._correoElectronico = correoElectronico;
        this._contrasena = contrasena
        this._fechaCracion = fechaCracion
        this._fechaActualizacion = fechaActualizacion
        this._idTipoTsuarios = idTipoTsuarios
    }
    //MEtodo para guardar a los usuarios
    async guardar() {

        try {
            //  console.log("datooo",this._nombre, this._correoElectronico, hashedContrasena, this._fechaCracion, this._fechaActualizacion, this._idTipoTsuarios);
            const result = await POOL.query(
                "INSERT INTO usuario (nombre, correo_electronico,contrasena,fecha_cracion,fecha_actualizacion,id_tipo_usuario) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
                [this._nombre, this._correoElectronico, this._contrasena, this._fechaCracion, this._fechaActualizacion, this._idTipoTsuarios]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error al guardar usuario:", error);
            throw new Error("No se pudo registrar el usuario");
        }

    }

    // Método para listar todos los usuarios
    static async listarUsuarios() {
        try {
            const result = await POOL.query(`SELECT 
                            u.id_usuario,
                            u.nombre,
                            u.correo_electronico,
                            u.fecha_cracion,
                            u.fecha_actualizacion,
                            t.tipo_usuario
                            FROM usuario u
                            INNER JOIN tipo_usuario as t ON u.id_tipo_usuario = t.id_tipo_usuario`);
            return result.rows; // Retorna los usuarios obtenidos
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            throw new Error("No se pudo obtener la lista de usuarios");
        }
    }


    // Método para actualizar un usuario
    async actualizar(id) {
        try {
          //  console.log("datooo", this._contrasena);
            let result;

            if (this._contrasena == undefined) {
               // console.log("LLEGUEEEEEEE");
                result = await POOL.query(
                    "UPDATE usuario SET nombre = $1, correo_electronico = $2,fecha_cracion=$3, fecha_actualizacion = $4, id_tipo_usuario = $5 WHERE id_usuario = $6 RETURNING *",
                    [this._nombre, this._correoElectronico, this._fechaCracion, this._fechaActualizacion, this._idTipoTsuarios, id]
                );

            } else {
              //  console.log("CAMBIEEE");
                
                result = await POOL.query(
                    "UPDATE usuario SET nombre = $1, correo_electronico = $2, contrasena = $3,fecha_cracion=$4, fecha_actualizacion = $5, id_tipo_usuario = $6 WHERE id_usuario = $7 RETURNING *",
                    [this._nombre, this._correoElectronico, this._contrasena, this._fechaCracion, this._fechaActualizacion, this._idTipoTsuarios, id]
                );

            }


            if (result.rowCount === 0) {
                throw new Error("Usuario no encontrado");
            }

            return result.rows[0]; // Retorna el usuario actualizado
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);

        }
    }

    static async buscarUsuarioPorId(id) {
        try {
            const result = await POOL.query("SELECT * FROM usuario WHERE id_usuario = $1", [id]);
            return result.rows[0] || null; // Retorna el usuario si existe, sino null
        } catch (error) {
            console.error("Error al buscar usuario por ID:", error);
            throw new Error("No se pudo buscar el usuario");
        }
    }


    static async buscarUsuario(nombreUsuario) {
        const result = await POOL.query("SELECT * FROM usuario WHERE correo_electronico = $1", [nombreUsuario]);
        return result.rows[0];
    }


    static async buscarRoles() {
        try {
            const result = await POOL.query("SELECT * FROM tipo_usuario");
            return result.rows; // Retorna los usuarios obtenidos
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            throw new Error("No se pudo obtener la lista de usuarios");
        }
    }

    // Método para eliminar un usuario por ID
    static async eliminarUsuario(id) {
        try {
            const result = await POOL.query("DELETE FROM usuario WHERE id_usuario = $1 RETURNING *", [id]);

            if (result.rowCount === 0) {
                throw new Error("Usuario no encontrado");
            }

            return result.rows[0]; // Retorna el usuario eliminado
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            throw new Error("No se pudo eliminar el usuario, tiene ventas asociadas.");
        }
    }


}
