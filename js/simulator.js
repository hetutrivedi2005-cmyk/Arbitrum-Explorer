/**
 * Arbitrum Explorer - Blockchain Mining Simulator JavaScript
 * Real-time SHA-256 Web Crypto hashing, asynchronous yield mining loops,
 * multi-block state propagation, and visual link validator systems.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBlocks();
});

/* ==========================================================================
   1. STATE MANAGERS & CONFIGURATION
   ========================================================================== */
let isBlock1Valid = false;
let isBlock2Valid = false;
let isMining = false;

// DOM Elements
const block1Card = document.getElementById('block-1-card');
const block1Nonce = document.getElementById('block-1-nonce');
const block1Data = document.getElementById('block-1-data');
const block1Hash = document.getElementById('block-1-hash');
const block1Badge = document.getElementById('block-1-badge');
const block1MineBtn = document.getElementById('block-1-mine-btn');
const block1Overlay = document.getElementById('block-1-overlay');
const block1NonceLive = document.getElementById('block-1-nonce-live');

const block2Card = document.getElementById('block-2-card');
const block2Nonce = document.getElementById('block-2-nonce');
const block2Data = document.getElementById('block-2-data');
const block2Prev = document.getElementById('block-2-prev');
const block2Hash = document.getElementById('block-2-hash');
const block2Badge = document.getElementById('block-2-badge');
const block2MineBtn = document.getElementById('block-2-mine-btn');
const block2Overlay = document.getElementById('block-2-overlay');
const block2NonceLive = document.getElementById('block-2-nonce-live');

const connectorLineH = document.getElementById('connector-line-h');
const connectorLineV = document.getElementById('connector-line-v');

/* ==========================================================================
   2. CRYPTOGRAPHIC HASH HELPER (Web Crypto API)
   ========================================================================== */
/**
 * Generates SHA-256 hex string digest using browser native crypto implementation
 */
async function generateSHA256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/* ==========================================================================
   3. BLOCK CALCULATION & INTEGRITY FLOW
   ========================================================================== */
async function initBlocks() {
  // Bind real-time change triggers
  [block1Nonce, block1Data].forEach(element => {
    element.addEventListener('input', () => {
      if (isMining) return;
      calculateBlock1();
    });
  });

  [block2Nonce, block2Data].forEach(element => {
    element.addEventListener('input', () => {
      if (isMining) return;
      calculateBlock2();
    });
  });

  // Bind Mining buttons
  block1MineBtn.addEventListener('click', () => triggerMine(1));
  block2MineBtn.addEventListener('click', () => triggerMine(2));

  // Run initial calculations
  await calculateBlock1();
}

/**
 * Calculates hash and sets valid state for Block 1. Updates Block 2 previous hash.
 */
async function calculateBlock1() {
  const number = '1';
  const nonce = block1Nonce.value;
  const data = block1Data.value;
  const prevHash = document.getElementById('block-1-prev').value;

  const hash = await generateSHA256(number + nonce + data + prevHash);
  block1Hash.textContent = hash;

  // Verify difficulty (must start with "00")
  isBlock1Valid = hash.startsWith('00');
  updateBlockVisualState(1, isBlock1Valid, hash);

  // Propagate hash to Block 2 prev field
  if (block2Prev) {
    block2Prev.value = hash;
  }

  // Chain reaction calculation on Block 2
  await calculateBlock2();
}

/**
 * Calculates hash and sets valid state for Block 2. Updates global status.
 */
async function calculateBlock2() {
  const number = '2';
  const nonce = block2Nonce.value;
  const data = block2Data.value;
  const prevHash = block2Prev.value;

  const hash = await generateSHA256(number + nonce + data + prevHash);
  block2Hash.textContent = hash;

  // Verify difficulty (must start with "00")
  isBlock2Valid = hash.startsWith('00') && isBlock1Valid; // Block 2 can only be valid if Block 1 is valid too
  updateBlockVisualState(2, isBlock2Valid, hash);

  updateChainIntegrity();
}

/**
 * Modifies badge titles, background classes, and glow alerts for individual blocks
 */
function updateBlockVisualState(blockNum, isValid, hash) {
  const card = blockNum === 1 ? block1Card : block2Card;
  const badge = blockNum === 1 ? block1Badge : block2Badge;
  const hashLabel = blockNum === 1 ? block1Hash : block2Hash;

  if (isValid) {
    card.classList.add('block-valid');
    card.classList.remove('block-invalid');
    
    badge.textContent = 'Valid';
    badge.className = 'block-badge badge-valid';
    
    hashLabel.className = 'monospace-text hash-valid';
  } else {
    card.classList.remove('block-valid');
    card.classList.add('block-invalid');
    
    badge.textContent = 'Invalid';
    badge.className = 'block-badge badge-invalid';
    
    hashLabel.className = 'monospace-text hash-invalid';
  }
}

function updateChainIntegrity() {
  const isValidChain = isBlock1Valid && isBlock2Valid;
  const recText = document.getElementById('recommendation-text');
  const recIcon = document.getElementById('recommendation-icon');
  const recPanel = document.getElementById('simulator-recommendation-panel');

  if (isValidChain) {
    // Green glows
    [connectorLineH, connectorLineV].forEach(line => {
      if (line) {
        line.className.baseVal = 'connector-path path-horizontal connector-valid';
      }
    });

    // Dynamic Recommendation updates (Valid Chain)
    if (recText && recIcon && recPanel) {
      recText.innerHTML = '🎉 Blockchain is fully synchronized and secure! Block 1 and Block 2 hashes are successfully linked. Try editing Block 1\'s data textarea to witness immutability propagation.';
      recIcon.className = 'fa-solid fa-circle-check';
      recIcon.style.color = '#10b981';
      recPanel.style.borderColor = 'rgba(16, 185, 129, 0.3)';
      recPanel.style.background = 'rgba(16, 185, 129, 0.02)';
    }
  } else {
    // Red glows
    [connectorLineH, connectorLineV].forEach(line => {
      if (line) {
        line.className.baseVal = 'connector-path path-horizontal connector-invalid';
      }
    });

    // Dynamic Recommendation updates depending on which block is invalid
    if (recText && recIcon && recPanel) {
      if (!isBlock1Valid) {
        recText.innerHTML = '👉 <strong>Recommendation:</strong> Block 1 is currently INVALID. Click <strong>Mine Block 1</strong> to search for a valid nonce and resolve the Genesis state.';
        recIcon.className = 'fa-solid fa-triangle-exclamation';
        recIcon.style.color = '#ef4444';
        recPanel.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        recPanel.style.background = 'rgba(239, 68, 68, 0.02)';
      } else {
        recText.innerHTML = '👉 <strong>Recommendation:</strong> Block 1 is VALID, but Block 2 remains INVALID because its previous hash link was reset. Click <strong>Mine Block 2</strong> to re-align the validation chain.';
        recIcon.className = 'fa-solid fa-circle-right';
        recIcon.style.color = 'var(--accent-purple)';
        recPanel.style.borderColor = 'rgba(139, 92, 246, 0.3)';
        recPanel.style.background = 'rgba(139, 92, 246, 0.02)';
      }
    }
  }
}

/* ==========================================================================
   4. ASYNCHRONOUS MINING ENGINE
   ========================================================================== */
async function triggerMine(blockNum) {
  if (isMining) return;
  isMining = true;
  toggleInputs(true);

  const overlay = blockNum === 1 ? block1Overlay : block2Overlay;
  const nonceLive = blockNum === 1 ? block1NonceLive : block2NonceLive;
  const inputNonce = blockNum === 1 ? block1Nonce : block2Nonce;
  
  overlay.classList.add('active');

  const number = blockNum.toString();
  const data = blockNum === 1 ? block1Data.value : block2Data.value;
  const prevHash = blockNum === 1 ? document.getElementById('block-1-prev').value : block2Prev.value;
  
  let currentNonce = 0;
  const batchSize = 1200; // Chunk operations to prevent blocking main thread

  async function searchNonce() {
    for (let i = 0; i < batchSize; i++) {
      const hash = await generateSHA256(number + currentNonce + data + prevHash);
      
      if (hash.startsWith('00')) {
        // Success
        inputNonce.value = currentNonce;
        overlay.classList.remove('active');
        
        // Trigger calculation updates
        if (blockNum === 1) {
          await calculateBlock1();
          triggerSuccessFlash(block1Card);
        } else {
          await calculateBlock2();
          triggerSuccessFlash(block2Card);
        }
        
        toggleInputs(false);
        isMining = false;
        return;
      }
      currentNonce++;
    }

    // Yield control back to browser to render live numbers counter
    nonceLive.textContent = currentNonce;
    requestAnimationFrame(searchNonce);
  }

  requestAnimationFrame(searchNonce);
}

/**
 * Disables form textareas, inputs, and mine buttons during active mining loops
 */
function toggleInputs(disable) {
  const inputs = [block1Nonce, block1Data, block2Nonce, block2Data, block1MineBtn, block2MineBtn];
  inputs.forEach(input => {
    if (input) {
      input.disabled = disable;
      if (disable) {
        input.style.opacity = '0.5';
        input.style.cursor = 'not-allowed';
      } else {
        input.style.opacity = '1';
        input.style.cursor = 'auto';
      }
    }
  });
}

/**
 * Triggers a temporary success green radial glow animation on a block card
 */
function triggerSuccessFlash(card) {
  card.classList.add('flash-success');
  setTimeout(() => {
    card.classList.remove('flash-success');
  }, 1000);
}
