const request = require('supertest');
const app = require('../index');

// Mock dependencies
jest.mock('../config/speechToText', () => ({
    transcribeAudio: jest.fn().mockResolvedValue('transcripción de prueba')
}));

jest.mock('../config/firestore', () => ({
    saveTranscript: jest.fn().mockResolvedValue('doc-id-123')
}));

describe('POST /api/audio/upload', () => {
    it('should upload audio and return transcript', async () => {
        // Create a dummy buffer for the file
        const buffer = Buffer.from('dummy audio content');

        const res = await request(app)
            .post('/api/audio/upload')
            .field('userId', 'test-user')
            .attach('audio', buffer, 'test.webm');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('transcript', 'transcripción de prueba');
    });
});
