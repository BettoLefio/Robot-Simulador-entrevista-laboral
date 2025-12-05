// config/firestore.js
// Inicializa Firestore usando las credenciales definidas por GOOGLE_APPLICATION_CREDENTIALS
// y expone helpers mínimos para guardar transcripciones de entrevistas.
const { Firestore, Timestamp } = require('@google-cloud/firestore');

let dbInstance;

function getDb() {
  if (dbInstance) return dbInstance;

  const projectId = process.env.PROJECT_ID;
  dbInstance = new Firestore({
    projectId,
    // Las credenciales se leen de GOOGLE_APPLICATION_CREDENTIALS (ruta al JSON de servicio)
  });

  return dbInstance;
}

/**
 * Guarda una transcripción en la colección "entrevistas".
 * @param {Object} payload
 * @param {string} payload.userId
 * @param {string} payload.textoTranscrito
 * @param {Object} payload.metadata Opcional (ej: intent, origen, etc.)
 */
async function saveTranscript({ userId, textoTranscrito, metadata = {} }) {
  const db = getDb();
  const docRef = db.collection('entrevistas').doc();

  const data = {
    userId: userId || 'anon',
    textoTranscrito: textoTranscrito || '',
    metadata,
    timestamp: Timestamp.now(),
  };

  await docRef.set(data);
  return { id: docRef.id, ...data };
}

module.exports = {
  getDb,
  saveTranscript,
};
