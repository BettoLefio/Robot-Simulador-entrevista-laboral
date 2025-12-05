import { useEffect, useRef, useState } from 'react';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Listo para grabar');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('demo-user');

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      // Limpia tracks si el componente se desmonta
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError('');
      setTranscript('');
      setStatus('Solicitando micrófono...');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setStatus('Procesando audio...');
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await uploadAudio(blob);
        // liberar el stream
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setStatus('Grabando... habla ahora');
    } catch (err) {
      console.error(err);
      setError('No se pudo acceder al micrófono. Revisa permisos.');
      setStatus('Listo para grabar');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus('Grabación detenida, enviando...');
    }
  };

  const uploadAudio = async (blob) => {
    try {
      setStatus('Enviando audio al backend...');
      const formData = new FormData();
      formData.append('audio', blob, 'grabacion.webm');
      formData.append('userId', userId);

      const resp = await fetch(`${backendUrl}/api/audio/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        const errPayload = await resp.json().catch(() => ({}));
        throw new Error(errPayload.error || 'Error al procesar audio');
      }

      const data = await resp.json();
      setTranscript(data.transcript || '');
      setStatus('Transcripción recibida');
    } catch (err) {
      console.error('upload error', err);
      setError(err.message || 'Error subiendo audio');
      setStatus('Error');
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Robot de Práctica de Entrevistas (Demo Sprint 1)</h1>
        <p>Graba tu respuesta, la enviamos al backend y mostramos la transcripción.</p>
      </header>

      <section className="card">
        <label className="field">
          <span>Usuario (userId):</span>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="demo-user"
          />
        </label>

        <div className="controls">
          <button
            className={isRecording ? 'danger' : 'primary'}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? 'Detener' : 'Grabar'}
          </button>
          <div className={`mic-indicator ${isRecording ? 'on' : 'off'}`}>
            {isRecording ? 'Micrófono activo' : 'Micrófono inactivo'}
          </div>
        </div>

        <div className="status">
          <strong>Estado:</strong> {status}
        </div>

        {error && (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="transcript">
          <strong>Transcripción:</strong>
          <p>{transcript || 'Esperando tu audio...'}</p>
        </div>
      </section>
    </div>
  );
}

export default App;
