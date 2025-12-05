// routes/audio.js
// Maneja subida de audio, transcripción y guardado en Firestore.
const express = require('express');
const multer = require('multer');
const { transcribeAudio } = require('../config/speechToText');
const { saveTranscript } = require('../config/firestore');

const router = express.Router();

// Almacenamiento en memoria para obtener buffer directamente
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/audio/upload
router.post('/audio/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const userId = req.body.userId || 'anon';
    const audioBuffer = req.file.buffer;

    const transcript = await transcribeAudio(audioBuffer);
    await saveTranscript({
      userId,
      textoTranscrito: transcript,
      metadata: { source: 'audio-upload' },
    });

    res.json({ transcript });
  } catch (error) {
    console.error('Error processing audio upload:', error);
    res.status(500).json({ error: 'Failed to process audio' });
  }
});

module.exports = router;
