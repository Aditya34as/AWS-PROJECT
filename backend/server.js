const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

app.get('/api/message', (req, res) => {
  res.status(200).json({ message: 'Hello from Express Backend' });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
