const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));

app.post('/recibir-audio', (req, res) => {
    try {
        const { nombre, audioBase64 } = req.body;
        console.log(`Audio recibido de: ${nombre}`);
        
        res.status(200).json({ success: true, message: "Audio recibido correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
