const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Signing Bee backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
