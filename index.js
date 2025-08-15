const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const CR_API_KEY = process.env.CR_API_KEY;

app.get('/battlelog', async (req, res) => {
  const { tag } = req.query;
  if (!tag) return res.status(400).send('Missing tag param');

  try {
    const response = await axios.get(`https://api.clashroyale.com/v1/players/%23${tag}/battlelog`, {
      headers: {
        Authorization: `Bearer ${CR_API_KEY}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).send('Failed to fetch battlelog');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
