import 'dotenv/config';
import express from "express";
import UserRouters from './routes/usuarios.routes.js';
import ventaProductoRouters from './routes/ventaProductos.routes.js';
import cors from "cors";
import axios from 'axios'; // Importa axios para hacer la petición a hCaptcha

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', // Solo permite este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/api/v1/users", UserRouters);
app.use("/api/v1/venProc", ventaProductoRouters);

// Nueva ruta para verificar hCaptcha
app.post('/verify-hcaptcha', async (req, res) => {
    const { token } = req.body;
    const secretKey = process.env.HCAPTCHA_SECRET_KEY; // Obtiene la clave secreta de las variables de entorno

    if (!secretKey) {
        return res.status(500).json({ success: false, error: 'Clave secreta de hCaptcha no configurada.' });
    }

    try {
        const response = await axios.post(
            'https://api.hcaptcha.com/siteverify',
            new URLSearchParams({
                secret: secretKey,
                response: token,
            })
        );

        if (response.data.success) {
            res.json({ success: true });
        } else {
            res.json({ success: false, errors: response.data['error-codes'] });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));