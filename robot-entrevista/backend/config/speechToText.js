// config/speechToText.js
// Cliente de Google Speech-to-Text para transcribir audio WebM/Opus (MediaRecorder).
const { SpeechClient } = require('@google-cloud/speech');

const projectId = process.env.PROJECT_ID;
const speechClient = new SpeechClient({ projectId });

/**
 * Transcribe un buffer de audio usando Speech-to-Text.
 * Asumimos WebM/Opus desde el frontend (MediaRecorder).
 * @param {Buffer} audioBuffer
 * @returns {Promise<string>} transcripción limpia
 */
async function transcribeAudio(audioBuffer) {
  if (!audioBuffer) throw new Error('audioBuffer is required');

  const audio = {
    content: audioBuffer.toString('base64'),
  };

  const config = {
    languageCode: process.env.STT_LANGUAGE || 'es-CL',
    enableAutomaticPunctuation: true,
    encoding: 'WEBM_OPUS',
  };

  const request = { audio, config };
  const [response] = await speechClient.recognize(request);
  const transcription =
    response.results
      ?.map((result) => result.alternatives?.[0]?.transcript || '')
      .join(' ')
      .trim() || '';

  return transcription;
}

module.exports = {
  transcribeAudio,
};
