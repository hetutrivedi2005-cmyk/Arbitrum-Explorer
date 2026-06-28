/**
 * Arbitrum Explorer - Concepts Page JavaScript
 * Includes comparison table row highlighting, interactive trivia reveals,
 * and floating node element modifiers.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTableInteractions();
  initDykInteractions();
  initWalletSandbox();
  initQuizSandbox();
});

/* ==========================================================================
   1. COMPARISON TABLE ROW HIGHLIGHTING
   ========================================================================== */
function initTableInteractions() {
  const tables = document.querySelectorAll('.concept-table');

  tables.forEach(table => {
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
      // Add hover class dynamically for high-fidelity response
      row.addEventListener('mouseenter', () => {
        row.style.background = 'rgba(255, 255, 255, 0.03)';
        row.style.transition = 'background 0.2s ease-in-out';
      });

      row.addEventListener('mouseleave', () => {
        row.style.background = 'transparent';
      });

      // Highlight row on click (helpful for reading across columns)
      row.addEventListener('click', () => {
        // Clear active styles from siblings
        rows.forEach(r => {
          if (r !== row) {
            r.classList.remove('row-focused');
            r.style.borderLeft = 'none';
          }
        });

        // Toggle focus on selected row
        const isFocused = row.classList.toggle('row-focused');
        if (isFocused) {
          row.style.borderLeft = '3px solid var(--accent-cyan)';
          row.style.background = 'rgba(0, 242, 254, 0.05)';
        } else {
          row.style.borderLeft = 'none';
          row.style.background = 'transparent';
        }
      });
    });
  });
}

/* ==========================================================================
   2. "DID YOU KNOW" TRIVIA CARDS CLICK ANIMATIONS
   ========================================================================== */
function initDykInteractions() {
  const dykCards = document.querySelectorAll('.dyk-card');

  dykCards.forEach(card => {
    card.style.cursor = 'pointer';
    
    card.addEventListener('click', () => {
      // Add high-impact glow animation when clicked
      card.style.transform = 'scale(0.98)';
      card.style.borderColor = 'var(--accent-pink)';
      card.style.boxShadow = '0 0 25px rgba(217, 70, 239, 0.25)';
      
      setTimeout(() => {
        card.style.transform = 'none';
        card.style.borderColor = 'var(--accent-cyan)';
        card.style.boxShadow = 'none';
      }, 300);

      // Create minor light particle burst inside card
      createMicroBurst(card);
    });
  });
}

/**
 * Creates a subtle particle element burst inside a container when clicked
 */
function createMicroBurst(container) {
  const rect = container.getBoundingClientRect();
  
  for (let i = 0; i < 5; i++) {
    const spark = document.createElement('span');
    spark.className = 'click-spark';
    
    // Design styles
    spark.style.position = 'absolute';
    spark.style.width = '6px';
    spark.style.height = '6px';
    spark.style.borderRadius = '50%';
    spark.style.background = Math.random() > 0.5 ? 'var(--accent-cyan)' : 'var(--accent-pink)';
    spark.style.pointerEvents = 'none';
    
    // Position at random spot inside container
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    
    container.appendChild(spark);
    
    // Animate outwards and disappear
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 30 + 10;
    
    spark.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`, opacity: 0 }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
    });
    
    setTimeout(() => spark.remove(), 600);
  }
}

/* ==========================================================================
   3. WEB3 WALLET & CRYPTOGRAPHIC SIGNATURE SANDBOX
   ========================================================================== */
async function calculateSHA256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

function initWalletSandbox() {
  const connectBtn = document.getElementById('sim-connect-btn');
  const connectPrompt = document.getElementById('wallet-connect-prompt');
  const connectedPanel = document.getElementById('wallet-connected-panel');
  const signBtn = document.getElementById('sim-sign-btn');
  const signMessage = document.getElementById('sim-sign-message');
  const signatureOutput = document.getElementById('signature-output-box');
  const signatureText = document.getElementById('sim-signature-text');

  if (!connectBtn) return;

  // Simulate Wallet Connection
  connectBtn.addEventListener('click', () => {
    connectBtn.disabled = true;
    connectBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Establishing Node Sync...';
    
    // Smooth delay for decentralized handshake simulation
    setTimeout(() => {
      connectPrompt.style.display = 'none';
      connectedPanel.style.display = 'block';
    }, 1000);
  });

  // Simulate Cryptographic Signing
  signBtn.addEventListener('click', async () => {
    const text = signMessage.value.trim();
    if (!text) return;

    signBtn.disabled = true;
    signBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing with Private Key...';

    // Mock ECDSA signature generation linked mathematically to inputs using SHA-256 hash of message + secret salt
    const dataHash = await calculateSHA256(text + 'arbitrum_explorer_private_secret_key');
    const displaySignature = '0x' + dataHash.substring(0, 54) + '...' + dataHash.substring(dataHash.length - 8);

    setTimeout(() => {
      signatureText.textContent = displaySignature;
      signatureOutput.style.display = 'block';
      
      signBtn.disabled = false;
      signBtn.innerHTML = '<i class="fa-solid fa-pen-nib"></i> Sign Message';
    }, 600);
  });
}

/* ==========================================================================
   4. INTERACTIVE KNOWLEDGE QUIZ SECTION
   ========================================================================== */
function initQuizSandbox() {
  const quizForm = document.getElementById('web3-quiz');
  if (!quizForm) return;

  const questions = quizForm.querySelectorAll('.quiz-question');
  const submitBtn = document.getElementById('quiz-submit-btn');
  const resetBtn = document.getElementById('quiz-reset-btn');
  const resultsPanel = document.getElementById('quiz-results-panel');
  const scoreText = document.getElementById('quiz-results-score');
  const titleText = document.getElementById('quiz-results-title');

  // Correct options mapping config
  const correctAnswers = {
    1: 'b', // Rollup
    2: 'b', // Private key
    3: 'b'  // Nonce
  };

  // Bind option selections click events
  questions.forEach(q => {
    const questionNum = q.getAttribute('data-question');
    const options = q.querySelectorAll('.quiz-option');

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        // Ignore clicks if quiz was already validated/submitted
        if (submitBtn.disabled) return;

        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });
  });

  // Verify Answers action
  submitBtn.addEventListener('click', () => {
    let score = 0;
    let unanswered = false;

    // Check if user answered all questions
    questions.forEach(q => {
      const selected = q.querySelector('.quiz-option.selected');
      if (!selected) {
        unanswered = true;
      }
    });

    if (unanswered) {
      alert('Please select an answer for all three questions before verifying!');
      return;
    }

    // Process validations
    questions.forEach(q => {
      const questionNum = q.getAttribute('data-question');
      const selected = q.querySelector('.quiz-option.selected');
      const selectedLetter = selected.getAttribute('data-option');
      const correctLetter = correctAnswers[questionNum];

      const options = q.querySelectorAll('.quiz-option');
      options.forEach(opt => {
        const optionLetter = opt.getAttribute('data-option');
        
        // Show correct answers visually
        if (optionLetter === correctLetter) {
          opt.classList.add('correct');
        }
        
        // Mark incorrect selected options
        if (opt.classList.contains('selected') && optionLetter !== correctLetter) {
          opt.classList.add('incorrect');
        }
      });

      // Show explain bubble
      const explainBubble = document.getElementById(`q${questionNum}-explanation`);
      if (explainBubble) {
        explainBubble.classList.add('show');
      }

      if (selectedLetter === correctLetter) {
        score++;
      }
    });

    // Update Score Board Panel
    resultsPanel.style.display = 'block';
    scoreText.textContent = `Your Score: ${score} / 3`;
    
    if (score === 3) {
      titleText.textContent = '🏆 Web3 Scalability Expert!';
      resultsPanel.style.border = '1px solid rgba(16, 185, 129, 0.3)';
      resultsPanel.style.background = 'rgba(16, 185, 129, 0.04)';
    } else if (score === 2) {
      titleText.textContent = '🥈 Great Job!';
      resultsPanel.style.border = '1px solid rgba(245, 158, 11, 0.3)';
      resultsPanel.style.background = 'rgba(245, 158, 11, 0.04)';
    } else {
      titleText.textContent = '📚 Keep Learning!';
      resultsPanel.style.border = '1px solid rgba(239, 68, 68, 0.3)';
      resultsPanel.style.background = 'rgba(239, 68, 68, 0.04)';
    }

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.style.cursor = 'not-allowed';
    
    resetBtn.style.display = 'inline-block';
  });

  // Reset Quiz action
  resetBtn.addEventListener('click', () => {
    questions.forEach(q => {
      const options = q.querySelectorAll('.quiz-option');
      options.forEach(o => {
        o.classList.remove('selected', 'correct', 'incorrect');
      });

      const explainBubble = document.getElementById(`q${q.getAttribute('data-question')}-explanation`);
      if (explainBubble) {
        explainBubble.classList.remove('show');
      }
    });

    resultsPanel.style.display = 'none';
    
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.style.cursor = 'pointer';
    
    resetBtn.style.display = 'none';
  });
}

