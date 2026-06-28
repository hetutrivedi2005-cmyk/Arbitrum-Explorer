/**
 * Arbitrum Explorer - Live Prices Page JavaScript
 * Powering real-time valuations through CoinGecko public API,
 * dynamic search queries filters, statistics widgets, and retry systems.
 */

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  fetchCryptoPrices();
  initGasEstimator();

  // Button Listeners
  const refreshBtn = document.getElementById('refresh-btn');
  const retryBtn = document.getElementById('retry-btn');

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      fetchCryptoPrices();
    });
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      fetchCryptoPrices();
    });
  }

  // Debounced Search Inputs
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(filterCoins, 250));
  }
});

/* ==========================================================================
   1. GLOBAL LIVE UTILITIES
   ========================================================================== */
function initClock() {
  const clockElement = document.getElementById('stat-clock');
  
  function updateTime() {
    if (!clockElement) return;
    const now = new Date();
    // Get formatted IST time string
    const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const istTime = now.toLocaleTimeString('en-US', options) + ' IST';
    clockElement.textContent = istTime;
  }
  
  updateTime();
  setInterval(updateTime, 1000);
}

// Simple debouncer for search optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* ==========================================================================
   2. DATA SOURCE CONFIGURATION & SVG VECTOR LOGOS
   ========================================================================== */
const coinMetadata = {
  'bitcoin': { symbol: 'BTC', name: 'Bitcoin', logoColor: '#f7931a', bgClass: 'glow-cyan' },
  'ethereum': { symbol: 'ETH', name: 'Ethereum', logoColor: '#627eea', bgClass: 'glow-purple' },
  'arbitrum': { symbol: 'ARB', name: 'Arbitrum', logoColor: '#00f2fe', bgClass: 'glow-cyan' },
  'solana': { symbol: 'SOL', name: 'Solana', logoColor: '#14f195', bgClass: 'glow-purple' },
  'polygon-ecosystem-token': { symbol: 'POL', name: 'Polygon', logoColor: '#8247e5', bgClass: 'glow-purple' }
};

// SVG paths for embedding clean vectors directly in code
const coinLogos = {
  'bitcoin': `<svg viewBox="0 0 24 24" fill="#f7931a"><path d="M23.638 14.073c-.45-1.885-1.459-3.24-3.322-3.76.918-.54 1.602-1.39 1.89-2.72.48-2.208-.57-3.876-3.14-4.59L19.74.88l-1.63-.398-.67 2.76c-.43-.105-.85-.205-1.27-.3l.68-2.78-1.63-.399-.68 2.79c-.356-.08-.7-.16-1.05-.24L14.44.89l-1.63-.4-.68 2.8c-.356-.07-.712-.13-1.07-.19L11.75.29 10.12-.1l-.68 2.8c-.244-.05-.487-.1-.73-.15L5.78 1.83 5.09 4.67c.36.088.7.17 1.02.26.85.2 1.05.7 1.01 1.48L6.03 10.8c.08.02.16.05.23.08-.22-.05-.45-.11-.69-.17l-1.02-.25-.69 2.83c.27.06.52.12.77.19.8.19.98.71.91 1.44l-1.12 4.56c-.06.26-.2.43-.52.35l-1.02-.25-.69 2.82 3.16.77c.59.14 1.17.29 1.75.42l.68-2.79c.386.09.76.18 1.13.27l-.68 2.8 1.63.4.68-2.79c.39.09.77.18 1.15.26l-.68 2.78 1.63.4.68-2.79c.47.1.92.2 1.37.29l-.02.09 1.63.4.45-1.85c2.78-.31 4.77-1.18 5.25-3.84.38-2.13-.39-3.48-1.92-4.14zM16.74 7.21c.32 1.34-1.28 1.81-2.48 1.52l-.63-2.58c1.2.29 2.79.47 3.11 1.06zm.73 6.64c.36 1.47-1.62 1.93-3.1 1.57l-.76-3.11c1.48.36 3.5.76 3.86 1.54z"/></svg>`,
  'ethereum': `<svg viewBox="0 0 24 24" fill="#8c8c8c"><path d="M12 2L3.5 12h17L12 2zm0 20L3.5 14h17L12 22z" opacity="0.4"/><path d="M12 2v20L3.5 13 12 2zm8.5 10L12 22V2l8.5 10z" opacity="0.8"/><path d="M12 2v10.5h8.5L12 2zm0 20v-9.5h8.5L12 22z"/></svg>`,
  'arbitrum': `<svg viewBox="0 0 24 24" fill="#00f2fe"><path d="M12 2L2 22h20L12 2zm0 6l6.5 11h-13L12 8z" opacity="0.6"/><path d="M12 11.5L15 17H9l3-5.5z"/></svg>`,
  'solana': `<svg viewBox="0 0 24 24" fill="#14f195"><path d="M19.6 2.8H3L4.4 5H21L19.6 2.8zm0 6.2H3L4.4 11.2H21L19.6 9zm0 6.2H3L4.4 17.4H21L19.6 15.2z"/></svg>`,
  'polygon-ecosystem-token': `<svg viewBox="0 0 24 24" fill="#8247e5"><path d="M12 2L4 6.5v9L12 20l8-4.5v-9L12 2zm6 12.2l-6 3.4-6-3.4v-6.8l6-3.4 6 3.4v6.8zm-6-8.9l-4 2.3v4.6l4 2.3 4-2.3v-4.6l-4-2.3z"/></svg>`
};

let cachedCoins = []; // Local cache copy for filtering operations

/* ==========================================================================
   3. FETCH & LOAD SYSTEM
   ========================================================================== */
function fetchCryptoPrices() {
  const gridContainer = document.getElementById('prices-grid');
  const statStatus = document.getElementById('stat-status');
  const statRefresh = document.getElementById('stat-refresh');
  const refreshIcon = document.getElementById('refresh-icon');
  const errorCard = document.getElementById('error-card');

  // Trigger loading state visuals
  if (statStatus) {
    statStatus.textContent = 'Loading...';
    statStatus.style.color = 'var(--accent-purple)';
  }
  if (refreshIcon) {
    refreshIcon.classList.add('fa-spin');
  }
  if (errorCard) {
    errorCard.style.display = 'none';
  }

  // Display skeletons if container is empty
  const hasContent = gridContainer.querySelectorAll('.price-card').length > 0;
  if (!hasContent) {
    renderSkeletons(gridContainer);
  }

  const endpoint = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,arbitrum,solana,polygon-ecosystem-token&vs_currencies=usd&include_24hr_change=true';

  fetch(endpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error('API failure status: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      // Map API object to sorted array matching ids config order
      const ids = ['bitcoin', 'ethereum', 'arbitrum', 'solana', 'polygon-ecosystem-token'];
      const results = ids.map(id => {
        const coinData = data[id];
        
        // Robust fallback checking to prevent page-blocking crashes
        const priceValue = (coinData && typeof coinData.usd !== 'undefined') ? coinData.usd : 0;
        const changeValue = (coinData && typeof coinData.usd_24h_change !== 'undefined') ? coinData.usd_24h_change : 0;
        
        // Format last updated details in IST
        const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const istRefreshTime = new Date().toLocaleTimeString('en-US', options) + ' IST';

        return {
          id: id,
          name: coinMetadata[id].name,
          symbol: coinMetadata[id].symbol,
          price: priceValue,
          change24h: changeValue,
          lastUpdated: istRefreshTime
        };
      });

      cachedCoins = results;

      // Update Top Panel Stats
      if (statStatus) {
        statStatus.textContent = 'Active';
        statStatus.style.color = '#10b981';
        statStatus.style.textShadow = '0 0 10px rgba(16,185,129,0.3)';
      }
      if (statRefresh) {
        const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        statRefresh.textContent = new Date().toLocaleTimeString('en-US', options) + ' IST';
      }

      // Hide error alert and render cards grid
      if (errorCard) errorCard.style.display = 'none';
      gridContainer.style.display = 'grid';

      renderCoinCards(gridContainer, results);
    })
    .catch(error => {
      console.error('CoinGecko fetch error:', error);
      
      // Update top stats panel indicator to Error
      if (statStatus) {
        statStatus.textContent = 'Error';
        statStatus.style.color = '#ef4444';
        statStatus.style.textShadow = '0 0 10px rgba(239,68,68,0.3)';
      }
      
      // Show failure banner and hide prices container
      if (errorCard) {
        errorCard.style.display = 'block';
      }
      gridContainer.style.display = 'none';
    })
    .finally(() => {
      // De-escalate button animation loop
      if (refreshIcon) {
        refreshIcon.classList.remove('fa-spin');
      }
    });
}

/* ==========================================================================
   4. RENDER DOM INJECTIONS
   ========================================================================== */
function renderSkeletons(container) {
  let skeletonsHTML = '';
  for (let i = 0; i < 5; i++) {
    skeletonsHTML += `
      <div class="glass-card skeleton-card">
        <div class="price-card-header">
          <div class="skeleton-logo skeleton-pulse-element"></div>
          <div class="skeleton-title skeleton-pulse-element" style="width: 70px;"></div>
        </div>
        <div class="price-body">
          <div class="skeleton-price skeleton-pulse-element" style="width: 140px; height: 32px;"></div>
          <div class="skeleton-change skeleton-pulse-element" style="width: 60px;"></div>
        </div>
        <div class="price-card-footer">
          <div class="skeleton-title skeleton-pulse-element" style="width: 60px;"></div>
          <div class="skeleton-title skeleton-pulse-element" style="width: 40px;"></div>
        </div>
      </div>
    `;
  }
  container.innerHTML = skeletonsHTML;
}

function renderCoinCards(container, coins) {
  container.innerHTML = ''; // Empty container of skeletons/old cards

  coins.forEach(coin => {
    const meta = coinMetadata[coin.id];
    const logoSVG = coinLogos[coin.id];
    const isPositive = coin.change24h >= 0;
    
    // Format price decimal details cleanly
    const formattedPrice = coin.price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: coin.price < 5 ? 4 : 2,
      maximumFractionDigits: coin.price < 5 ? 4 : 2
    });
    
    const formattedChange = Math.abs(coin.change24h).toFixed(2);
    const arrow = isPositive 
      ? `<span class="price-change-badge price-change-positive"><i class="fa-solid fa-caret-up"></i> +${formattedChange}%</span>`
      : `<span class="price-change-badge price-change-negative"><i class="fa-solid fa-caret-down"></i> -${formattedChange}%</span>`;

    const card = document.createElement('div');
    card.className = `glass-card price-card reveal-scale flash-update`;
    card.setAttribute('data-id', coin.id);
    card.setAttribute('data-name', coin.name.toLowerCase());
    card.setAttribute('data-symbol', coin.symbol.toLowerCase());
    
    card.innerHTML = `
      <div class="price-card-header">
        <div class="coin-logo-wrapper" style="box-shadow: 0 0 10px ${meta.logoColor}20;">
          ${logoSVG}
        </div>
        <div class="coin-identity">
          <h4>${coin.name}</h4>
          <span>${coin.symbol}</span>
        </div>
      </div>
      <div class="price-body">
        <div class="current-price monospace-text">${formattedPrice}</div>
        ${arrow}
      </div>
      <div class="price-card-footer">
        <span>Updated</span>
        <span class="monospace-text">${coin.lastUpdated}</span>
      </div>
    `;

    container.appendChild(card);
    
    // Smooth scroll reveal trigger
    setTimeout(() => card.classList.add('active'), 50);
    
    // Clear updating flash class after keyframe completes
    setTimeout(() => {
      card.classList.remove('flash-update');
    }, 1000);
  });
}

/* ==========================================================================
   5. CLIENT-SIDE FILTRATION (SEARCH)
   ========================================================================== */
function filterCoins() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const cards = document.querySelectorAll('.price-card');
  let matchedCount = 0;

  cards.forEach(card => {
    const name = card.getAttribute('data-name');
    const symbol = card.getAttribute('data-symbol');
    
    if (name.includes(query) || symbol.includes(query)) {
      card.style.display = 'flex';
      matchedCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Dynamically update 'Total Coins' counter based on visible search results
  const totalCounter = document.getElementById('stat-total');
  if (totalCounter) {
    totalCounter.textContent = matchedCount;
  }
}

/* ==========================================================================
   6. INTERACTIVE GAS SAVINGS CALCULATOR
   ========================================================================== */
function initGasEstimator() {
  const selectType = document.getElementById('txn-type');
  const slider = document.getElementById('txn-slider');
  const sliderVal = document.getElementById('slider-val');
  const l1CostText = document.getElementById('l1-cost');
  const l2CostText = document.getElementById('l2-cost');
  const savingsText = document.getElementById('gas-savings');

  if (!slider) return;

  // Base transaction gas rates in USD
  const baseRates = {
    transfer: { l1: 3.50, l2: 0.08 },
    swap: { l1: 15.00, l2: 0.30 },
    mint: { l1: 45.00, l2: 0.90 }
  };

  function updateSavings() {
    const type = selectType.value;
    const count = parseInt(slider.value);
    
    // Update input display value label
    sliderVal.textContent = `${count} Txns`;

    const rates = baseRates[type];
    const totalL1 = rates.l1 * count;
    const totalL2 = rates.l2 * count;
    const totalSavings = totalL1 - totalL2;

    l1CostText.textContent = `$${totalL1.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    l2CostText.textContent = `$${totalL2.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    savingsText.textContent = `$${totalSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Event bindings
  selectType.addEventListener('change', updateSavings);
  slider.addEventListener('input', updateSavings);

  // Initial load calculator values
  updateSavings();
}

