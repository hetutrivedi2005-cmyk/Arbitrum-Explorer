# Arbitrum Explorer

A premium, production-quality, fully responsive multi-page Web3 startup showcase platform built using HTML, CSS, and Vanilla JavaScript only. The website highlights the scale, concepts, metrics, and security mechanisms of the Arbitrum Layer 2 scaling ecosystem.

## 🚀 Key Features

### 1. Global Core Components
- **Responsive Navigation**: Sticky glassmorphic navbar with active page detection. Automatically transforms into a slide-out hamburger navigation menu on mobile devices.
- **Node Particle Background**: An interactive HTML5 Canvas background drawing floating blockchain nodes that mesh together and respond dynamically to mouse coordinates.
- **Micro-Animations**: Custom scroll reveals using `IntersectionObserver`, statistics counter count-ups, floating SVGs, and responsive hover transitions.
- **Back-to-Top Button**: A smooth-scrolling circular shortcut appearing after scrolling down 300px on any page.

### 2. Homepage & About Overview
- **Visual Hero Header**: An inline animated SVG portraying data bundling routing from Layer 1 Ethereum to Layer 2 Arbitrum.
- **Scaling Overview**: Easy-to-understand card grids explaining Blockchain, Ethereum, Layer 2, and Arbitrum.
- **Performance Benefits**: High-fidelity feature sections highlighting transaction speed, low gas costs, mainnet security, and throughput scalability.
- **Transaction Lifecycle Timeline**: Alternate vertical tracking of a rollup execution (Wallet -> Sequencer -> Rollup -> Execution -> L1 Settlement).

### 3. Web3 Concepts Hub
- **Semantic Comparison Cards**: Detailed tables mapping Web2 vs Web3, Bitcoin vs Ethereum, Public vs Private Keys, and Traditional Databases vs Blockchains.
- **Interactivity**: Highlight-focus triggers on table rows for side-by-side readability, and lightbulb "Did You Know?" alerts that spawn spark-burst particle animations upon clicks.

### 4. Live Crypto Prices Dashboard
- **CoinGecko API Fetch**: Feeds real-time pricing and 24h percentage return rates for BTC, ETH, ARB, SOL, and MATIC.
- **Statistics Panel**: Live tracking header for total visible coins, API status indicators (Active, Loading, or Error), last refresh timestamps, and ticking UTC clock.
- **Frictionless Filters**: Instant debounced search filtering that hides cards in real-time as users search name query strings.
- **Visual Feedbacks**: Colored SVG logos, directional caret indicators (green caret-up for returns, red caret-down for losses), and brief green/cyan glow flashes upon price refreshes.

### 5. Blockchain Mining Simulator
- **Dual Connected Blockcards**: Displays Block 1 and Block 2 connected by a pulsing neon SVG connector link.
- **Asymmetric Chain Verification**: Recalculates SHA-256 hashes instantly using the browser's native Web Crypto API. 
- **Proof-of-Work Mining Engine**: Runs non-blocking asynchronous loops in batches (using `requestAnimationFrame`) to search for nonces satisfying the `00` difficulty constraint, showing values counting up live.
- **Immutability Sandbox**: Editing data inside Block 1 immediately breaks Block 2's previous hash link, turning the badges and connector lines red (`Chain Broken`). Re-validating requires mining Block 1 again, and subsequently mining Block 2, demonstrating ledger safety.

---

## 📂 Folder Structure

```
Arbitrum Explorer/
├── index.html            # Landing page (Hero, Timeline, Performance stats)
├── concepts.html         # Learning dashboard (Web3 tables & dynamic facts)
├── prices.html           # Live crypto pricing ticker (API integration)
├── simulator.html        # Interactive PoW blockchain simulator sandbox
│
├── css/
│   ├── style.css         # Reset styles, design tokens, timelines, and animations
│   └── responsive.css    # Media query overrides for mobiles, tablets, and wide screens
│
├── js/
│   ├── main.js           # Interactive node background, back-to-top, sticky nav
│   ├── concepts.js       # Spark burst click effects and row focuses
│   ├── prices.js         # API polling, search filtering, and ticking clocks
│   └── simulator.js      # SHA-256 digests, async mining chunkers, and chain validations
│
└── README.md             # Project documentation and local running guides
```

---

## 🛠 Tech Stack
- **Core Structure**: HTML5 Semantic markup
- **Design System**: Vanilla CSS3 (Custom gradients, animations, CSS grid overlays, and Glassmorphism details)
- **Programming Logic**: Vanilla ES6 JavaScript (Fetch API, Web Crypto API, and IntersectionObserver)
- **Icons**: FontAwesome Web Fonts

---

## 💻 How to Run Locally

Since the project uses the **Fetch API** (for CoinGecko prices) and the **Web Crypto API** (for secure SHA-256 hashing), running the files directly from your file system (`file://` protocol) may block network requests due to browser CORS policies.

We recommend serving the project files using a simple local static server:

### Option A: Node.js (Recommended)
If you have Node.js installed, navigate to the project directory and run:
```bash
npx serve -l 8000
```
Then open `http://localhost:8000` in your browser.

### Option B: Python
If you have Python installed, navigate to the directory and run:
```bash
# Python 3
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

---

## 🔌 API Integrations Used
- **CoinGecko Simple Price API**:
  `https://api.coingecko.com/api/v3/simple/price`
  - Returns current valuations and 24-hour change rates.

---

## 🔮 Future Improvements
1. **Wallet Connection Mockups**: Integrate mock wallet connection triggers ("Connect MetaMask") inside the navbar.
2. **Gas Optimization Statistics**: Introduce live charts parsing average L2 saving parameters compared to Ethereum Mainnet gas spikes.
3. **ZK-Rollup Sandbox Mode**: Build alternative tabs inside the block simulator showing zero-knowledge prover mechanics.

---

## 👤 Author
- **Name**: Het Trivedi
- **Batch**: Web3-Frontends-2026
- **GitHub Repository**: [https://github.com](https://github.com)

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE details for info.
