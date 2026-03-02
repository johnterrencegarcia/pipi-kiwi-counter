const express = require('express');
const app = express();
app.use(express.json());

let latest = {
  username: "Unknown",
  pipi_kiwi_count: 0,
  status: "Waiting...",
  time: ""
};

app.post('/update', (req, res) => {
  latest = req.body;
  latest.time = new Date().toLocaleString();
  console.log('Update received:', latest);
  res.json({ ok: true });
});

app.get('/data', (req, res) => res.json(latest));

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Abdul's Pipi Kiwi Counter 🌊</title>
  <style>
    body { font-family: Arial, sans-serif; background:#0d1117; color:#c9d1d9; text-align:center; padding:40px; margin:0; }
    h1 { color:#58a6ff; margin-bottom:10px; }
    .container { max-width:600px; margin:auto; background:rgba(0,0,0,0.5); padding:30px; border-radius:15px; }
    .username { font-size:1.4em; color:#ffd54f; margin-bottom:15px; }
    .count { font-size:5em; font-weight:bold; color:#3fb950; margin:20px 0; text-shadow:0 0 15px #3fb950; }
    .status { font-size:1.6em; padding:15px; border-radius:8px; display:inline-block; }
    .green { background:#1f6e3c; } .red { background:#6e1f3c; }
    .time { color:#b0bec5; font-size:0.9em; margin-top:30px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Pipi Kiwi Counter 🌊</h1>
    <div class="username">Player: <span id="user">Loading...</span></div>
    <div class="count" id="count">0</div>
    <div id="status" class="status red">Waiting...</div>
    <div class="time">Last update: <span id="time">--</span></div>
  </div>

  <script>
    async function update() {
      try {
        const r = await fetch('/data');
        const d = await r.json();
        document.getElementById('user').textContent = d.username;
        document.getElementById('count').textContent = d.pipi_kiwi_count;
        const st = document.getElementById('status');
        st.textContent = d.status;
        st.className = 'status ' + (d.pipi_kiwi_count > 0 ? 'green' : 'red');
        document.getElementById('time').textContent = d.time || '--';
      } catch(e) { console.error(e); }
    }
    update(); setInterval(update, 5000);
  </script>
</body>
</html>
  `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
