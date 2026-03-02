const express = require('express');
const app = express();
app.use(express.json());

// Store data for multiple Roblox accounts
let accounts = new Map();

// All Brainrot data with rarities and incomes
const BRAINROT_DATA = {
  common: [
    { name: "Noobini Cakenini", income: 2, icon: "🎂" },
    { name: "Lirili Larila", income: 4, icon: "🐘" },
    { name: "Tim Cheese", income: 6, icon: "🧀" },
    { name: "Frulli Frulla", income: 7, icon: "🍹" },
    { name: "Talpa Di Fero", income: 9, icon: "⛏️" },
    { name: "Svinino Bombondino", income: 11, icon: "🐷" },
    { name: "Pipi Kiwi", income: 13, icon: "🥝" },
    { name: "Pipi Corni", income: 15, icon: "🌽" }
  ],
  uncommon: [
    { name: "Trippi Troppi", income: 20, icon: "🦐" },
    { name: "Gangster Footera", income: 30, icon: "🦶" },
    { name: "Bobrito Bandito", income: 35, icon: "🦦" },
    { name: "Boneca Ambalabu", income: 40, icon: "🎭" },
    { name: "Cacto Hipopotamo", income: 50, icon: "🌵" },
    { name: "Ta Ta Ta Sahur", income: 60, icon: "🥁" },
    { name: "Tric Tric Baraboom", income: 70, icon: "💥" },
    { name: "67", income: 90, icon: "🔢" },
    { name: "Pipi Avocado", income: 120, icon: "🥑" }
  ],
  rare: [
    { name: "Cappuccino Assassino", income: 100, icon: "☕" },
    { name: "Brr Brr Patapim", income: 120, icon: "🌲" },
    { name: "Trulimero Trulicina", income: 135, icon: "🎪" },
    { name: "Bambini Crostini", income: 150, icon: "🥖" },
    { name: "Bananita Dolphinita", income: 170, icon: "🐬" },
    { name: "Perochello Lemonchello", income: 190, icon: "🍋" },
    { name: "Avocadini Guffo", income: 210, icon: "🦉" },
    { name: "Salamino Penguino", income: 229, icon: "🐧" },
    { name: "Penguino Cocosino", income: 250, icon: "🥥" },
    { name: "Ti Ti Ti Sahur", income: 275, icon: "🎵" }
  ],
  epic: [
    { name: "Burbaloni Luliloli", income: 290, icon: "🍭" },
    { name: "Chimpanzini Bananini", income: 475, icon: "🍌" },
    { name: "Ballerina Cappuccina", income: 550, icon: "☕" },
    { name: "Chef Crabracadabra", income: 625, icon: "🦀" },
    { name: "Lionel Cactuseli", income: 700, icon: "🦁" },
    { name: "Glorbo Fruttodrillo", income: 775, icon: "🐊" },
    { name: "Blueberrinni Octopussini", income: 850, icon: "🐙" },
    { name: "Strawberrelli Flamingelli", income: 925, icon: "💃" },
    { name: "Pandaccini Bananini", income: 1000, icon: "🐼" },
    { name: "Sigma Boy", income: 1100, icon: "🐺" },
    { name: "Pi Pi Watermelon", income: 1200, icon: "🍉" },
    { name: "Cocosini Mama", income: 1300, icon: "👩" },
    { name: "Guesto Angelic", income: 1400, icon: "👼" }
  ],
  legendary: [
    { name: "Frigo Camelo", income: 1500, icon: "🐪" },
    { name: "Orangutini Ananasini", income: 1700, icon: "🦧" },
    { name: "Rhino Toasterino", income: 1900, icon: "🦏" },
    { name: "Bombardiro Crocodilo", income: 2100, icon: "🐊" },
    { name: "Spioniro Golubiro", income: 2290, icon: "🕊️" },
    { name: "Bombombini Gusini", income: 2600, icon: "💣" },
    { name: "Zibra Zubra Zibralini", income: 2900, icon: "🦓" },
    { name: "Tigrilini Watermelini", income: 3200, icon: "🐯" },
    { name: "Cavallo Virtuoso", income: 3500, icon: "🎻" },
    { name: "Gorillo Watermelondrillo", income: 4000, icon: "🦍" },
    { name: "Avocadorilla", income: 4500, icon: "🥑" },
    { name: "Eaglucci Cocosucci", income: 4700, icon: "🦅" },
    { name: "Ganganzelli Trulala", income: 5000, icon: "🎭" }
  ],
  mythical: [
    { name: "Cocofanto Elefanto", income: 6000, icon: "🐘" },
    { name: "Giraffa Celeste", income: 7000, icon: "🦒" },
    { name: "Tralalero Tralala", income: 8000, icon: "🦈" },
    { name: "Los Crocodillitos", income: 9000, icon: "🐊" },
    { name: "Tigroligre Frutonni", income: 10000, icon: "🐅" },
    { name: "Udin Din Din Dun", income: 11000, icon: "🥁" },
    { name: "Trenostruzzo Turbo 3000", income: 13000, icon: "🚂" },
    { name: "Trippi Troppi Troppa Trippa", income: 15000, icon: "🦐" },
    { name: "Orcalero Orcala", income: 18000, icon: "🐋" },
    { name: "Piccione Macchina", income: 19000, icon: "🐦" },
    { name: "Tukanno Bananno", income: 21000, icon: "🐦" },
    { name: "Ballerino Lololo", income: 25250, icon: "🕺" }
  ],
  cosmic: [
    { name: "La Vacca Saturno Saturnita", income: 22000, icon: "🪐" },
    { name: "Torrtuginni Dragonfrutini", income: 30000, icon: "🐢" },
    { name: "Los Tralaleritos", income: 48000, icon: "🦈" },
    { name: "Las Tralaleritas", income: 50000, icon: "🦈" },
    { name: "Las Vaquitas Saturnitas", income: 60000, icon: "🐄" },
    { name: "Graipuss Medussi", income: 70000, icon: "🐍" },
    { name: "Pot Hotspot", income: 80000, icon: "🔥" },
    { name: "Chicleteira Bicicleteira", income: 90000, icon: "🚲" },
    { name: "La Grande Combinasion", income: 100000, icon: "🔱" },
    { name: "Nuclearo Dinossauro", income: 110000, icon: "☢️" },
    { name: "Garama and Madundung", income: 120000, icon: "🦧" },
    { name: "Dragon Cannelloni", income: 130000, icon: "🐉" },
    { name: "Agarrini la Palini", income: 150000, icon: "🌴" },
    { name: "Chimpanzini Spiderini", income: 170000, icon: "🕷️" },
    { name: "Dariungini Pandanneli", income: 190000, icon: "🐼" },
    { name: "Vroosh Boosh", income: 240000, icon: "💨" },
    { name: "Gatti Marshmallini", income: 999999, icon: "🐱" }
  ],
  secret: [
    { name: "Matteo", income: 200000, icon: "👤" },
    { name: "Gattatino Neonino", income: 250000, icon: "😺" },
    { name: "Statutino Libertino", income: 300000, icon: "🗽" },
    { name: "Unclito Samito", income: 350000, icon: "🎩" },
    { name: "Gattatino Donutino", income: 400000, icon: "🍩" },
    { name: "Espresso Signora", income: 450000, icon: "☕" },
    { name: "Los Tungtungtungcitos", income: 500000, icon: "🦇" },
    { name: "Aura Farma", income: 700000, icon: "💊" },
    { name: "Los Combinasionas", income: 600000, icon: "🔱" },
    { name: "Rainbow 67", income: 800000, icon: "🌈" },
    { name: "Fragola La La La", income: 1000000, icon: "🍓" },
    { name: "Eek Eek Eek Sahur", income: 1050000, icon: "🐒" },
    { name: "Bamboonini Bombini", income: 1140000, icon: "🎋" },
    { name: "Mastodontico Telepiedone", income: 1420000, icon: "📺" },
    { name: "La Vacca Black Hole Goat", income: 1200000, icon: "🕳️" },
    { name: "Tractoro Dinosauro", income: 4650000, icon: "🚜" },
    { name: "Capybara Monitora", income: 5090000, icon: "💻" },
    { name: "Kissarini Heartini", income: 5250000, icon: "💋" },
    { name: "Patatino Astronauta", income: 5700000, icon: "🥔" },
    { name: "Patito Dinerito", income: 6000000, icon: "🦆" },
    { name: "Onionello Penguini", income: 6450000, icon: "🧅" },
    { name: "Scaldarino Derpino", income: 7050000, icon: "🔥" },
    { name: "Marietti Frigo", income: 7500000, icon: "❄️" },
    { name: "Tartarughi Attrezzini", income: 3070000, icon: "🐢" },
    { name: "Tostino Flambante", income: 0, icon: "🔥" }
  ],
  celestial: [
    { name: "Job Job Job Sahur", income: 7500000, icon: "💼" },
    { name: "Dug Dug Dug", income: 8000000, icon: "⛏️" },
    { name: "Bisonte Giuppitere", income: 8500000, icon: "🦬" },
    { name: "Alessio", income: 9000000, icon: "👤" },
    { name: "Esok Sekolah", income: 9500000, icon: "🏫" },
    { name: "Polpo Semaforini", income: 10750000, icon: "🐙" },
    { name: "La Malita", income: 12000000, icon: "👿" },
    { name: "Diamantusa", income: 12250000, icon: "💎" },
    { name: "Avocadini Antilopini", income: 13000000, icon: "🥑" },
    { name: "Los Orcaleritos", income: 14000000, icon: "🐋" },
    { name: "Capuccino Policia", income: 14500000, icon: "👮" },
    { name: "Money Elephant", income: 14750000, icon: "💰" },
    { name: "Zung Zung Zung Lazur", income: 14750000, icon: "💎" },
    { name: "Cioccolatone Draghettone", income: 15000000, icon: "🍫" },
    { name: "Rattini Machini", income: 15250000, icon: "🐭" },
    { name: "Ketupastro Infernetto", income: 15500000, icon: "🔥" }
  ],
  divine: [
    { name: "Bulbito Bandito Traktorito", income: 30000000, icon: "🚜" },
    { name: "Burgerini Bearini", income: 35000000, icon: "🍔" },
    { name: "Martino Gravitino", income: 45000000, icon: "🌌" },
    { name: "Grappellino D'Oro", income: 48500000, icon: "🍇" },
    { name: "Strawberry Elephant", income: 50000000, icon: "🍓" },
    { name: "Din Din Vaultero", income: 55000000, icon: "🏃" },
    { name: "Glacierello Infernetti", income: 60000000, icon: "🧊" },
    { name: "Explodini Cataclismi", income: 65000000, icon: "💥" },
    { name: "Biscotti Macarotti", income: 75000000, icon: "🍪" },
    { name: "Pastapot Infernetto", income: 82500000, icon: "🍝" },
    { name: "Galactio Fantasma", income: 88800000, icon: "👻" },
    { name: "Rubichetto Cubini", income: 88800000, icon: "🎲" },
    { name: "Freezeti Cobretti", income: 90000000, icon: "❄️" },
    { name: "Cupitron Consoletron", income: 92500000, icon: "🎮" },
    { name: "Draculini Meowlini", income: 95000000, icon: "🧛" },
    { name: "Cornettino Fuaco", income: 0, icon: "🥐" }
  ],
  infinity: [
    { name: "Noobini Infeeny", income: 250000000, icon: "👶" },
    { name: "Anububu", income: 375000000, icon: "🐕" },
    { name: "Meta Technetta", income: 625000000, icon: "🤖" },
    { name: "Magmew", income: 999999999, icon: "🔥" }
  ]
};

// Helper to find brainrot info by name
function findBrainrotInfo(name) {
  for (const [rarity, list] of Object.entries(BRAINROT_DATA)) {
    const found = list.find(b => b.name.toLowerCase() === name.toLowerCase());
    if (found) return { ...found, rarity };
  }
  return null;
}

// Create new account structure
const createAccount = (username) => ({
  username: username || "Unknown",
  inventory: {},
  rawStats: {},
  calculated: {
    totalIncome: 0,
    totalBrainrots: 0,
    rarityCounts: {}
  },
  location: "Unknown",
  status: "Idle",
  lastUpdate: new Date().toLocaleString()
});

app.post('/update', (req, res) => {
  const { username, inventory, stats, location, status, wave } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  const account = accounts.get(username) || createAccount(username);
  
  // Update inventory from Lua script format
  if (inventory && typeof inventory === 'object') {
    account.inventory = inventory;
    
    // Calculate totals
    let totalIncome = 0;
    let totalBrainrots = 0;
    const rarityCounts = {};
    
    Object.entries(inventory).forEach(([brainrotName, count]) => {
      const info = findBrainrotInfo(brainrotName);
      if (info) {
        totalIncome += (info.income || 0) * count;
        totalBrainrots += count;
        rarityCounts[info.rarity] = (rarityCounts[info.rarity] || 0) + count;
      }
    });
    
    account.calculated = {
      totalIncome,
      totalBrainrots,
      rarityCounts
    };
  }
  
  // Store raw stats from leaderstats
  if (stats) {
    account.rawStats = stats;
  }
  
  // Update other fields
  if (location) account.location = location;
  if (status) account.status = status;
  if (wave) account.wave = wave;
  
  account.lastUpdate = new Date().toLocaleString();
  accounts.set(username, account);
  
  console.log(`[${username}] Updated: ${account.calculated.totalBrainrots} brainrots, $${account.calculated.totalIncome}/s`);
  
  res.json({ 
    ok: true, 
    message: `Updated ${account.calculated.totalBrainrots} brainrots`,
    income: account.calculated.totalIncome
  });
});

app.get('/data', (req, res) => {
  const { user } = req.query;
  if (user && accounts.has(user)) {
    res.json(accounts.get(user));
  } else {
    res.json(Array.from(accounts.values()));
  }
});

app.get('/accounts', (req, res) => {
  res.json(Array.from(accounts.values()));
});

app.get('/brainrots', (req, res) => {
  res.json(BRAINROT_DATA);
});

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🌊 Escape Tsunami For Brainrots - Dashboard</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;500;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    :root {
      --common: #b0b0b0;
      --uncommon: #00ff00;
      --rare: #0088ff;
      --epic: #aa00ff;
      --legendary: #ffaa00;
      --mythical: #ff0066;
      --cosmic: #00ffff;
      --secret: #ff00ff;
      --celestial: #ffff00;
      --divine: #ff8800;
      --infinity: #ff0000;
    }
    
    body {
      font-family: 'Rajdhani', sans-serif;
      background: linear-gradient(135deg, #001220 0%, #0a0a2e 50%, #001a33 100%);
      color: #e0e0e0;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    .ocean-bg {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: 
        radial-gradient(circle at 20% 80%, rgba(0,100,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(0,200,255,0.1) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
      animation: wave 10s ease-in-out infinite;
    }
    
    @keyframes wave {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
      position: relative;
      z-index: 1;
    }
    
    header {
      text-align: center;
      margin-bottom: 30px;
      padding: 30px;
      background: rgba(0, 20, 40, 0.8);
      border: 2px solid rgba(0, 200, 255, 0.3);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      box-shadow: 0 0 40px rgba(0, 150, 255, 0.2);
    }
    
    h1 {
      font-family: 'Orbitron', sans-serif;
      font-size: 2.5em;
      background: linear-gradient(90deg, #00ffff, #0088ff, #00ffff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
      margin-bottom: 10px;
    }
    
    .subtitle {
      color: #88ccff;
      font-size: 1.1em;
      letter-spacing: 2px;
    }
    
    .account-tabs {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 20px;
    }
    
    .tab-btn {
      background: rgba(0, 50, 100, 0.5);
      border: 1px solid rgba(0, 200, 255, 0.3);
      color: #88ccff;
      padding: 12px 24px;
      border-radius: 25px;
      cursor: pointer;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.9em;
      transition: all 0.3s;
    }
    
    .tab-btn:hover, .tab-btn.active {
      background: rgba(0, 200, 255, 0.3);
      box-shadow: 0 0 20px rgba(0, 200, 255, 0.4);
      transform: translateY(-2px);
      color: #fff;
    }
    
    .dashboard {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    @media (max-width: 968px) {
      .dashboard { grid-template-columns: 1fr; }
    }
    
    .stats-panel {
      background: rgba(0, 20, 40, 0.7);
      border: 1px solid rgba(0, 150, 255, 0.2);
      border-radius: 20px;
      padding: 25px;
      backdrop-filter: blur(10px);
    }
    
    .panel-title {
      font-family: 'Orbitron', sans-serif;
      color: #00ffff;
      font-size: 1.2em;
      margin-bottom: 20px;
      text-align: center;
      border-bottom: 1px solid rgba(0, 255, 255, 0.2);
      padding-bottom: 10px;
    }
    
    .stat-card {
      background: rgba(0, 0, 0, 0.4);
      border-radius: 12px;
      padding: 15px;
      margin-bottom: 12px;
      border-left: 4px solid;
    }
    
    .stat-label {
      color: #88aabb;
      font-size: 0.85em;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .stat-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.4em;
      font-weight: 700;
      color: #fff;
      margin-top: 5px;
    }
    
    .income-display {
      background: linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,0,0,0.4));
      border: 2px solid #00ff88;
    }
    
    .inventory-panel {
      background: rgba(0, 20, 40, 0.7);
      border: 1px solid rgba(0, 150, 255, 0.2);
      border-radius: 20px;
      padding: 25px;
      backdrop-filter: blur(10px);
    }
    
    .rarity-section {
      margin-bottom: 20px;
    }
    
    .rarity-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 15px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 10px;
      margin-bottom: 10px;
      font-family: 'Orbitron', sans-serif;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 0.9em;
    }
    
    .rarity-common { border-left: 4px solid var(--common); color: var(--common); }
    .rarity-uncommon { border-left: 4px solid var(--uncommon); color: var(--uncommon); }
    .rarity-rare { border-left: 4px solid var(--rare); color: var(--rare); }
    .rarity-epic { border-left: 4px solid var(--epic); color: var(--epic); }
    .rarity-legendary { border-left: 4px solid var(--legendary); color: var(--legendary); }
    .rarity-mythical { border-left: 4px solid var(--mythical); color: var(--mythical); }
    .rarity-cosmic { border-left: 4px solid var(--cosmic); color: var(--cosmic); }
    .rarity-secret { border-left: 4px solid var(--secret); color: var(--secret); }
    .rarity-celestial { border-left: 4px solid var(--celestial); color: var(--celestial); text-shadow: 0 0 10px var(--celestial); }
    .rarity-divine { border-left: 4px solid var(--divine); color: var(--divine); }
    .rarity-infinity { border-left: 4px solid var(--infinity); color: var(--infinity); text-shadow: 0 0 10px var(--infinity); }
    
    .brainrot-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 10px;
    }
    
    .brainrot-card {
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 12px;
      text-align: center;
      transition: all 0.3s;
    }
    
    .brainrot-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 20px rgba(0, 200, 255, 0.3);
      border-color: rgba(0, 200, 255, 0.5);
    }
    
    .brainrot-icon {
      font-size: 2em;
      margin-bottom: 5px;
    }
    
    .brainrot-name {
      font-size: 0.75em;
      color: #aaa;
      margin-bottom: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .brainrot-count {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.3em;
      font-weight: 700;
    }
    
    .brainrot-income {
      font-size: 0.7em;
      color: #00ff88;
      margin-top: 3px;
    }
    
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .summary-card {
      background: rgba(0, 20, 40, 0.7);
      border: 1px solid rgba(0, 150, 255, 0.2);
      border-radius: 15px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .summary-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 150, 255, 0.3);
      border-color: rgba(0, 200, 255, 0.5);
    }
    
    .summary-username {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.4em;
      color: #00ffff;
      margin-bottom: 10px;
    }
    
    .summary-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 15px;
    }
    
    .summary-stat {
      background: rgba(0, 0, 0, 0.3);
      padding: 10px;
      border-radius: 8px;
      text-align: center;
    }
    
    .summary-label {
      font-size: 0.75em;
      color: #88aabb;
      text-transform: uppercase;
    }
    
    .summary-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.2em;
      color: #fff;
      margin-top: 5px;
    }
    
    .connection-status {
      position: fixed;
      top: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(0, 0, 0, 0.8);
      padding: 10px 20px;
      border-radius: 20px;
      border: 1px solid rgba(0, 255, 0, 0.3);
      z-index: 100;
    }
    
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #00ff88;
      box-shadow: 0 0 10px #00ff88;
      animation: blink 2s infinite;
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    
    .empty-state {
      text-align: center;
      padding: 60px;
      color: #556677;
      font-style: italic;
    }
    
    .last-update {
      text-align: center;
      color: #556677;
      font-size: 0.9em;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="ocean-bg"></div>
  
  <div class="connection-status">
    <div class="status-dot"></div>
    <span id="connText">Connected</span>
  </div>
  
  <div class="container">
    <header>
      <h1>🌊 ESCAPE TSUNAMI FOR BRAINROTS</h1>
      <div class="subtitle">MULTI-ACCOUNT DASHBOARD</div>
      <div class="account-tabs" id="accountTabs">
        <button class="tab-btn active" onclick="switchView('all')">📊 All Accounts</button>
      </div>
    </header>
    
    <div id="mainContent"></div>
  </div>

  <script>
    let currentView = 'all';
    let accounts = [];
    let brainrotData = {};
    let refreshInterval;

    async function loadBrainrotData() {
      try {
        const res = await fetch('/brainrots');
        brainrotData = await res.json();
      } catch(e) {
        console.error('Failed to load brainrot data');
      }
    }

    async function fetchData() {
      try {
        const res = await fetch('/accounts');
        accounts = await res.json();
        updateUI();
        document.getElementById('connText').textContent = 'Connected';
        document.querySelector('.status-dot').style.background = '#00ff88';
      } catch(e) {
        console.error(e);
        document.getElementById('connText').textContent = 'Disconnected';
        document.querySelector('.status-dot').style.background = '#ff0044';
      }
    }

    function updateUI() {
      updateTabs();
      if (currentView === 'all') {
        renderAllAccounts();
      } else {
        renderSingleAccount(currentView);
      }
    }

    function updateTabs() {
      const tabsContainer = document.getElementById('accountTabs');
      const existingTabs = tabsContainer.querySelectorAll('.tab-btn:not(:first-child)');
      existingTabs.forEach(tab => tab.remove());

      accounts.forEach(acc => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn' + (acc.username === currentView ? ' active' : '');
        btn.textContent = acc.username;
        btn.onclick = () => switchView(acc.username);
        tabsContainer.appendChild(btn);
      });
    }

    function switchView(view) {
      currentView = view;
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', 
          (view === 'all' && btn.textContent.includes('All Accounts')) ||
          btn.textContent === view
        );
      });
      updateUI();
    }

    function formatMoney(num) {
      if (!num) return '0';
      if (num >= 1000000000) return (num/1000000000).toFixed(2) + 'B';
      if (num >= 1000000) return (num/1000000).toFixed(2) + 'M';
      if (num >= 1000) return (num/1000).toFixed(1) + 'K';
      return num.toLocaleString();
    }

    function renderAllAccounts() {
      const container = document.getElementById('mainContent');
      
      if (accounts.length === 0) {
        container.innerHTML = '<div class="empty-state">No accounts found. Execute the Lua script in Roblox to start tracking.</div>';
        return;
      }

      let html = '<div class="summary-cards">';
      accounts.forEach(acc => {
        const calc = acc.calculated || {};
        const rarityText = Object.entries(calc.rarityCounts || {})
          .map(([r, c]) => \`\${c} \${r.charAt(0).toUpperCase() + r.slice(1)}\`)
          .join(', ') || 'None';

        html += \`
          <div class="summary-card" onclick="switchView('\${acc.username}')">
            <div class="summary-username">\${acc.username}</div>
            <div style="color: #88aabb; font-size: 0.9em;">\${acc.status}</div>
            <div class="summary-stats">
              <div class="summary-stat">
                <div class="summary-label">Brainrots</div>
                <div class="summary-value" style="color: #00ffff;">\${calc.totalBrainrots || 0}</div>
              </div>
              <div class="summary-stat">
                <div class="summary-label">Income/sec</div>
                <div class="summary-value" style="color: #00ff88;">$\${formatMoney(calc.totalIncome)}</div>
              </div>
            </div>
            <div style="margin-top: 10px; font-size: 0.8em; color: #667788; text-align: center;">
              \${rarityText}
            </div>
          </div>
        \`;
      });
      html += '</div>';
      container.innerHTML = html;
    }

    function renderSingleAccount(username) {
      const account = accounts.find(a => a.username === username);
      if (!account) return;

      const container = document.getElementById('mainContent');
      const calc = account.calculated || {};
      const inventory = account.inventory || {};

      let html = '<div class="dashboard">';

      // Left Panel - Stats
      html += \`
        <div class="stats-panel">
          <div class="panel-title">👤 \${account.username}</div>
          
          <div class="stat-card income-display">
            <div class="stat-label">Total Income / Second</div>
            <div class="stat-value" style="color: #00ff88;">$\${formatMoney(calc.totalIncome)}</div>
          </div>

          <div class="stat-card" style="border-color: #00ffff;">
            <div class="stat-label">Total Brainrots</div>
            <div class="stat-value">\${calc.totalBrainrots || 0}</div>
          </div>

          <div class="stat-card" style="border-color: #ff00ff;">
            <div class="stat-label">Location</div>
            <div class="stat-value" style="font-size: 1.1em;">\${account.location}</div>
          </div>

          <div class="stat-card" style="border-color: #ffaa00;">
            <div class="stat-label">Status</div>
            <div class="stat-value" style="font-size: 1.1em;">\${account.status}</div>
          </div>
      \`;

      // Raw stats from Roblox
      if (account.rawStats && Object.keys(account.rawStats).length > 0) {
        html += '<div style="margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">';
        html += '<div style="color: #88aabb; font-size: 0.8em; margin-bottom: 10px;">RAW STATS</div>';
        Object.entries(account.rawStats).forEach(([key, value]) => {
          html += \`
            <div style="display: flex; justify-content: space-between; padding: 5px 0; font-size: 0.9em;">
              <span style="color: #667788;">\${key}</span>
              <span style="color: #fff; font-family: Orbitron;">\${value}</span>
            </div>
          \`;
        });
        html += '</div>';
      }

      html += \`
          <div class="last-update">Last update: \${account.lastUpdate}</div>
        </div>
      \`;

      // Right Panel - Inventory
      html += '<div class="inventory-panel">';
      html += '<div class="panel-title">🧠 BRAINROT INVENTORY</div>';

      if (Object.keys(inventory).length === 0) {
        html += '<div class="empty-state">No brainrots found. Open your inventory in-game and execute the tracker.</div>';
      } else {
        // Group by rarity
        Object.entries(brainrotData).forEach(([rarity, brainrots]) => {
          const owned = brainrots.filter(b => inventory[b.name] > 0);
          if (owned.length > 0) {
            const totalInRarity = owned.reduce((sum, b) => sum + (inventory[b.name] || 0), 0);
            
            html += \`
              <div class="rarity-section">
                <div class="rarity-header rarity-\${rarity}">
                  <span>\${rarity}</span>
                  <span>\${owned.length} types • \${totalInRarity} total</span>
                </div>
                <div class="brainrot-grid">
            \`;

            owned.forEach(b => {
              const count = inventory[b.name] || 0;
              const income = (b.income || 0) * count;
              html += \`
                <div class="brainrot-card">
                  <div class="brainrot-icon">\${b.icon}</div>
                  <div class="brainrot-name">\${b.name}</div>
                  <div class="brainrot-count" style="color: var(--\${rarity})">x\${count}</div>
                  <div class="brainrot-income">$\${formatMoney(b.income)}/s</div>
                </div>
              \`;
            });

            html += '</div></div>';
          }
        });
      }

      html += '</div></div>'; // End inventory-panel and dashboard
      container.innerHTML = html;
    }

    // Initialize
    loadBrainrotData();
    fetchData();
    refreshInterval = setInterval(fetchData, 5000);
  </script>
</body>
</html>
  `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🌊 Escape Tsunami For Brainrots Dashboard running on port ${port}`));
