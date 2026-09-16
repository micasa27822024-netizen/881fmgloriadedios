const express = require('express');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;

const app = express();

// Aumentamos el límite de tamaño porque los audios en base64 pesan un poquito más
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Configuración de Cloudinary (Tus datos oficiales de la cuenta)
cloudinary.config({
  cloud_name: 'porjzftqc',
  api_key: '934378492685536',
  api_secret: '**********' // <--- Haz clic en "Ver claves de API" en la pantalla de Cloudinary y cópiate este secreto
});

// Memoria temporal para guardar los saludos que vayan llegando
let buzonaudios = [];

// Endpoint para que la web de los oyentes envíe el audio
app.post('/enviar-audio', async (req, res) => {
    try {
        const { nombre, ubicacion, audioBase64 } = req.body;
        
        if (!audioBase64) {
            return res.status(400).json({ success: false, error: "No se encontró el audio" });
        }

        console.log(`Recibiendo audio de ${nombre} de ${ubicacion}...`);

        // Subimos el audio base64 directamente a Cloudinary
        const resultadoUpload = await cloudinary.uploader.upload(audioBase64, {
            resource_type: "video", // Cloudinary usa "video" tanto para archivos de video como de audio (.webm / .mp3)
            folder: "radio_saludos"
        });

        // Guardamos el objeto con el enlace seguro que nos devolvió Cloudinary
        const nuevoAudio = {
            id: Date.now(),
            nombre: nombre || "Anónimo",
            ubicacion: ubicacion || "Desconocida",
            urlAudio: resultadoUpload.secure_url,
            fecha: new Date().toLocaleTimeString()
        };

        buzonaudios.unshift(nuevoAudio); // Lo ponemos al principio de la lista

        res.status(200).json({ 
    success: true, 
    message: "Audio guardado con éxito en la nube", 
    url: resultadoUpload.secure_url // <--- Esto le devuelve la URL a la web
});
    } catch (error) {
        console.error("Error al subir a Cloudinary:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint para que la PC de la radio lea los saludos pendientes
app.get('/obtener-audios', (req, res) => {
    res.json(buzonaudios);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de la radio corriendo en el puerto ${PORT}`);
});
