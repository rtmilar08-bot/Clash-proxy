const express = require('express');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Setup Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Endpoint to fetch and store data
app.get('/fetch-and-store', async (req, res) => {
  const tag = req.query.tag;
  if (!tag) return res.status(400).json({ error: 'Missing tag parameter' });

  try {
    const response = await axios.get(`https://api.clashroyale.com/v1/players/${encodeURIComponent(tag)}`, {
      headers: {
        Authorization: `Bearer ${process.env.CR_API_KEY}`
      }
    });

    const data = response.data;

    // Save to Supabase (update with your actual table/column names)
    const { error } = await supabase
      .from('players')
      .insert([
        { tag: data.tag, name: data.name, trophies: data.trophies }
      ]);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
