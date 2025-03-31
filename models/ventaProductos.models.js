import { POOL } from "../database/database.js";

export class ventaProductos {
    constructor(idUsuario, idTipoProducto, idFranquicia, cupo, tasa, fechaVenta, fechaVentaActualizada, idUsuarioActualizado, idVenta) {

        this._idUsuario = idUsuario;
        this._idTipoProducto = idTipoProducto;
        this._idFranquicia = idFranquicia;
        this._cupo = cupo;
        this._tasa = tasa;
        this._fechaVenta = fechaVenta;
        this._fechaVentaActualizada = fechaVentaActualizada;
        this._idUsuarioActualizado = idUsuarioActualizado;
        this._idVenta = idVenta;

    }

    async guardarVenta() {

        try {
            if (this._tasa==''||this._tasa==null||this._tasa==undefined) {
                this._tasa='00.00';
            }
            const result = await POOL.query(
                "SELECT insertar_venta($1, $2, $3, $4, $5, $6)",
                [this._cupo, this._tasa, this._idTipoProducto, this._idFranquicia, this._fechaVenta, this._idUsuario]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error al guardar la venta ", error);
            throw new Error("No se pudo registrar la venta ");
        }

    }

    async actualizarVenta(id) {

        try {
           /* console.log("datooo", id,
                this._cupo,
                this._tasa,
                this._idTipoProducto,
                this._idFranquicia,
                this._fechaVenta,
                this._idUsuario,
                this._idUsuarioActualizado,
                this._fechaVentaActualizada);*/

                if (this._tasa==''||this._tasa==null||this._tasa==undefined) {
                    this._tasa='00.00';
                }

            const result = await POOL.query(
                `
                                SELECT actualizar_venta(
                                    $1,            -- p_id_venta -> ID de la venta a actualizar
                                    $2,      -- p_cupo -> Nuevo cupo del producto (VARCHAR)
                                    $3,          -- p_tasa -> Nueva tasa del producto (NUMERIC)
                                    $4,            -- p_id_tipo_producto -> Nuevo ID del tipo de producto (INT)
                                    $5,            -- p_id_franquicia -> Nuevo ID de la franquicia (INT)
                                    $6, -- p_fecha_venta -> Nueva fecha de la venta (TIMESTAMP)
                                    $7,            -- p_id_usuario_venta -> ID del usuario que hizo la venta (INT)
                                    $8,           -- p_id_usuario_actualizacion -> ID del usuario que actualiza la venta (INT)
                                    $9  -- p_fecha_actualizacion -> Fecha y hora de la actualización (TIMESTAMP)
                                );
                                `,
                   [id,
                    this._cupo,
                    this._tasa,
                    this._idTipoProducto,
                    this._idFranquicia,
                    this._fechaVenta,
                    this._idUsuario,
                    this._idUsuarioActualizado,
                    this._fechaVentaActualizada]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error al guardar la venta ", error);
            throw new Error("No se pudo registrar la venta ");
        }

    }


    // Método para eliminar un usuario por ID
    static async eliminarVenta(id) {
        try {
            const result = await POOL.query("DELETE FROM venta WHERE id_venta = $1 RETURNING *", [id]);

            if (result.rowCount === 0) {
                throw new Error("venta no encontrado");
            }

            return result.rows[0]; // Retorna el usuario eliminado
        } catch (error) {
            console.error("Error al eliminar la venta", error);
            throw new Error("No se pudo eliminar la venta");
        }
    }

    static async buscarFranquicia() {
        try {
            const result = await POOL.query("select * from franquicia");
            return result.rows; // Retorna los usuarios obtenidos
        } catch (error) {
            console.error("Error al obtener las franquicias", error);
            throw new Error("No se pudo obtener la lista de franquicias");
        }
    }

    static async buscarTipoProducto() {
        try {
            const result = await POOL.query("select * from tipo_producto");
            return result.rows; // Retorna los usuarios obtenidos
        } catch (error) {
            console.error("Error al obtener los tipo_producto", error);
            throw new Error("No se pudo obtener la lista de tipo producto");
        }
    }

    static async buscarProducto() {
        try {
            const result = await POOL.query("select * from producto");
            return result.rows; // Retorna los usuarios obtenidos
        } catch (error) {
            console.error("Error al obtener los productos", error);
            throw new Error("No se pudo obtener la lista de productos");
        }
    }

    static async buscarVenta(idUsuario, idTipoUsuario) {
        try {

           // console.log("idUsuario", idUsuario, "idTipoUsuario", idTipoUsuario);

            let result;
            if (idTipoUsuario === 1) {
                result = await POOL.query(`SELECT 
                    v.id_venta,
                    t.tipo_producto,
                    p.cupo,
                    v.fecha_venta,
                    u.nombre
                    FROM venta as v
                    INNER JOIN producto as p ON v.id_producto = p.id_producto
                    INNER JOIN tipo_producto as t ON t.id_tipo_producto = p.id_tipo_producto
                    INNER JOIN usuario as u ON v.id_usuario = u.id_usuario;`);
            } else {
                result = await POOL.query(`SELECT 
                    v.id_venta,
                    t.tipo_producto,
                    p.cupo,
                    v.fecha_venta,
                    u.nombre
                    FROM venta as v
                    INNER JOIN producto as p ON v.id_producto = p.id_producto
                    INNER JOIN tipo_producto as t ON t.id_tipo_producto = p.id_tipo_producto
                    INNER JOIN usuario as u ON v.id_usuario = u.id_usuario 
					where u.id_usuario = ${idUsuario};`);
            }

            return result.rows; // Retorna los usuarios obtenidos
        } catch (error) {
            console.error("Error al obtener los productos", error);
            throw new Error("No se pudo obtener la lista de productos");
        }
    }


    static async buscarVentaId(id) {
        try {
            const result = await POOL.query(`SELECT 
                                            *
                                            FROM venta as v
                                             where v.id_venta =${id};`);
            return result.rows; // Retorna los usuarios obtenidos
        } catch (error) {
            console.error("Error al obtener la venta", error);
            throw new Error("No se pudo obtener la venta");
        }
    }



    static async buscarVentaIdList(id) {
        try {
            const result = await POOL.query(`SELECT 
                                                v.id_venta,
                                                t.tipo_producto,
                                                p.cupo,
                                                p.tasa,
                                                v.fecha_venta,
                                                
                                                -- Asesor de la venta
                                                u.nombre AS asesorVenta,

                                                -- Fecha de actualización
                                                a.fecha_actalizada,

                                                -- Asesor que actualizó la venta
                                                us.nombre AS asesorActualizado,

                                                f.franquicia,
                                                v.id_usuario,
                                                v.id_producto,
                                                v.id_actualizacion_venta,
                                                a.fecha_actalizada,  -- Esta columna está repetida, puedes eliminar una de las dos
                                                a.id_usuario AS idUsuarioActualizar,
                                                p.id_tipo_producto,
                                                p.id_franquicia

                                            FROM venta AS v
                                            INNER JOIN producto AS p 
                                                ON v.id_producto = p.id_producto
                                            INNER JOIN franquicia AS f 
                                                ON f.id_franquicia = p.id_franquicia
                                            INNER JOIN tipo_producto AS t 
                                                ON t.id_tipo_producto = p.id_tipo_producto
                                            INNER JOIN usuario AS u 
                                                ON v.id_usuario = u.id_usuario 
                                            LEFT JOIN actualizacion_venta AS a 
                                                ON v.id_actualizacion_venta = a.id_actualizacion_venta
                                            LEFT JOIN usuario AS us 
                                                ON a.id_usuario = us.id_usuario where v.id_venta=${id}`);
            return result.rows; // Retorna los usuarios obtenidos
        } catch (error) {
            console.error("Error al obtener la venta", error);
            throw new Error("No se pudo obtener la venta");
        }
    }
}






