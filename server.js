const express = require('express');
const app = express();
app.use(express.json());

// Store data for multiple Roblox accounts
let accounts = new Map();

// All Brainrot rarities and types from the actual game
const BRAINROT_DATA = {
  // Common ($2-15/s)
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
  // Uncommon ($20-120/s)
  uncommon: [
    { name: "Trippi Troppi", income: 20, icon: "🦐" },
    { name: "Gangster Footera", income: 30, icon: "🦶" },
    { name: "Bobrito Bandito", icon: "🦦" },
    { name: "Boneca Ambalabu", income: 40, icon: "🎭" },
    { name: "Cacto Hipopotamo", income: 50, icon: "🌵" },
    { name: "Ta Ta Ta Sahur", income: 60, icon: "🥁" },
    { name: "Tric Tric Baraboom", income: 70, icon: "💥" },
    { name: "67", income: 90, icon: "🔢" },
    { name: "Pipi Avocado", income: 120, icon: "🥑" }
  ],
  // Rare ($100-275/s)
  rare: [
    { name: "Cappuccino Assassino", income: 100, icon: "☕" },
    { name: "Brr Brr Patapim", income: 120, icon: "🌲" },
    { name: "Trulimero Trulichina", income: 135, icon: "🎪" },
    { name: "Bambini Crostini", income: 150, icon: "🥖" },
    { name: "Bananita Dolphinita", income: 170, icon: "🐬" },
    { name: "Perochello Lemonchello", income: 190, icon: "🍋" },
    { name: "Avocadini Guffo", income: 210, icon: "🦉" },
    { name: "Salamino Penguino", income: 229, icon: "🐧" },
    { name: "Penguino Cocosino", income: 250, icon: "🥥" },
    { name: "Ti Ti Ti Sahur", income: 275, icon: "🎵" }
  ],
  // Epic ($290-1.4K/s)
  epic: [
    { name: "Burbaloni Luliloli", income: 290, icon: "🍭" },
    { name: "Chimpanzini Bananini", income: 475, icon: "🍌" },
    { name: "Ballerina Cappuccina", income: 550, icon: "☕" },
    { name: "Chef Crabracadabra", income: 625, icon: "🦀" },
    { name: "Lionel Cactuseli", income: 700, icon: "🦁" },
    { name: "Glorbo Fruttodrillo", income: 775, icon: "🐊" },
    { name: "Strawberrilli Flamengilli", income: 925, icon: "💃" },
    { name: "Pandaccini Bananini", income: 1000, icon: "🐼" },
    { name: "Sigma Boy", income: 1100, icon: "🐺" },
    { name: "Pi Pi Watermelon", income: 1200, icon: "🍉" },
    { name: "Blueberrinni Octopussini", income: 1270, icon: "🐙" },
    { name: "Cocosini Mama", income: 1300, icon: "👩" },
    { name: "Guesto Angelic", income: 1400, icon: "👼" }
  ],
  // Legendary (1.5K-5K/s)
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
  // Mythical (6K-25.25K/s)
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
  // Cosmic (22K-240K/s)
  cosmic: [
    { name: "La Vacca Saturno", income: 22000, icon: "🪐" },
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
  // Secret (200K-9.36M/s)
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
    { name: "La Vacca Black Hole Goat", income: 1200000, icon: "🕳️" },
    { name: "Bambooini Bombini", income: 1140000, icon: "🎋" },
    { name: "Mastodontico Telepiedone", income: 1420000, icon: "📺" },
    { name: "Tartarughi Attrezzini", income: 3070000, icon: "🐢" },
    { name: "Tractoro Dinosauro", income: 4650000, icon: "🚜" },
    { name: "Capybara Monitora", income: 5090000, icon: "💻" },
    { name: "Kissarini Heartini", income: 5250000, icon: "💋" },
    { name: "Patatino Astronauta", income: 5700000, icon: "🥔" },
    { name: "Patito Dinerito", income: 6000000, icon: "🦆" },
    { name: "Onionello Penguini", income: 6450000, icon: "🧅" },
    { name: "Scaldarino Derpino", income: 7050000, icon: "🔥" },
    { name: "Marietti Frigo", income: 7500000, icon: "❄️" },
    { name: "Sausaggini Sanitario", income: 9360000, icon: "🧼" }
  ],
  // Celestial (2M-15.5M/s)
  celestial: [
    { name: "Caffe Trinity", income: 2000000, icon: "☕" },
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
  // Divine (30M-95M/s)
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
    { name: "Draculini Meowlini", income: 95000000, icon: "🧛" }
  ],
  // Infinity (250M+)
  infinity: [
    { name: "Noobini Infeeny", income: 250000000, icon: "👶" },
    { name: "Anububu", income: 375000000, icon: "🐕" },
    { name: "Meta Technetta", income: 625000000, icon: "🤖" },
    { name: "Magmew", income: 999999999, icon: "🔥" }
  ]
};

// Tsunami types
const TSUNAMI_TYPES = [
  { name: "Super Slow", color: "#00ff88", speed: "Very Slow" },
  { name: "Slow", color: "#88ff00", speed: "Slow" },
  { name: "Medium", color: "#ffff00", speed: "Medium" },
  { name: "Fast", color: "#ff8800", speed: "Fast" },
  { name: "Lightning", color: "#ff0088", speed: "Extreme" },
  { name: "Beast", color: "#ff0000", speed: "Instant" }
];

// Create new account structure
const createAccount = (username) => ({
  username: username || "Unknown",
  inventory: {},
  stats: {
    speed: 0,
    maxSpeed: 15670,
    carry: 1,
    maxCarry: 7,
    rebirth: 0,
    maxRebirth: 27,
    money: 0,
    baseLevel: 1,
    maxBaseLevel: 40
  },
  currentWave: {
    active: false,
    type: null,
    timeRemaining: 0
  },
  location: "Safe Zone",
  status: "Idle",
  lastUpdate: new Date().toLocaleString()
});

// Initialize
let latest = createAccount("Player1");

app.post('/update', (req, res) => {
  const { username, ...data } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  const account = accounts.get(username) || createAccount(username);
  
  // Update inventory
  if (data.inventory) {
    Object.entries(data.inventory).forEach(([brainrotName, count]) => {
      if (count > 0) {
        account.inventory[brainrotName] = count;
      } else {
        delete account.inventory[brainrotName];
      }
    });
  }
  
  // Update stats
  if (data.stats) {
    Object.assign(account.stats, data.stats);
  }
  
  // Update wave status
  if (data.wave) {
    account.currentWave = data.wave;
  }
  
  // Update location and status
  if (data.location) account.location = data.location;
  if (data.status) account.status = data.status;
  
  account.lastUpdate = new Date().toLocaleString();
  accounts.set(username, account);
  latest = account;
  
  console.log(`[${username}] Updated:`, {
    brainrots: Object.keys(account.inventory).length,
    money: account.stats.money,
    status: account.status
  });
  
  res.json({ ok: true, account });
});

app.get('/data', (req, res) => {
  const { user } = req.query;
  if (user && accounts.has(user)) {
    res.json(accounts.get(user));
  } else {
    res.json(latest);
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
  <title>🌊 Escape Tsunami For Brainrots - Multi-Account Dashboard</title>
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
      position: relative;
      overflow: hidden;
    }
    
    header::before {
      content: '🌊';
      position: absolute;
      font-size: 100px;
      opacity: 0.1;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-10px); }
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
      position: relative;
      overflow: hidden;
    }
    
    .tab-btn:hover, .tab-btn.active {
      background: rgba(0, 200, 255, 0.3);
      box-shadow: 0 0 20px rgba(0, 200, 255, 0.4);
      transform: translateY(-2px);
      color: #fff;
    }
    
    .tab-btn.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, transparent, #00ffff, transparent);
      animation: scan 2s linear infinite;
    }
    
    @keyframes scan {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .dashboard {
      display: grid;
      grid-template-columns: 300px 1fr;
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
    
    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      margin-bottom: 10px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      border-left: 3px solid;
    }
    
    .stat-label {
      color: #88aabb;
      font-size: 0.9em;
    }
    
    .stat-value {
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      color: #fff;
    }
    
    .wave-alert {
      background: rgba(255, 0, 0, 0.2);
      border: 2px solid #ff0044;
      border-radius: 15px;
      padding: 20px;
      text-align: center;
      margin-bottom: 20px;
      animation: pulse-red 1s infinite;
      display: none;
    }
    
    .wave-alert.active {
      display: block;
    }
    
    @keyframes pulse-red {
      0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 68, 0.4); }
      50% { box-shadow: 0 0 40px rgba(255, 0, 68, 0.8); }
    }
    
    .wave-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.5em;
      color: #ff0044;
      margin-bottom: 10px;
    }
    
    .inventory-section {
      background: rgba(0, 20, 40, 0.7);
      border: 1px solid rgba(0, 150, 255, 0.2);
      border-radius: 20px;
      padding: 25px;
      backdrop-filter: blur(10px);
    }
    
    .rarity-section {
      margin-bottom: 25px;
    }
    
    .rarity-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
      padding: 10px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 10px;
      font-family: 'Orbitron', sans-serif;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .rarity-common { color: var(--common); border-left: 4px solid var(--common); }
    .rarity-uncommon { color: var(--uncommon); border-left: 4px solid var(--uncommon); }
    .rarity-rare { color: var(--rare); border-left: 4px solid var(--rare); }
    .rarity-epic { color: var(--epic); border-left: 4px solid var(--epic); }
    .rarity-legendary { color: var(--legendary); border-left: 4px solid var(--legendary); }
    .rarity-mythical { color: var(--mythical); border-left: 4px solid var(--mythical); }
    .rarity-cosmic { color: var(--cosmic); border-left: 4px solid var(--cosmic); }
    .rarity-secret { color: var(--secret); border-left: 4px solid var(--secret); }
    .rarity-celestial { color: var(--celestial); border-left: 4px solid var(--celestial); }
    .rarity-divine { color: var(--divine); border-left: 4px solid var(--divine); }
    .rarity-infinity { color: var(--infinity); border-left: 4px solid var(--infinity); }
    
    .brainrot-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 10px;
    }
    
    .brainrot-card {
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 15px;
      text-align: center;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    
    .brainrot-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 20px rgba(0, 200, 255, 0.3);
    }
    
    .brainrot-card.owned {
      border-color: rgba(0, 255, 136, 0.5);
      background: rgba(0, 255, 136, 0.1);
    }
    
    .brainrot-icon {
      font-size: 2em;
      margin-bottom: 5px;
    }
    
    .brainrot-name {
      font-size: 0.75em;
      color: #aaa;
      margin-bottom: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .brainrot-count {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.2em;
      font-weight: 700;
    }
    
    .income-display {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      border: 2px solid #00ff88;
      border-radius: 15px;
      padding: 20px;
      min-width: 250px;
      box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
    }
    
    .income-label {
      color: #88aa99;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .income-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 2em;
      color: #00ff88;
      text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
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
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      margin-top: 5px;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00ffff, #0088ff);
      transition: width 0.5s;
    }
    
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .summary-card {
      background: rgba(0, 20, 40, 0.7);
      border: 1px solid rgba(0, 150, 255, 0.2);
      border-radius: 15px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .summary-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 150, 255, 0.3);
    }
    
    .summary-username {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.3em;
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
    }
    
    .summary-label {
      font-size: 0.8em;
      color: #88aabb;
    }
    
    .summary-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.2em;
      color: #fff;
    }
    
    .location-badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 15px;
      font-size: 0.85em;
      margin-top: 10px;
    }
    
    .location-safe { background: rgba(0, 255, 136, 0.2); color: #00ff88; }
    .location-danger { background: rgba(255, 0, 68, 0.2); color: #ff0044; }
    
    .empty-inventory {
      text-align: center;
      padding: 60px;
      color: #556677;
      font-style: italic;
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
    
    <div id="mainContent">
      <!-- Dynamic content loaded here -->
    </div>
    
    <div class="income-display" id="incomeDisplay" style="display: none;">
      <div class="income-label">💰 Total Income/sec</div>
      <div class="income-value" id="totalIncome">$0</div>
    </div>
  </div>

  <script>
    let currentView = 'all';
    let accounts = [];
    let brainrotData = {};
    let refreshInterval;
    
    // Fetch all brainrot definitions
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
        document.getElementById('incomeDisplay').style.display = 'none';
      } else {
        renderSingleAccount(currentView);
        document.getElementById('incomeDisplay').style.display = 'block';
      }
    }
    
    function updateTabs() {
      const tabsContainer = document.getElementById('accountTabs');
      // Keep the "All Accounts" button
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
    
    function renderAllAccounts() {
      const container = document.getElementById('mainContent');
      
      if (accounts.length === 0) {
        container.innerHTML = '<div class="empty-inventory">No accounts found. Waiting for data...</div>';
        return;
      }
      
      let html = '<div class="summary-cards">';
      accounts.forEach(acc => {
        const totalBrainrots = Object.values(acc.inventory).reduce((a, b) => a + b, 0);
        const income = calculateIncome(acc.inventory);
        
        html += \`
          <div class="summary-card" onclick="switchView('\${acc.username}')">
            <div class="summary-username">\${acc.username}</div>
            <div class="location-badge \${acc.currentWave.active ? 'location-danger' : 'location-safe'}">
              \${acc.currentWave.active ? '⚠️ ' + acc.currentWave.type : '✅ Safe'}
            </div>
            <div class="summary-stats">
              <div class="summary-stat">
                <div class="summary-label">Brainrots</div>
                <div class="summary-value">\${totalBrainrots}</div>
              </div>
              <div class="summary-stat">
                <div class="summary-label">$/sec</div>
                <div class="summary-value">\${formatMoney(income)}</div>
              </div>
              <div class="summary-stat">
                <div class="summary-label">Rebirth</div>
                <div class="summary-value">\${acc.stats.rebirth}</div>
              </div>
              <div class="summary-stat">
                <div class="summary-label">Speed</div>
                <div class="summary-value">\${acc.stats.speed}</div>
              </div>
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
      const totalIncome = calculateIncome(account.inventory);
      
      let html = '';
      
      // Wave Alert
      html += \`
        <div class="wave-alert \${account.currentWave.active ? 'active' : ''}">
          <div class="wave-title">🌊 TSUNAMI WARNING 🌊</div>
          <div>\${account.currentWave.type || 'Unknown'} Wave Incoming!</div>
          <div style="margin-top: 10px; font-size: 1.2em;">Time: \${account.currentWave.timeRemaining || 0}s</div>
        </div>
      \`;
      
      html += '<div class="dashboard">';
      
      // Stats Panel
      html += \`
        <div class="stats-panel">
          <div class="panel-title">📊 PLAYER STATS</div>
          
          <div class="stat-row" style="border-color: #00ffff;">
            <span class="stat-label">💰 Money</span>
            <span class="stat-value">\${formatMoney(account.stats.money)}</span>
          </div>
          
          <div class="stat-row" style="border-color: #ff00ff;">
            <span class="stat-label">⚡ Speed</span>
            <span class="stat-value">\${account.stats.speed} / \${account.stats.maxSpeed}</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width: \${(account.stats.speed/account.stats.maxSpeed)*100}%"></div>
            </div>
          </div>
          
          <div class="stat-row" style="border-color: #ffaa00;">
            <span class="stat-label">🎒 Carry</span>
            <span class="stat-value">\${account.stats.carry} / \${account.stats.maxCarry}</span>
          </div>
          
          <div class="stat-row" style="border-color: #ff0066;">
            <span class="stat-label">♻️ Rebirth</span>
            <span class="stat-value">\${account.stats.rebirth} / \${account.stats.maxRebirth}</span>
          </div>
          
          <div class="stat-row" style="border-color: #00ff88;">
            <span class="stat-label">🏠 Base Level</span>
            <span class="stat-value">\${account.stats.baseLevel} / \${account.stats.maxBaseLevel}</span>
          </div>
          
          <div class="stat-row" style="border-color: #aa00ff;">
            <span class="stat-label">📍 Location</span>
            <span class="stat-value">\${account.location}</span>
          </div>
          
          <div class="stat-row" style="border-color: #0088ff;">
            <span class="stat-label">Status</span>
            <span class="stat-value">\${account.status}</span>
          </div>
        </div>
      \`;
      
      // Inventory Panel
      html += '<div class="inventory-section">';
      html += '<div class="panel-title">🧠 BRAINROT COLLECTION</div>';
      
      if (Object.keys(account.inventory).length === 0) {
        html += '<div class="empty-inventory">No brainrots collected yet. Go survive that tsunami!</div>';
      } else {
        // Group by rarity
        Object.entries(brainrotData).forEach(([rarity, brainrots]) => {
          const owned = brainrots.filter(b => account.inventory[b.name]);
          if (owned.length > 0) {
            html += \`
              <div class="rarity-section">
                <div class="rarity-header rarity-\${rarity}">
                  <span>\${rarity}</span>
                  <span style="margin-left: auto; font-size: 0.8em;">\${owned.length} owned</span>
                </div>
                <div class="brainrot-grid">
            \`;
            
            owned.forEach(b => {
              const count = account.inventory[b.name];
              html += \`
                <div class="brainrot-card owned">
                  <div class="brainrot-icon">\${b.icon}</div>
                  <div class="brainrot-name">\${b.name}</div>
                  <div class="brainrot-count" style="color: var(--\${rarity})">x\${count}</div>
                  <div style="font-size: 0.7em; color: #666; margin-top: 5px;">$\${formatMoney(b.income)}/s</div>
                </div>
              \`;
            });
            
            html += '</div></div>';
          }
        });
      }
      
      html += '</div>'; // End inventory-section
      html += '</div>'; // End dashboard
      
      container.innerHTML = html;
      document.getElementById('totalIncome').textContent = '$' + formatMoney(totalIncome);
    }
    
    function calculateIncome(inventory) {
      let total = 0;
      Object.entries(inventory).forEach(([name, count]) => {
        Object.values(brainrotData).flat().forEach(b => {
          if (b.name === name) {
            total += (b.income || 0) * count;
          }
        });
      });
      return total;
    }
    
    function formatMoney(num) {
      if (num >= 1000000) return (num/1000000).toFixed(2) + 'M';
      if (num >= 1000) return (num/1000).toFixed(1) + 'K';
      return num.toString();
    }
    
    // Initialize
    loadBrainrotData();
    fetchData();
    refreshInterval = setInterval(fetchData, 3000);
  </script>
</body>
</html>
  `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🌊 Escape Tsunami For Brainrots Dashboard running on port ${port}`));
