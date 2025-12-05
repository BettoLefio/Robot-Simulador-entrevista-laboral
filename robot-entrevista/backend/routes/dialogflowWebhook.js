// routes/dialogflowWebhook.js
// Webhook básico para Dialogflow CX (stub inicial).
const express = require('express');
const router = express.Router();

// POST /api/dialogflow/webhook
router.post('/dialogflow/webhook', (req, res) => {
  // Por ahora respondemos estático; se conectará al flujo real en sprints siguientes.
  const replyText = 'Webhook recibido. Próxima iteración: lógica del flujo pedagógico.';
  res.json({
    fulfillment_response: {
      messages: [
        {
          text: {
            text: [replyText],
          },
        },
      ],
    },
  });
});

module.exports = router;
