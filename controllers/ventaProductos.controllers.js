import { ventaProductos } from "../models/ventaProductos.models.js";
import dotenv from "dotenv";
dotenv.config();



export const registrarVenta = async (req, res) => {
    try {
        console.log("Datos recibidos:", req.body);

        // Extraer los datos del JSON de la solicitud
        const { cupo, tasa, idTipoProducto, idFranquicia, fechaVenta, idUsuario } = req.body;

        let miles = /^(\d{1,3}(\.\d{3})+)$/;

        if (!miles.test(cupo)) {
            return res.status(400).json({ 
                message: "El cupo debe tener el formato de miles correcto, ej: 1.000.000", 
                severity: "error" 
            });
        }
        // Si el usuario ingresó algo como "1a00.000", esto lo captura.
        let noLetras=/^[0-9.]+$/
        if (!noLetras.test(cupo)) {
            return res.status(400).json({ 
                message: "No se permiten letras ni caracteres especiales en el cupo. Solo se aceptan números y puntos.", 
                severity: "error" 
            });
        }
        
        if (idTipoProducto == 1 || idTipoProducto == 2) {
            let cara=/^\d{2}\.\d{2}$/
            if (!cara.test(tasa)) {
                return res.status(400).json({ message: "La tasa debe de gurdarse con 4 caracteres 2 numeros y 2 decimales ej: 10.58", severity: "error" });
            }
       
        }

     
        // Validaciones básicas
        if (!cupo || !idTipoProducto || !idFranquicia || !fechaVenta || !idUsuario) {
            return res.status(400).json({ message: "Todos los campos son obligatorios", severity: "error" });
        }

        // Crear una nueva instancia de la venta

        const nuevaVenta = new ventaProductos(idUsuario, idTipoProducto, idFranquicia, cupo, tasa, fechaVenta, "", "", "");

        console.log('TASA',tasa);
        
        // Guardar la venta en la base de datos
        const ventaGuardada = await nuevaVenta.guardarVenta();

        res.status(201).json({ message: "Venta registrada exitosamente.", venta: ventaGuardada, estado: 201 });
    } catch (error) {
        console.error("Error al registrar la venta:", error);
        res.status(500).json({ error: error.message, type: "error" });
    }
};


export const actualizarVenta = async (req, res) => {
    try {
        //console.log("Datos recibidos:", req.body);

        const { id } = req.params;

        // console.log("IDD", id);

        // Extraer los datos del JSON de la solicitud
        const { idVenta, cupo, tasa, idTipoProducto, idFranquicia, fechaVenta, idUsuarioVenta, idUsuarioActualizacion, fechaActualizacion } = req.body;
       
        let miles = /^(\d{1,3}(\.\d{3})+)$/;

        if (!miles.test(cupo)) {
            return res.status(400).json({ 
                message: "El cupo debe tener el formato de miles correcto, ej: 1.000.000", 
                severity: "error" 
            });
        }
        
        
        // Verificar que no haya caracteres no numéricos (excepto puntos)
        if (!/^\d+(\.\d{3})*$/.test(cupo)) {
            return res.status(400).json({ 
                message: "No se permiten letras ni caracteres especiales en el cupo. Solo se aceptan números y puntos.", 
                severity: "error" 
            });
        }
        
        if (idTipoProducto == 1 || idTipoProducto == 2) {
            if (!/^\d{2}\.\d{2}$/.test(tasa)) {
                return res.status(400).json({ message: "La tasa debe de gurdarse con 4 caracteres 2 numeros y 2 decimales ej: 10.58", severity: "error" });
            }
       
        }
        // Validaciones básicas
        if (!idVenta || !cupo  || !idTipoProducto || !idFranquicia || !fechaVenta || !idUsuarioVenta || !idUsuarioActualizacion || !fechaActualizacion) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Crear una nueva instancia de la venta

        const actualizarVenta = new ventaProductos(idUsuarioVenta, idTipoProducto, idFranquicia, cupo, tasa, fechaVenta, fechaActualizacion, idUsuarioActualizacion, id);

        // Guardar la venta en la base de datos
        const venta = await actualizarVenta.actualizarVenta(id)

        res.status(201).json({ message: "Venta actualizada exitosamente", venta: venta, estado: 201 });
    } catch (error) {
        console.error("Error al registrar la venta:", error);
        res.status(500).json({ error: error.message, type: "error" });
    }
};


export const eliminarVenta = async (req, res) => {
    try {

        //Como el dato se llama en la ruta, asi se tiene que llamar en el req.params
        const { id } = req.params;
        console.log(id);

        if (!id) {
            return res.status(400).json({ error: "Se requiere un ID de venta" });
        }

        const Eliminado = await ventaProductos.eliminarVenta(id)

        res.status(201).json({ message: "Venta eliminado correctamente", usuario: Eliminado });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export const obtenerFranquicias = async (req, res) => {
    try {
        const franquicia = await ventaProductos.buscarFranquicia() // Llamar al método de la clase
        res.json(franquicia);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const obtenerTipoProducto = async (req, res) => {
    try {
        const franquicia = await ventaProductos.buscarTipoProducto() // Llamar al método de la clase
        res.json(franquicia);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const obtenerProducto = async (req, res) => {
    try {
        const franquicia = await ventaProductos.buscarProducto() // Llamar al método de la clase
        res.json(franquicia);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


export const obtenerVenta = async (req, res) => {
    try {
        const franquicia = await ventaProductos.buscarVenta(req.id_usuario, req.id_tipo_usuario) // Llamar al método de la clase
        res.json(franquicia);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


export const obtenerVentaId = async (req, res) => {
    try {

        //Como el dato se llama en la ruta, asi se tiene que llamar en el req.params
        const { id } = req.params;
        console.log(id);

        if (!id) {
            return res.status(400).json({ error: "Se requiere un ID" });
        }

        const venta = await ventaProductos.buscarVentaId(id)

        res.status(201).json({ message: "Venta encontrada", usuario: venta });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const obtenerVentaIdList = async (req, res) => {
    try {

        //Como el dato se llama en la ruta, asi se tiene que llamar en el req.params
        const { id } = req.params;
        console.log(id);

        if (!id) {
            return res.status(400).json({ error: "Se requiere un ID" });
        }

        const venta = await ventaProductos.buscarVentaIdList(id)

        res.json(venta);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};