// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globales
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
const healthRouter = require('./routes/health');
const audioRouter = require('./routes/audio');
const dialogflowRouter = require('./routes/dialogflowWebhook');

app.use('/', healthRouter);
app.use('/api', audioRouter);
app.use('/api', dialogflowRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
}

module.exports = app;
