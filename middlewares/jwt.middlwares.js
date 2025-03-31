import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
    let token = req.headers.authorization;
   // console.log(" Token recibido en el middleware:", token); // 🔍 Verifica si el token llega
    if (!token) {
        return res.status(401).json({ error: "No hay token en la petición" });
    }
    // Si el token usa el formato "Bearer token_aquí", lo limpiamos
    if (token.startsWith("Bearer ")) {
        token = token.slice(7).trim();
    }
    //  console.log(" Token después de limpiar:", token); 
    try {
        const { correo_electronico,id_usuario,id_tipo_usuario } = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Payload decodificado:", correo_electronico,id_usuario,id_tipo_usuario); 
         
        req.correo_electronico = correo_electronico;
        req.id_usuario=id_usuario
        req.id_tipo_usuario=id_tipo_usuario

        //  console.log("req.correoElectronico", req.correo_electronico);
        next();
    } catch (error) {
      //  console.error("Error al verificar el token:", error);
        return res.status(401).json({ error: "Token inválido" });
    }
};
